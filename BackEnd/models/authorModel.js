const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  biography: { type: String, required: true },
  photo: { type: String, required: true },
  isFeatured: { type: Boolean, default: false }, 
});

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;