const Book = require('../models/bookModel');
const Author = require('../models/authorModel');
const Category = require('../models/categoryModel');
const path = require('path');
const fs = require('fs');

async function handleUploadBook(req, res, next) {
    try {
        // console.log(req.body);
        const { title, description, authorID, categoryID ,price } = req.body;

        let coverImage;
        let pdfFile;
        if (req.files) {
            coverImage = req.files.image ? req.files.image[0].path.replace(/^.*[\\/](Uploads[\\/])?/, '') : null;
            pdfFile = req.files.pdf ? req.files.pdf[0].path.replace(/^.*[\\/](Uploads[\\/])?/, '') : null;
        }

        if (!title || !description || !price || !coverImage || !authorID || !categoryID || !pdfFile) {
            const error = new Error('All fields are required and should not be empty.');
            error.statusCode = 400;
            throw error;
        }

        let data = new Book({ title, description, price, coverImage, pdfFile, authorID, categoryID });
        // console.log(data);
        await data.save();
        res.status(201).send('Book uploaded successfully!');
    } catch (err) {
        next(err);
    }
}

async function handleGetAllBooks(req, res, next) {
    try {
        let data = await Book.find().populate('authorID').populate('categoryID');
        res.send(data);
    } catch (err) {
        next(err);
    }
}

async function handleGetBookById(req, res, next) {
    try {
        let data = await Book.findById({ _id: req.params.id }).populate('authorID').populate('categoryID');
        res.send(data);
    } catch (err) {
        next(err);
    }
}

async function handleGetBookByName(req, res, next) {
    try {
        let data = await Book.find({ title: req.params.title }).populate('authorID').populate('categoryID');
        res.send(data);
    } catch (err) {
        next(err);
    }
}

async function handleDeleteBookById(req, res, next) {
    try {
        let data = await Book.deleteOne({ _id: req.params.id });
        res.send(data);
    } catch (err) {
        next(err);
    }
}


async function handleUpdateBookIsFeaturedStatus(req, res, next) {
    try {
        const { isFeatured } = req.body;
        const _id = req.params.id;

        // Find the author by ID and update the isFeatured field
        const updatedBook = await Book.findByIdAndUpdate(
            _id,
            { isFeatured: isFeatured },
            { new: true } // Return the updated document
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book featured status updated successfully',  updatedBook });
    } catch (error) {
        next(error);
    }
}

async function handleUpdateBookById(req, res, next) {
    try {
        const { title, description, price, categoryID, authorID } = req.body;
        let coverImage, pdfFile;

        if (req.files && req.files.image) {
            coverImage = req.files.image ? req.files.image[0].path.replace(/^.*[\\/](Uploads[\\/])?/, '') : null;
        }
        
        if (req.files && req.files.pdf) {
            pdfFile = req.files.pdf ? req.files.pdf[0].path.replace(/^.*[\\/](Uploads[\\/])?/, '') : null;
        }
        
        let updateFields = { title, description, price, categoryID, authorID, coverImage, pdfFile };
        // console.log(updateFields);

        let data = await Book.findByIdAndUpdate({ _id: req.params.id }, { $set: updateFields });
        res.send(data);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    handleUploadBook,
    handleGetAllBooks,
    handleGetBookById,
    handleUpdateBookById,
    handleDeleteBookById,
    handleGetBookByName,
    handleUpdateBookIsFeaturedStatus
};
