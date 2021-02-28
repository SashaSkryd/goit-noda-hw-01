const {
  Types: { ObjectId },
} = require("mongoose")
const path = require("path")
const fs = require("fs").promises
const { existsSync } = require("fs")
const dotenv = require("dotenv")
const User = require("./user.js")
const Joi = require("joi")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
mongoose.set("useFindAndModify", false)
const Avatar = require("avatar-builder")
const { v4: uuidv4 } = require("uuid")
const sgMail = require("@sendgrid/mail")

dotenv.config()

function validateUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().required(),
  })
  const validationResult = validationRules.validate(req.body)
  if (validationResult.error) {
    return res.status(400).send(validationResult.error.message)
  }
  next()
}

async function createUser(req, res) {
  const { body } = req
  const userToken = uuidv4()
  try {
    sendMail(userToken, body.email)
    const avatar = Avatar.catBuilder(128)
    avatar.create().then((buffer) => fs.writeFile("tmp/avatar.png", buffer))
    const nameAv = Date.now()
    fs.rename("tmp/avatar.png", `public/images/${nameAv}.png`)
    const hashedPassword = await bcrypt.hash(body.password, 8)
    const user = await User.create({
      ...body,
      password: hashedPassword,
      token: "",
      avatarURL: `http://localhost:5500/images/${nameAv}.png`,
      verificationToken: userToken,
    })
    const { subscription, email } = user
    res.status(201).json({
      user: {
        email: email,
        subscription: subscription,
      },
    })
  } catch (error) {
    res.status(409).send("Email in use")
  }
}

async function login(req, res) {
  const { email, password } = req.body

  const user = await User.findOne({
    email,
  })

  if (!user) {
    return res.status(401).send("Email or password is wrong")
  }

  const paswordValid = await bcrypt.compare(password, user.password)

  if (!paswordValid) {
    return res.status(401).send("Email or password is wrong")
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.TOKEN
  )

  await User.findByIdAndUpdate(user._id, { token: token })

  return res.status(200).json({
    token: token,
    user: {
      email: email,
      subscription: user.subscription,
    },
  })
}

async function logoutUser(req, res) {
  await User.findByIdAndUpdate(userId, { token: "" })

  return res.status(204).send("No Content")
}

async function currentUser(req, res) {
  const { email, subscription } = req.user

  return res.status(200).json({ email: email, subscription: subscription })
}

async function subscription(req, res) {
  const {
    params: { userid },
  } = req
  const { subscription } = req.body

  if (subscription === "free" || subscription === "pro" || subscription === "premium") {
    const newSub = await User.findByIdAndUpdate(userid, { subscription: subscription }, { new: true })
    return res.status(201).json({ email: newSub.email, subscription: newSub.subscription })
  }
}

async function updateUser(req, res) {
  switch (true) {
    case !!req.body.password && !!req.file:
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      deleteAvatar(req.user.avatarURL)
      await User.findByIdAndUpdate(
        req.user._id,
        { ...req.body, password: hashedPassword, avatarURL: `http://localhost:5500/images/${req.file.filename}` },
        { new: true }
      )
      res.status(200).json({ avatarURL: `http://localhost:5500/images/${req.file.filename}` })
      break
    case !!req.body.password:
      await bcrypt.hash(req.body.password, 10)
      await User.findByIdAndUpdate(req.user._id, { ...req.body, password: hashedPasswor }, { new: true })
      res.status(200).send("Data updated")
      break
    case !!req.file:
      console.log(req.user)
      deleteAvatar(req.user.avatarURL)
      await User.findByIdAndUpdate(
        req.user._id,
        { ...req.body, avatarURL: `http://localhost:5500/images/${req.file.filename}` },
        { new: true }
      )
      res.status(200).json({ avatarURL: `http://localhost:5500/images/${req.file.filename}` })
      break
    default:
      await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
      res.status(200).send("Data updated")
  }
}

function deleteAvatar(avatarURL) {
  const url = avatarURL.replace("http://localhost:5500/images/", "")

  if (existsSync(`public/images/${url}`)) {
    fs.unlink(path.join("public/images", url))
  }
}

function validationAvatar(req, res, next) {
  const validationRules = Joi.object({
    subscription: Joi.string().valid("free", "pro", "premium"),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string(),
  })
  const validationResult = validationRules.validate(req.body)
  console.log()
  if (validationResult.error) {
    return res.status(400).send({ message: "missing required name field" })
  }
  next()
}

async function confirmEmail(req, res) {
  const {
    params: { verificationToken },
  } = req

  const user = await User.findOne({
    verificationToken,
  })
  if (!user) {
    return res.status(404).send("User not found")
  }
  const conectUser = await User.findByIdAndUpdate(user._id, { verificationToken: "" })
  console.log(conectUser)
  return res.status(200).send("successfull")
}
async function sendMail(token, email) {
  try {
    console.log("email", email)
    console.log("token", token)
    const msg = {
      to: email,
      from: "sashaskryd@gmail.com",
      subject: "Please verify your account",
      html: `Welcome to our application! To verify your account please go by <a href="http://localhost:5500/auth/users/verify/${token}">link</a>`,
    }

    await sgMail.send(msg)
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  confirmEmail,
  createUser,
  validateUser,
  login,
  logoutUser,
  currentUser,
  subscription,
  updateUser,
  validationAvatar,
}
