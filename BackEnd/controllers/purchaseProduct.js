const ProductPurchase = require('../models/productPurchaseModel')

async function newPurchase(req, res, next) {
    try {
        // console.log(req.body);
        
        const { purchaserName, phoneNo, generatedBy, products } = req.body;

        if (!purchaserName || !phoneNo || !generatedBy || !products) {
            const error = new Error('All fields are required and should not be empty.');
            error.statusCode = 400;
            return next(error);
        }

        const purchase = new ProductPurchase({
                purchaserName,
                phoneNo,
                generatedBy,
                products
            }
        );
        await purchase.save();

        return res.status(200).send('Purchase Saved');
    } catch (error) {
        return next(error);
    }
}

async function getPurchaseById(req, res, next) {
    const id = req.params.id;

    try {
        const sale = await ProductPurchase.find({ _id: id });
        return res.status(200).json(sale);
    } catch (error) {
        return next(error);
    }
}

async function getPurchases(req, res, next) {
    try {
        const data = await ProductPurchase.find();
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    newPurchase,
    getPurchaseById,
    getPurchases,
}