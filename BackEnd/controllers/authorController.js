const Author = require('../models/authorModel');

async function handleUploadAuthor(req, res, next) {
    try {
        const { name, biography } = req.body;
        const photo = req.file ? req.file.path.replace(/^.*[\\/](Uploads[\\/])?/, '') : null;

        if (!name || !biography || !photo) {
            const error = new Error('All fields are required and should not be empty.');
            error.statusCode = 400;
            throw error;
        }

        let data = new Author({ name, biography, photo });
        await data.save();
        res.status(201).send('Author uploaded successfully!');
    } catch (err) {
        next(err);
    }
}

async function handleGetIdByName(req, res, next) {
    try {
        const author = await Author.findOne({ name: req.params.name });
        if (author) {
            res.json(author);
        } else {
            const error = new Error('Author not found');
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        next(err);
    }
}

async function handleGetAuthorById(req, res, next) {
    try {
        const author = await Author.findOne({ _id: req.params.id });
        if (author) {
            res.json(author);
        } else {
            const error = new Error('Author not found');
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        next(err);
    }
}

async function handleGetAllAuthor(req, res, next) {
    try {
        let data = await Author.find();
        res.send(data);
    } catch (err) {
        next(err);
    }
}

async function handleUpdateAuthorById(req, res, next) {
    try {
        const { name, biography } = req.body;
        let photo;
        if (req.file) {
            photo = req.file ? req.file.path.replace(/^.*[\\/](Uploads[\\/])?/, '') : null;
        }

        const updatingFields = { name, biography, photo };
        const data = await Author.findByIdAndUpdate({ _id: req.params.id }, { $set: updatingFields });
        res.send(data);
    } catch (err) {
        next(err);
    }
}


async function handleUpdateFeaturedStatus(req, res, next) {
    try {
        const { isFeatured } = req.body;
        const _id = req.params.id;

        // Find the author by ID and update the isFeatured field
        const updatedAuthor = await Author.findByIdAndUpdate(
            _id,
            { isFeatured: isFeatured },
            { new: true } // Return the updated document
        );

        if (!updatedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }

        res.status(200).json({ message: 'Author featured status updated successfully', author: updatedAuthor });
    } catch (error) {
        next(error);
    }
}


async function handleDeleteAuthorById(req, res, next) {
    try {
        let data = await Author.deleteOne({ _id: req.params.id });
        res.send(data);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    handleDeleteAuthorById,
    handleGetAllAuthor,
    handleUpdateAuthorById,
    handleUploadAuthor,
    handleGetIdByName,
    handleGetAuthorById,
    handleUpdateFeaturedStatus
};
