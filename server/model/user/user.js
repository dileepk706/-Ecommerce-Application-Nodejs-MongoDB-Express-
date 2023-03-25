var mongoose = require('mongoose');
const { Number } = require('twilio/lib/twiml/VoiceResponse');
const  Schema = mongoose.Schema;
const  userShema = new Schema({
  name: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    trim:true,
    unique:true
  },
  phone: {
    type: Number

  },
  password: {
    type: String,
    required: true,
    trim:true,
  },
  status: {
    type: Boolean,
    default:true
  },
  coupen: [{
    type: Schema.Types.ObjectId,
    ref: 'coupen'
  }],
  address: [{
    name:{
      type: String,
    },
    phone:{
      type: Number
    },
    address:{
      type:String
    },
    pincode:{
      type:String
    },
    state:{
      type:String
    },
    landmark:{
      type:String
    },
    city:{
      type:String
    }    
  }],
  tocken:{
    type:String,
    default:""
  },
  is_varified:{
    type:Boolean,
    default:true
  },
  cart_total:{
    type:Number
  },
  wishlist:[
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'product'
    }
  ],
resetPasswordToken:{
  type:String
},
resetPasswordExpires:{
  type:Date
}
},{timestamps : true});
 
module.exports = mongoose.model('user', userShema);
