import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { fetchCartItems, handleRemoveFromCart, handlePurchase } from "../../api/cartApi"
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa"
import "./Cart.css"
// import "../axios/axiosInstance"

const userId = localStorage.getItem("userID")

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [cardInfo, setCardInfo] = useState("")
  const [cardHolderName, setCardHolderName] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchCartItems(setCartItems, setTotalPrice, userId)
  }, [userId])

  return (
    <div className="sh-cart-container">
      <div className="sh-cart-header">
        <Link to="/book" className="sh-cart-back-link">
          <FaArrowLeft className="sh-cart-back-icon" />
          Back to Books
        </Link>
        <h2 className="sh-cart-title">Shopping Cart</h2>
      </div>

      {cartItems.length > 0 ? (
        <div className="sh-cart-content">
          <div className="sh-cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="sh-cart-item">
                <div className="sh-cart-item-details">
                  <h3 className="sh-cart-item-title">{item.bookID.title}</h3>
                  <p className="sh-cart-item-price">${item.bookID.price.toFixed(2)}</p>
                </div>
                <button
                  className="sh-cart-item-remove"
                  onClick={() => handleRemoveFromCart(item._id, cartItems, setCartItems, setTotalPrice)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="sh-cart-summary">
            <h3 className="sh-cart-total">Total: ${totalPrice.toFixed(2)}</h3>
          </div>

          <div className="sh-cart-payment">
            <div className="sh-payment-form">
              <input
                type="text"
                className="sh-payment-input"
                placeholder="Card Holder Name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
              />
              <input
                type="text"
                className="sh-payment-input"
                placeholder="Card Number"
                value={cardInfo}
                onChange={(e) => setCardInfo(e.target.value)}
              />
              <button
                className="sh-payment-button"
                onClick={() => handlePurchase(userId, cardInfo, cardHolderName, cartItems, navigate)}
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="sh-cart-empty">
          <FaShoppingCart style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.5 }} />
          <p>Your cart is empty</p>
          <Link to="/book" className="sh-cart-back-link" style={{ marginTop: "1rem" }}>
            Browse Books
          </Link>
        </div>
      )}
    </div>
  )
}

export default Cart