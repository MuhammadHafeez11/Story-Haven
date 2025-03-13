const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
});

module.exports = mongoose.model('Color', colorSchema);
