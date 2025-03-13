const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  colorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
  quantity: { type: Number, require: true }
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
