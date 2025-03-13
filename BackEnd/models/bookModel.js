const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
    title: {type:String, required: true },
    description: {type:String, required: true },
    coverImage: {type:String, required: true} ,
    pdfFile: { type: String, required:true},
    price: { type: Number, required: true },
    authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isFeatured: { type: Boolean, default: false }, 
});

const Book = mongoose.model('Book', booksSchema)
module.exports = Book;
