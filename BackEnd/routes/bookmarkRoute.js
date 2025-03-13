const express = require('express');
const { handleUpdateBookMark, handleGetBookMark, handleGetAllBookMarkByID } = require('../controllers/bookmarkController')

const router = express.Router();


router.route('/')
.post(handleUpdateBookMark)
.get( handleGetBookMark);

router.get('/:id',handleGetAllBookMarkByID);

module.exports = router;