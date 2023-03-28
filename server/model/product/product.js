const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim:true
  },
  quantity: {
    type: Number,
    trim:true
  },
  price: {
    type: Number,
    required: true,
    trim:true
  },
  image: [{
    type: String
  }],
  description: {
    type: String
  },
  isDeleted: { 
    type: Boolean,
    default: false 
  },
  brand_name: {
    type: String,
    trim:true
  }, 
  category: {
    type: String,

  },
  subcategory:{
    type:String
  },
  created_by: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'admin'
  }]
  
  //   rating: [{
//     type: Number
//   }],

//   review: [{
//     type: String
//   }],
},{timestamps : true});

module.exports = mongoose.model('product', productSchema);