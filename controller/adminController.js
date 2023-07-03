const admin = require('../model/adminModel')
const users = require('../model/useModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const login = async(req,res)=>{
    const {email,password} = req.body
    try {
        const adminData = await admin.findOne({email,email})
        if(adminData){
            const comparedPassword = await bcrypt.compare(password,adminData.password)
            console.log(comparedPassword);
            if(comparedPassword){
                const token = jwt.sign({id:adminData._id},'adminSecrectKey123',{expiresIn:"2d"})
                res.status(200).json({status:true,token,message:'Successfully Login'})
            }else{
                res.status(400).json({status:false,message:'Incorrect Password'})
            }

        }else{
            res.status(404).json({status:false,message:'User Not Found'})
        }



    } catch (error) {
        console.log(error.message);
    }
}

const bannerUpload = async(req,res)=>{
    try {
        const {title,description} = req.body
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    login
}