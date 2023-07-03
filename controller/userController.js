const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Schema
const users = require("../model/useModel");
// const admin = require('../model/adminModel')
async function hash(value) {
  const hashData = await bcrypt.hash(value, 10);
  return hashData;
}

const signup = async (req, res) => {
  try {
    const newUser = req.body;
    const userInEmail = await users.findOne({ email: newUser.email });
    if (!userInEmail) {
      const userInPhoneNumber = await users.findOne({
        phoneNumber: newUser.phoneNumber,
      });
      if (!userInPhoneNumber) {
        const hashPassword = await hash(newUser.password);

        newUser.password = hashPassword;
        const userData = new users(newUser);
        await userData.save();
        if (userData) {
          res.json({
            message: "successfully created account",
            user: userData,
          });
        } else {
          console.log("server error");
          res.status(501);
          res.json({
            message: "server error",
          });
        }
      } else {
        res.json({
          message: "Phone Number already exit",
        });
      }
    } else {
      res.json({
        message: "Email already exits",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const login = async(req,res)=>{
    const {email,password} = req.body
    try {
        const user = await users.findOne({email:email})
        if(user){
            if(!user.is_Blocked){
                const comparedPassword = bcrypt.compare(password,user.password)
                if(comparedPassword){
                  const token = await jwt.sign({id:user._id},'jsonwebSecretKey',{expiresIn:'2d'})
                 
                    res.json({
                        token,
                        message:'Success'
                    })
                }else{
                    res.json({message:"Password didn't match"})
                }
            }else{
                res.json({message:'Account get blocked'})
            }
        }else{
            res.json({
                message:'email not exit'
            })
        }
        
    } catch (error) {
        res.json({message:error.message})
    }
}
module.exports = {
  signup,
  login
};
