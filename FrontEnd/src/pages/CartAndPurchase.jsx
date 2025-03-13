import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCartItems, handleRemoveFromCart, handlePurchase } from '../api/cartApi'; 
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/pagesStyles/Cart.css';
import '../axios/axiosInstance';

const userId = localStorage.getItem('userID');

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardInfo, setCardInfo] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems(setCartItems, setTotalPrice, userId);
  }, [userId]);

  return (
    <div className="cart">
      <Link to="/book" className="cart-back-button">
        <FaArrowLeft className="cart-back-icon" />
        Go to Books
      </Link>
      <h2 className="cart-title">Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <div className="cart-content">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.bookID.title}</h3>
                <p className="cart-item-price">Price: ${item.bookID.price}</p>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => handleRemoveFromCart(item._id, cartItems, setCartItems, setTotalPrice)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-summary">
            <h3 className="cart-total">Total: ${totalPrice.toFixed(2)}</h3>
          </div>
          <div className="cart-payment">
            <input
              type="text"
              className="cart-payment-input"
              placeholder="Card Holder Name"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
            />
            <input
              type="text"
              className="cart-payment-input"
              placeholder="Card Info"
              value={cardInfo}
              onChange={(e) => setCardInfo(e.target.value)}
            />
            <button
              className="cart-payment-button"
              onClick={() => handlePurchase(userId, cardInfo, cardHolderName, cartItems, navigate)}
            >
              Purchase
            </button>
          </div>
        </div>
      ) : (
        <p className="cart-empty">Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
