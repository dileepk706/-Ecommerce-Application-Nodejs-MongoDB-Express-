var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminShema = new Schema({
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
  }

},{timestamps : true});
 
module.exports = mongoose.model('admin', adminShema);
