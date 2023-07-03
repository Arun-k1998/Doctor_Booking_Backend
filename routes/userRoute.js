const express = require('express')


const user_Route = express.Router()

const userController = require('../controller/userController')
user_Route.post('/signup',userController.signup)
user_Route.post('/login',userController.login)
module.exports = user_Route