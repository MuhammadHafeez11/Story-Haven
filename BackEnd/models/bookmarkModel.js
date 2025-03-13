const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  pageNumber: { type: Number, required: true }
});

const BookMark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = BookMark;
