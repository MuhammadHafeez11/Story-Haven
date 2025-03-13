const Color = require('../models/colorModel');

// Create a new role
exports.createColor = async (req, res, next) => {
    const { name } = req.body;

    if( !name ){
        const error = new Error("Name is required.");
        error.statusCode = 400;
        return next(error);
    }

  try {
    const color = new Color({name});
    await color.save();
    res.status(201).json({ success: true, data: color });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all roles
exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json({ success: true, data: colors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};