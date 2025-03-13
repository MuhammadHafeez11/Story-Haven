const express = require('express');
const { newSale, getSales, getSaleById, getConsolidatedInvoice } = require('../controllers/salesController');

const router = express. Router();

router.post('/new', newSale);
router.get('/get', getSales);
router.get('/consolidated-invoice', getConsolidatedInvoice);
router.get('/get/:id', getSaleById)

module.exports = router;

