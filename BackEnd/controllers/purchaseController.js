const Purchase = require('../models/purchaseModel');
const Cart = require('../models/cartModel');

async function handlePurchaseBooks(req, res, next) {
    const { cardInfo, cardHolderName, userId } = req.body;

    if (!cardInfo || !cardHolderName || !userId) {
        const error = new Error('All fields are required and should not be empty.');
        error.statusCode = 400;
        return next(error);
    }

    try {
        const cartItems = await Cart.find({ userID: userId }).populate('bookID');

        if (!cartItems.length) {
            const error = new Error('No books in the cart!');
            error.statusCode = 400;
            return next(error);
        }

        const purchases = cartItems.map(cartItem => ({
            userID: userId,
            bookID: cartItem.bookID._id,
            cardInfo,
            cardHolderName,
            status: 'Pending',
            isApproved: false
        }));

        await Purchase.insertMany(purchases);
        await Cart.deleteMany({ userID: userId });

        return res.status(200).json({ message: 'Purchase request submitted successfully!' });
    } catch (error) {
        return next(error);
    }
}

async function handleGetPurchases(req, res, next) {
    const userId = req.params.id;

    try {
        const purchases = await Purchase.find({ userID: userId }).populate('bookID').populate('userID');
        return res.status(200).json(purchases);
    } catch (error) {
        return next(error);
    }
}

async function handleGetAllPurchases(req, res, next) {
    try {
        const purchases = await Purchase.find().populate('bookID').populate('userID');
        return res.status(200).json(purchases);
    } catch (error) {
        return next(error);
    }
}

async function handleApprovePurchase(req, res, next) {
    const { purchaseId } = req.body;

    try {
        const purchase = await Purchase.findByIdAndUpdate(
            purchaseId,
            { status: 'Approved', isApproved: true },
            { new: true }
        );

        if (!purchase) {
            const error = new Error('Purchase not found');
            error.statusCode = 404;
            return next(error);
        }

        return res.status(200).json({ message: 'Purchase approved successfully!', purchase });
    } catch (error) {
        return next(error);
    }
}

async function handleRejectPurchase(req, res, next) {
    const { purchaseId } = req.body;

    try {
        const purchase = await Purchase.findByIdAndUpdate(
            purchaseId,
            { status: 'Rejected', isApproved: false },
            { new: true }
        );

        if (!purchase) {
            const error = new Error('Purchase not found');
            error.statusCode = 404;
            return next(error);
        }

        return res.status(200).json({ message: 'Purchase rejected successfully!', purchase });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    handlePurchaseBooks,
    handleGetPurchases,
    handleGetAllPurchases,
    handleApprovePurchase,
    handleRejectPurchase,
};
