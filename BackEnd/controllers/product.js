const Product = require('../models/productModel');

async function newProduct(req, res, next) {
    try {
        const { productName, productCode, categoryId, price } = req.body;

        if (!productName || !productCode || !categoryId || !price) {
            const error = new Error('All fields are required and should not be empty.');
            error.statusCode = 400;
            throw error;
        }

        // Check for duplicate product by productCode or productName
        const existingProduct = await Product.findOne({
            $or: [
                { productCode: productCode },
            ]
        });

        if (existingProduct) {
            const error = new Error('A product with this code or name already exists.');
            error.statusCode = 409; // Conflict error
            throw error;
        }

        let product = new Product({
            productName,
            productCode,
            categoryId,
            price
        });
        await product.save();
        res.status(200).json({ message: 'Product uploaded successfully!', product });
    } catch (err) {
        next(err);
    }
}


async function getProductById(req, res, next) {
    try {
        const product = await Product.findOne({ _id: req.params.id }).populate('categoryId');
        if (product) {
            res.json(product);
        } else {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        next(err);
    }
}

async function getProduct(req, res, next) {
    try {
        let data = await Product.find().populate('categoryId');
        res.send(data);
    } catch (err) {
        next(err);
    }
}

async function updatePrice(req, res, next) {
    const id = req.params.id;
    const {price} = req.body;

     if(!price){
        return res.status(404).json({ status: "Error", message: "Enter Price!!!" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            { _id: id },
            { $set: { price } },
            { new: true } 
          );
      
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    newProduct,
    getProduct,
    updatePrice,
    getProductById,
}