const admin = require('../model/adminModel')
const users = require('../model/useModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const banner = require('../model/bannerModel')
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
        console.log(title,description);
        const newBanner = new banner({
            title,
            description,
            image:req.file.filename
        })
        const  bannerData = await newBanner.save()
        if(bannerData) res.status(201).json({status:true,message:"successfully created"})

    } catch (error) {
        console.log(error.message);
    }
}

const banners = async(req,res)=>{
    try {
        const bannerCollection = await banner.find({is_delete:false})
        res.json({status : true,banners:bannerCollection})
    } catch (error) {
        console.log(error.message);
    }
}

const deleteBanner = async(req,res)=>{
    try {
        console.log(req.body.id);
        const bannerData = await banner.findByIdAndUpdate(req.body.id,{is_delete:true})
        if(bannerData){
            res.json({
                status:true,
                message:'Successfully deleted'
            })
        }
        
    } catch (error) {
        
        console.log(error.message);
        res.json({
            status:false,
            message:"Can't find the data"
        })
    } 
}


module.exports = {
    login,
    bannerUpload,
    banners,
    deleteBanner
}