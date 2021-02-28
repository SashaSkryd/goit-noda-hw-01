const Router = require("express")
const logger = require("morgan")
const {
  createUser,
  validateUser,
  login,
  logoutUser,
  currentUser,
  subscription,
  validationAvatar,
  updateUser,
  confirmEmail,
} = require("./usersControllers")
const { validToken } = require("../auth/authControllers")

const router = Router()

const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images")
  },

  filename: function (req, file, cb) {
    const { ext } = path.parse(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  },
})

const upload = multer({ storage })

router.use(logger("dev"))

router.post("/register", validateUser, createUser)
router.post("/login", login)
router.get("/logout", validToken, logoutUser)
router.get("/current", validToken, currentUser)
router.patch("/avatars", validToken, upload.single("avatar"), validationAvatar, updateUser)
router.patch("/:userid", validToken, subscription)
router.get("/verify/:verificationToken", confirmEmail)

module.exports = router
