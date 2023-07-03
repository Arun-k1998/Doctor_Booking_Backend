const express = require('express')


const admin_Route = express.Router()
const adminController = require('../controller/adminController')
admin_Route.post('/login',adminController.login)



module.exports = admin_Route