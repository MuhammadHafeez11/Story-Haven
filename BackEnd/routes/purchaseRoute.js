const express = require('express');
const {
  handlePurchaseBooks,
  handleGetPurchases,
  handleGetAllPurchases,
  handleApprovePurchase,
  handleRejectPurchase
} = require('../controllers/purchaseController');
const authenticateJWT = require('../middlewares/authenticateJWT')

const router = express.Router();

router.post('/', handlePurchaseBooks);
router.get('/:id', handleGetPurchases);
router.get('/', authenticateJWT, handleGetAllPurchases);
router.post('/approve', authenticateJWT, handleApprovePurchase);
router.post('/reject', authenticateJWT, handleRejectPurchase);

module.exports = router;
