const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);
