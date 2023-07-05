const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
//Schema
const users = require("../model/useModel");
const token = require("../model/tokenModel")
const sendEmail = require("../utils/sendEmail")
// const admin = require('../model/adminModel')


const {TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,TWILIO_SERVICE_SID} = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,{lazyLoading: true})


async function hash(value) {
  const hashData = await bcrypt.hash(value, 10);
  return hashData;
}

const signup = async (req, res) => {
  const country_code = req.body. country_code
  const phone = req.body.phoneNumber
  try {
    const newUser = req.body;
    const userInEmail = await users.findOne({ email: newUser.email });
    if (!userInEmail) {
      const userInPhoneNumber = await users.findOne({
        phoneNumber: newUser.phoneNumber,
      });
      if (!userInPhoneNumber) {
        // const hashPassword = await hash(newUser.password);

        // newUser.password = hashPassword;
        // const userData = new users(newUser);
        // await userData.save();
        
          
          // const Token = new token({
          //   userId:userData._id,
          //   token:crypto.randomBytes(32).toString('hex')
          // }).save()

          // const url = `${process.env.BASE_URL}/user/${userData._id}/verify/${Token.token}`
          // await sendEmail(userData.email,'Verify email',url)
          console.log(1);
          req.session.user = req.body
          console.log(req.session.user);
          await client.verify.
          v2.services(TWILIO_SERVICE_SID)
          .verifications.create({
              to:`${country_code}${phone}`,
              channel : 'sms'
          }).then(verification=>{
             req.session.before = Date.now()
             console.log(req.session.before)
             
              console.log(verification.status);
          }).catch((err)=> console.log(err.message) )


          res.json({
            status:true,
            message: "successfully created account",
            
          })


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

const otpVerification = async(req,res)=>{
  try {
        const {phoneNumber,country_code,firstName,lastName,email,password,otp} = req.body;
       
        
        const verifiedMessage= await client.verify.v2.services(TWILIO_SERVICE_SID).
       verificationChecks.create({
        to: `+${country_code}${phoneNumber}`,
        code: otp
       })
    
       if(verifiedMessage.status === 'approved'){
       const spassword = await hash(password);
       const user = new users({
            firstName : firstName,
            lastName : lastName,
            email : email,
            phoneNumber : phoneNumber,
            password : spassword,
            countryCode:country_code
            
        })
        const userData = await user.save();
        res.json({
          status:true,
          message:'User Created',
          user:userData
        })
      }
  } catch (error) {
    console.log(error.message);
  }
}

const resendOTP = async(req,res)=>{
  try {
    const {phoneNumber,country_code} = req.body
  console.log(country_code);
  console.log(phoneNumber);
    
    await client.verify.
    v2.services(TWILIO_SERVICE_SID)
    .verifications.create({
        to:`${country_code}${phoneNumber}`,
       
        channel : 'sms'
    }).then(verification=>{
        req.session.before = Date.now()
        console.log(verification.status);

    });
    res.json({
      status:true,
      message:'Successfully send otp',
    })


  } catch (error) {
    console.log(error.message);
  }
}

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
  login,
  otpVerification,
  resendOTP
};
