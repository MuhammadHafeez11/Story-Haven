const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  purchaseDate: { type: Date, default: Date.now },
  cardInfo: { type: String, required: true },
  cardHolderName: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  isApproved: { type: Boolean, default: false }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
