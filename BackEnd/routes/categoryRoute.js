const express = require('express');
const { handleDeleteCategoryById, handleGetAllCategories,handleUpdateCategoryById, handleUploadCategory, handleGetIdByName, handleGetCategoryById, handleUpdateCategoryIsFeaturedStatus} = require('../controllers/categoryController')
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.route('/')
.post(authenticateJWT, handleUploadCategory)
.get( handleGetAllCategories);

router.route('/:id')
.get(authenticateJWT, handleGetCategoryById)
.patch(authenticateJWT, handleUpdateCategoryIsFeaturedStatus)
.put(authenticateJWT, handleUpdateCategoryById)
.delete(authenticateJWT, handleDeleteCategoryById);


router.get('/name/:name',authenticateJWT,handleGetIdByName);

module.exports = router;