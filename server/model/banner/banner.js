const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bannerSchema = new Schema({
  name: {
    type: String,
    required:true,
    trim:true,
  },
  image: {
    type: String
  },
 
  category_name:{
    type:String,
    required:true
  }
},{timestamps : true});

module.exports = mongoose.model('banner', bannerSchema);