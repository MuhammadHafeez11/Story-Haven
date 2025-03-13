const express = require('express');
const router = express.Router();
const { handleAddToCart, handleGetCartItems, handleRemoveFromCart } = require('../controllers/cartController');

router.post('/', handleAddToCart);

router.get('/', handleGetCartItems);


router.delete('/:id', handleRemoveFromCart);

module.exports = router;
