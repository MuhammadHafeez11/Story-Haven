const ProductCategory = require('../models/productCategoryModel');

// Create a new role
exports.createProductCategory = async (req, res) => {
    const { name, description } = req.body;

    if( !name ){
        const error = new Error("Name is required.");
        error.statusCode = 400;
        return next(error);
    }

  try {
    const productCategory = new ProductCategory({name, description});
    await productCategory.save();
    res.status(201).json({ success: true, data: productCategory });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all roles
exports.getAllProductCategory = async (req, res) => {
  try {
    const productCategory = await ProductCategory.find();
    res.status(200).json({ success: true, data: productCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
};