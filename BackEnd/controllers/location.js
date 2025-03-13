const Location = require('../models/locationModel')

async function newLocation(req, res)  {
    try {
    const { productId, quantity, colorId } = req.body;
  
  if (!productId || !quantity || !colorId) {
      return res.status(400).send({ message: 'All fields are required and should not be empty.' });
  }
    
      const newLocation = new Location({ productId, quantity, colorId });
      await newLocation.save();
      res.status(200).json({ message: 'Location added !' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding location', error });
    }
  };
  
  async function getLocationByProductId (req, res)  {
    const productId = req.params.id;

    if (!productId ) {
      return res.status(400).json({ message: "Product ID is required" });
    }
  
    try {
      const location = await Location.find({ productId }).populate('productId').populate('colorId');
      if(!location){
        res.status(404).json("Not Found...!")
      }
      res.status(200).json(location);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching location', error });
    }
  };

  async function getLocationByProductAndColorId(req, res) {
    const { productId, colorId } = req.body;

    if (!productId || !colorId) {
        return res.status(400).json({ message: "Both Product ID and Color ID are required" });
    }

    try {
        const location = await Location.findOne({ productId, colorId })
            .populate('productId')
            .populate('colorId');

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json(location);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ message: 'Error fetching location', error });
    }
}

  
  async function getLocation (req, res)  {
    try {
      const location = await Location.find().populate('productId').populate("colorId");
      res.status(200).json(location);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching location', error });
    }
  };
  
  async function updateQuantity(req, res) {
    try {
        const { quantity, productId, colorId } = req.body;

        if (quantity === undefined || !productId || !colorId) {
            return res.status(400).json({ message: "Quantity, Product ID, and Color ID are required" });
        }

        // Check if the location already exists
        const existingLocation = await Location.findOne({ productId, colorId });

        if (existingLocation) {
          const result = await Location.updateOne(
            { productId, colorId }, 
            { $set: { quantity } },
        );

            return res.status(200).json({ message: "Quantity updated successfully", location: result });
        } else {
            // Create a new location if it doesn't exist
            const newLocation = new Location({
                productId,
                colorId,
                quantity,
            });

            const savedLocation = await newLocation.save();

            return res.status(200).json({ message: "Location created successfully", location: savedLocation });
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ message: "Error updating quantity", error });
    }
}
  
  module.exports = {
    newLocation,
    getLocation,
    getLocationByProductId,
    updateQuantity,
    getLocationByProductAndColorId
  }