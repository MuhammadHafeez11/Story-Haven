const express = require('express');
const { handleGetBooksPurchased, handleGetTotalRevenue, handleGetNewUsersCount } = require('../controllers/admindataController');
const authenticateJWT = require('../middlewares/authenticateJWT');  // Include the JWT authentication middleware
const router = express.Router();

router.get('/revenue', authenticateJWT, handleGetTotalRevenue);

router.get('/purchased', authenticateJWT, handleGetBooksPurchased);

router.get('/newUser', authenticateJWT, handleGetNewUsersCount);

module.exports = router;