const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    countryCode:{
        type:Number,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String
    },
    image:{
        type:String
    },
    notifications:{
        type:[String]
    },
    documents:[{
        name:{
            type:String
        },
        image:{
            type:String
        }
    }],
    isAdmin:{
        type:Boolean,
        default:false
    },
    is_Blocked:{
        type:Boolean,
        default:false
    }

})

module.exports = mongoose.model('User',userSchema)