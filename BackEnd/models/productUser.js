const mongoose = require('mongoose');

const ProductUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
});

module.exports = mongoose.model('ProductUser', ProductUserSchema);
