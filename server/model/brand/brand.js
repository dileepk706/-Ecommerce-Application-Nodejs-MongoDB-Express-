const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const brandSchema = new Schema({
  name: {
    type: String,
    required:true,
    trim:true,
  },
  image: {
    type: String
  },
  products: [{
    required:true,
    type: Schema.Types.ObjectId,
    ref: 'product'
  }],
  category_name:{
    type:String,
    required:true
  }
},{timestamps : true});

module.exports = mongoose.model('brand', brandSchema);