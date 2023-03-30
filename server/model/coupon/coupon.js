const mongoose  = require('mongoose')

const couponSchema = new mongoose.Schema({
  
    couponCode : {
        type:String,
        required:true
    },
    discountType:{
        type:String,
        required:true
    },
    couponAmount:{
        type:Number,
        required:true
    },
    minCartAmount:{
        type:Number
    },
    minRedeemAmount:{
        type:Number,
        requied:true
    },
    expiryDate:{
        type:Date
    },
    quantity:{
        type:Number,
        required:true
    },
    used:{
        type:Array
    },
    disable:{
        type:Boolean,
        default:false,
    }
},{timestamps:true})

module.exports = mongoose.model('coupon',couponSchema)