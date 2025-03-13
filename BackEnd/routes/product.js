const express  = require('express');
const { newProduct, getProduct, getProductById, updatePrice } = require('../controllers/product');
const router = express.Router();

router.post('/new', newProduct)
router.get('/get', getProduct)
router.get('/get/:id', getProductById);
router.put('/updatePrice/:id', updatePrice);

module.exports = router;