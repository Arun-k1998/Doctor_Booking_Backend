const jwt = require("jsonwebtoken");
const users = require('../model/useModel')
async function userAuth(req, res, next) {
  try {
    
    const authorization = req.headers['authorization'];
    if(!authorization){ console.log("Authorization header required")}
    const token = authorization.replace('Bearer ',"")
    const verify = jwt.verify(token,process.env.JSON_SECRET_KEY)
    const user = await users.findById(verify.id)
    if(!user) throw new Error('User not found')
    req.user = {_id:user._id,firstName:user.firstName,email:user.email}
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

module.exports = userAuth;
