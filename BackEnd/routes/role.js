const express = require('express');
const { createRole, getAllRoles } = require('../controllers/roleController');
const router = express.Router();

router.post('/new', createRole);
router.get('/get', getAllRoles);

module.exports = router;
