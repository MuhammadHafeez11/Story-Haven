const AssignedTasks = require('../models/assignedTasks');
const Task = require('../models/tasks');
const User = require('../models/userModel');

// Assign tasks to a role
exports.assignTasksToRole = async (req, res) => {
  try {
    const { roleId, tasks } = req.body;

    if (!roleId || !tasks || !Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: "roleId and an array of tasks are required",
      });
    }

    // Ensure tasks are in the correct format
    const formattedTasks = tasks.map(({ taskId, status = false }) => ({
      taskId,
      status,
    }));

    const assignedTasks = await AssignedTasks.findOneAndUpdate(
      { roleId },
      { $set: { tasks: formattedTasks } }, // Update the tasks array
      { new: true, upsert: true } // Create a new document if it doesn't exist
    );

    res.status(200).json({
      success: true,
      data: assignedTasks,
    });
  } catch (error) {
    console.error('Error assigning tasks to role:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get assigned tasks for a role
exports.getAssignedTasksByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const assignedTasks = await AssignedTasks.findOne({ roleId })
      .populate('tasks.taskId', 'name description') // Populate task details
      .populate('roleId', 'name description'); // Populate role details

    if (!assignedTasks) {
      return res.status(404).json({
        success: false,
        message: "No tasks assigned to this role",
      });
    }

    res.status(200).json({
      success: true,
      data: assignedTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get tasks for a user
exports.getAssignedTasksForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the assigned tasks based on the user's role
    const assignedTasks = await AssignedTasks.findOne({ roleId: user?.role?._id })
      .populate('tasks.taskId', 'name description'); // Populate task details

      // console.log(assignedTasks);

    if (!assignedTasks) {
      return res.status(404).json({ message: 'No tasks assigned for this role' });
    }

    // Respond with the list of tasks including status
    return res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
      tasks: assignedTasks.tasks.map((task) => ({
        taskId: task.taskId._id,
        name: task.taskId.name,
        description: task.taskId.description,
        status: task.status,
      })),
    });
  } catch (error) {
    console.error('Error fetching assigned tasks:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { roleId, taskId } = req.body; // Expect roleId and taskId in the request body
    const { status } = req.body; // New status value

    // console.log(roleId,taskId, status);
    
    const assignedTasks = await AssignedTasks.findOne({ roleId });
    if (!assignedTasks) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const taskIndex = assignedTasks.tasks.findIndex(task => task.taskId.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    assignedTasks.tasks[taskIndex].status = status; // Update the status
    await assignedTasks.save();

    res.status(200).json({ message: 'Task status updated successfully', assignedTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task status', error });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const assignedTasks = await AssignedTasks.find({})
      .populate('roleId', 'name') // Populate role details
      .populate('tasks.taskId', 'name description'); // Populate task details

    if (!assignedTasks) {
      return res.status(404).json({ message: 'No assigned tasks found' });
    }

    res.status(200).json({ assignedTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching assigned tasks', error });
  }
};