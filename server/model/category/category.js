const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim:true
    },
    isDeleted: {  
      type: Boolean,
      default: false 
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    }],
  });
  
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String 
  },
  isDeleted: { 
    type: Boolean,
    default: false 
  },
  subcategories: [subcategorySchema],
},{timestamps : true});

module.exports = mongoose.model('Category', categorySchema);

