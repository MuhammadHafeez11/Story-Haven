const express = require('express');
const { uploadAuthorImage, checkImageDimensionsForAuthor } = require('../middlewares/multer');
const {
    handleDeleteAuthorById,
    handleGetAllAuthor,
    handleUpdateAuthorById,
    handleUploadAuthor,
    handleGetIdByName,
    handleGetAuthorById,
    handleUpdateFeaturedStatus
} = require('../controllers/authorController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.route('/')
    .post(authenticateJWT, uploadAuthorImage, checkImageDimensionsForAuthor, handleUploadAuthor)
    .get(handleGetAllAuthor);

router.route('/:id')
    .get(authenticateJWT, handleGetAuthorById)
    .patch(authenticateJWT, handleUpdateFeaturedStatus)
    .put(authenticateJWT, uploadAuthorImage, checkImageDimensionsForAuthor, handleUpdateAuthorById)
    .delete(authenticateJWT, handleDeleteAuthorById);

router.get('/name/:name', authenticateJWT, handleGetIdByName);

module.exports = router;
