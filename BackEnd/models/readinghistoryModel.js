const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    startTime: {type: String},
    endTime: {type:String},
    numberOfPagesRead: {type: Number,required: true}
  });

const ReadingHistory = mongoose.model('ReadingHistory', readingHistorySchema);
 module.exports = ReadingHistory;
  