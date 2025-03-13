const Sale = require('../models/saleModel')

async function newSale(req, res, next) {
    try {
        // console.log(req.body);
        
        const { customerName, phoneNo, generatedBy, grandTotal, products } = req.body;

        if (!customerName || !phoneNo || !generatedBy || !products) {
            const error = new Error('All fields are required and should not be empty.');
            error.statusCode = 400;
            return next(error);
        }

        const sale = new Sale({
                customerName,
                phoneNo,
                generatedBy,
                grandTotal,
                products
            }
        );
        await sale.save();

        return res.status(200).send('Sale Saved');
    } catch (error) {
        return next(error);
    }
}

async function getSaleById(req, res, next) {
    const id = req.params.id;

    try {
        const sale = await Sale.find({ _id: id });
        return res.status(200).json(sale);
    } catch (error) {
        return next(error);
    }
}

async function getSales(req, res, next) {
    try {
        const data = await Sale.find();
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
}


// Controller function to get the consolidated total of all sales
const getConsolidatedInvoice = async (req, res) => {
    try {
      // Aggregate the total of all sales using MongoDB's aggregation pipeline
      const result = await Sale.aggregate([
        {
          $group: {
            _id: null, // No grouping, we just want a total
            totalAmount: { $sum: "$grandTotal" }, // Sum up all grandTotal fields
          },
        },
      ]);
  
      // Check if there are sales
      if (result.length === 0) {
        return res.status(404).json({ message: "No sales data found." });
      }
  
      // Send the consolidated total
      res.status(200).json({ consolidatedTotal: result[0].totalAmount });
    } catch (error) {
      console.error("Error fetching consolidated invoice:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

module.exports = {
    newSale,
    getSales,
    getSaleById,
    getConsolidatedInvoice,
}