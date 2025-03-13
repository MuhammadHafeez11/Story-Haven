const Purchase = require('../models/purchaseModel');
const User = require('../models/userModel');

async function handleGetTotalRevenue(req, res, next) {
  try {
    const purchases = await Purchase.find().populate('bookID');
    // console.log(purchases);
    
    const totalRevenue = purchases.reduce((total, purchase) => {
      return total + purchase.bookID.price;
    }, 0);

    if(!purchases){
      res.send('No Purchases Yet.')
    }
    res.status(200).json({ totalRevenue });
  } catch (err) {
    next(err);
}
}

async function handleGetBooksPurchased(req, res, next) {
  try {
    const purchases = await Purchase.find().populate('bookID').populate('userID');
    const booksPurchasedCount = purchases.length;

    res.status(200).json({ booksPurchasedCount, purchases });
  } catch (err) {
    next(err);
}
}


async function handleGetNewUsersCount(req, res, next) {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const newUsersCount = await User.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });

    res.status(200).json({ newUsersCount });
  } catch (err) {
    next(err);
}
}

module.exports = {
    handleGetBooksPurchased,
    handleGetTotalRevenue,
    handleGetNewUsersCount
}