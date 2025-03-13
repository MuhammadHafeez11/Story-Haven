const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {type:String, required: true },
    productCode: {type:String, unique: true, required: true},
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true},
    price: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema)
module.exports = Product;