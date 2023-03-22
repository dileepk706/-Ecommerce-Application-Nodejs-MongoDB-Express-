const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required:true
    },
    orderId:{
        type:String
    },
    items:{
      type:Array
    },
    shippingAddress: {
        type:String
    },
    status: {
      type: String,
      enum: ['placed', 'shipped', 'delivered'],
      default: 'placed'
    },
    paymentMethod: {
      type: String,
      enum: ['online payment', 'COD',],
      required: true
    },
    total_amount:{
        type:Number
    },

  }, { timestamps: true });
  
module.exports = mongoose.model('order', orderSchema);
