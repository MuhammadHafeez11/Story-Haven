const express = require('express');
const { newLocation, getLocation, getLocationByProductId, updateQuantity, getLocationByProductAndColorId } = require('../controllers/location');

const router = express.Router();

router.post('/new', newLocation);
router.get('/get', getLocation);
router.post('/get/quantity', getLocationByProductAndColorId);
router.get('/get/:id', getLocationByProductId);
router.post('/update', updateQuantity);

module.exports = router;