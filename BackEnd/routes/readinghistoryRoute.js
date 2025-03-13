const express = require('express');
const { handleGetReadingHistory, handleUploadReadingHistory, handleGetReadingHistoryById } = require('../controllers/readinghistoryController')

const router = express.Router();

router.route('/')
.post(handleUploadReadingHistory)
.get(handleGetReadingHistory);

router.get('/:id' , handleGetReadingHistoryById);

module.exports = router;

