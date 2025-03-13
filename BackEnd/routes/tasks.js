const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/tasks');

// Route to create a task
router.post('/tasks', createTask);

// Route to fetch all tasks
router.get('/tasks', getTasks);

module.exports = router;
