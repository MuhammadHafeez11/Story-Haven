const Role = require('../models/role');

// Create a new role
exports.createRole = async (req, res) => {
    const { name, description } = req.body;

    if( !name || !description){
        const error = new Error("name and description are required.");
        error.statusCode = 400;
        return next(error);
    }

  try {
    const role = new Role({name, description});
    await role.save();
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};