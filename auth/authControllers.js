const User = require("../user/user.js")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

async function validToken(req, res, next) {
  const authorizationHeader = req.get("Authorization")

  if (!authorizationHeader) {
    return res.status(401).send({ message: "Not authorized" })
  }
  const token = authorizationHeader.replace("Bearer ", "")

  try {
    const payload = await jwt.verify(token, process.env.TOKEN)
    const { userId } = payload

    const user = await User.findById(userId)

    if (!user) {
      return res.status(401).send({ message: "Not authorized" })
    }

    req.user = user

    next()
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" })
  }
}
module.exports = { validToken }
