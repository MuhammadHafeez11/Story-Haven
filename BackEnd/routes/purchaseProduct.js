const express = require('express');
const { newPurchase, getPurchaseById, getPurchases } = require('../controllers/purchaseProduct');

const router = express. Router();

router.post('/new', newPurchase);
router.get('/get', getPurchases);
router.get('/get/:id', getPurchaseById)

module.exports = router;

