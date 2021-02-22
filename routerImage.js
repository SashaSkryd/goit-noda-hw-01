const path = require("path")
const express = require("express")
const router = express()
// const avatar = require('./generatorAvatar.js');

// console.log(avatar);

// router.use(logger("dev"));

// let a = fs.rename('tmp/avatar.png', 'publick/images/avatar1.png', (err) => {
//     if (err) {
//         throw err;
//     }
// });

router.use(express.static(path.join("public/images")))

module.exports = router