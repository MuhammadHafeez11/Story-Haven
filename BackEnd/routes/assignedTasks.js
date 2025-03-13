const express = require('express');
const router = express.Router();
const {
  assignTasksToRole,
  getAssignedTasksByRole,
  getAssignedTasksForUser,
  updateTaskStatus,
  getAssignedTasks,
} = require('../controllers/assignedTasks');

// Route to assign tasks to a role
router.post('/new', assignTasksToRole);

// Route to fetch tasks assigned to a specific role
router.get('/assigned-tasks', getAssignedTasks);
router.get('/:roleId', getAssignedTasksByRole);
router.get('/tasks/:userId', getAssignedTasksForUser);
router.patch('/update-task-status', updateTaskStatus);

module.exports = router;
