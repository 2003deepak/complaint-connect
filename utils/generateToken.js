const jwt = require('jsonwebtoken');

const generateToken = (user,role) =>{
    return jwt.sign({username : user.username , id : user._id , role : role },process.env.JWT_KEY)  
}

const generateTokenForOther = (role) =>{
    return jwt.sign({role : role },process.env.JWT_KEY)  
}

module.exports = {generateToken, generateTokenForOther};