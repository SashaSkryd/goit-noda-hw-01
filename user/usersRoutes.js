const Router = require("express");
const logger = require("morgan");
const {createUser,validateUser, login, logoutUser, currentUser, subscription} = require("./usersControllers");
const {validToken}=require("../auth/authControllers")

const router = Router();

router.use(logger("dev"));

router.post("/register", validateUser, createUser);
router.post("/login", login );
router.get("/logout",validToken ,logoutUser);
router.get("/current",validToken,  currentUser );
router.patch("/:userid", validToken, subscription );


module.exports = router;
