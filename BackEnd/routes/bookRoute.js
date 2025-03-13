const express = require('express');
const { handleUploadBook, handleGetAllBooks, handleGetBookById, handleUpdateBookById, handleDeleteBookById, handleGetBookByName, handleUpdateBookIsFeaturedStatus } = require('../controllers/bookController');
const { uploadBookImage, checkImageDimensionsForBook } = require('../middlewares/multer');
const authenticateJWT = require('../middlewares/authenticateJWT');  // Include the JWT authentication middleware

const router = express.Router();

router.route('/')
  .post(authenticateJWT, checkImageDimensionsForBook, uploadBookImage, handleUploadBook)  // Ensure `authenticateJWT` runs before `isAdmin`
  .get(handleGetAllBooks);

router.route('/:id')
  .get(handleGetBookById)
  .patch(authenticateJWT, handleUpdateBookIsFeaturedStatus)
  .put(authenticateJWT, uploadBookImage, checkImageDimensionsForBook, handleUpdateBookById)  // Ensure `authenticateJWT` runs before `isAdmin`
  .delete(authenticateJWT, handleDeleteBookById);  // Ensure `authenticateJWT` runs before `isAdmin`

  router.get('/name/:title', authenticateJWT, handleGetBookByName)

module.exports = router;
