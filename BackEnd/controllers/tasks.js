const Task = require('../models/tasks');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Task name is required" });
    }

    const task = await Task.create({ name, description });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Task name must be unique" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};