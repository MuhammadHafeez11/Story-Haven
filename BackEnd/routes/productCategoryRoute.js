const express = require('express');
const { createProductCategory, getAllProductCategory, getCategoryById } = require('../controllers/productCategoryController');
const router = express.Router();

router.post('/new', createProductCategory);
router.get('/get', getAllProductCategory);
router.get('/get/:id', getCategoryById);

module.exports = router;
