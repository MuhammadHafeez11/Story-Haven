const express = require('express');
const Book = require('../models/bookModel');
const Category = require('../models/categoryModel');
const Author = require('../models/authorModel');
const router = express.Router();

// Unified search route
router.get('/', async (req, res, next) => {
  try {
    const searchTerm = decodeURIComponent(req.query.q);

    // Find book by title
    let books = await Book.find({ title: new RegExp(searchTerm, 'i') })
      .populate('authorID')
      .populate('categoryID');

    // If no books by title, try finding by author
    if (!books.length) {
      const author = await Author.findOne({ name: new RegExp(searchTerm, 'i') });
      if (author) {
        books = await Book.find({ authorID: author._id })
          .populate('authorID')
          .populate('categoryID');
      }
    }

    // If no books by author, try finding by category
    if (!books.length) {
      const category = await Category.findOne({ name: new RegExp(searchTerm, 'i') });
      if (category) {
        books = await Book.find({ categoryID: category._id })
          .populate('authorID')
          .populate('categoryID');
      }
    }

    if (books.length) {
      res.json(books);
    } else {
      res.json({ message: 'No books found' });
    }
  } catch (error) {
    next(error); // Pass the error to the errorHandler middleware
  }
});

module.exports = router;
