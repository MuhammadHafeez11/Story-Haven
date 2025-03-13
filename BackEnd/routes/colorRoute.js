const express = require('express');
const { createColor, getAllColors } = require('../controllers/colorController');
const router = express.Router();

router.post('/new', createColor);
router.get('/get', getAllColors);

module.exports = router;
