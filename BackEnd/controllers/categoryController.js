const Category = require('../models/categoryModel');

async function handleUploadCategory(req, res, next) {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            const error = new Error('All fields are required and should not be empty.');
            error.statusCode = 400;
            throw error;
        }

        let data = new Category(req.body);
        let result = await data.save();
        return res.send(result);
    } catch (err) {
        next(err);
    }
}

async function handleGetAllCategories(req, res, next) {
    try {
        let data = await Category.find();
        return res.send(data);
    } catch (err) {
        next(err);
    }
}

async function handleUpdateCategoryById(req, res, next) {
    try {
        let data = await Category.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body });
        return res.send(data);
    } catch (err) {
        next(err);
    }
}

async function handleGetCategoryById(req, res, next) {
    try {
        let data = await Category.find({ _id: req.params.id });
        return res.send(data);
    } catch (err) {
        next(err);
    }
}


async function handleUpdateCategoryIsFeaturedStatus(req, res, next) {
    try {
        const { isFeatured } = req.body;
        const _id = req.params.id;

        // Find the author by ID and update the isFeatured field
        const updatedCategory = await Category.findByIdAndUpdate(
            _id,
            { isFeatured: isFeatured },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Author not found' });
        }

        res.status(200).json({ message: 'Author featured status updated successfully',  updatedCategory });
    } catch (error) {
        next(error);
    }
}


async function handleDeleteCategoryById(req, res, next) {
    try {
        let data = await Category.findByIdAndDelete({ _id: req.params.id });
        return res.send(data);
    } catch (err) {
        next(err);
    }
}

async function handleGetIdByName(req, res, next) {
    try {
        const category = await Category.findOne({ name: req.params.name });
        // console.log(category);
        if (category) {
            res.json(category);
        } else {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    handleDeleteCategoryById,
    handleGetAllCategories, 
    handleUpdateCategoryById,
    handleUploadCategory,
    handleGetIdByName,
    handleUpdateCategoryIsFeaturedStatus,
    handleGetCategoryById,
};
