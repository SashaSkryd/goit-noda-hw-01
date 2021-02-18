const Avatar = require('avatar-builder');
const fs = require('fs') 

const avatar = Avatar.catBuilder(128);
 
avatar.create().then(buffer => fs.writeFileSync('tmp/avatar.png', buffer,))

module.exports = avatar