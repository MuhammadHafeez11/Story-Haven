const Cart = require('../models/cartModel');

async function handleAddToCart(req, res)  {
  const { bookId, userId } = req.body;
  // console.log(req.body);
//   const userId = req.user._id;

if (!bookId || !userId ) {
    return res.status(400).send({ message: 'All fields are required and should not be empty.' });
}

  try {
    const newCartItem = new Cart({ userID: userId, bookID: bookId });
    await newCartItem.save();
    res.status(200).json({ message: 'Book added to cart!' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding book to cart', error });
  }
};

async function handleGetCartItems (req, res)  {
  const userId = req.query.userId;

  try {
    const cartItems = await Cart.find({ userID: userId }).populate('bookID');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
};

async function handleRemoveFromCart  (req, res)  {
  const cartItemId = req.params.id;

  try {
    await Cart.findByIdAndDelete(cartItemId);
    res.status(200).json({ message: 'Book removed from cart!' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing book from cart', error });
  }
};

module.exports = {
    handleAddToCart,
    handleGetCartItems,
    handleRemoveFromCart
}; 