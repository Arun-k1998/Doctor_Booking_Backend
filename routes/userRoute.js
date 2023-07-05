const express = require('express')
const session = require('express-session')


const user_Route = express.Router()

user_Route.use(session({
    secret: 'hello '
}));

const userController = require('../controller/userController')
user_Route.post('/signup',userController.signup)
user_Route.post('/login',userController.login)
user_Route.post('/verify_otp',userController.otpVerification)
user_Route.post('/resendotp',userController.resendOTP)
module.exports = user_Route