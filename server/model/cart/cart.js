var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var cartShema = new Schema({
//   total_amout: {
//     type: Number
//   },
//   product: [{
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref: 'product'
//   }],

// });

const cartShema = new Schema({
  user_id:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  product:[
    {
      item:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'product'
      },
      quantity:{
        type: Number,
      },
      sub_total:{
        type:Number
      },
      status:{
        type: String,
        enum: ['placed', 'shipped', 'delivered','cancelled','return','refund-approved','return-denied'],
        
        default: 'placed'
      },
      
    }
],
  total_amount:{
    type:Number
  }
 
})

module.exports = mongoose.model('cart', cartShema);
