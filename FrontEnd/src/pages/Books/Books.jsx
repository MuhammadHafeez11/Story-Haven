import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Books.css";
import { toast } from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";
import SearchBooks from "../../components/Search/SearchBooks";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [purchasedBookIds, setPurchasedBookIds] = useState([]);
  const [readingHistory, setReadingHistory] = useState({});
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [purchaseStatuses, setPurchaseStatuses] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const userId = localStorage.getItem("userID");

      // Fetch the user's purchased books
      const purchasedResponse = await axiosInstance.get(`/purchase/${userId}`);
      const purchasedBooks = purchasedResponse.data;
      const statusMap = {};

      purchasedBooks.forEach((purchase) => {
        statusMap[purchase.bookID._id] = purchase.status;

        const notificationKey = `notified_${userId}_${purchase.bookID._id}`;
        if (!localStorage.getItem(notificationKey)) {
          if (purchase.status === "Approved") {
            toast.success(`Your purchase request for "${purchase.bookID.title}" has been approved! You can now read this book.`);
            localStorage.setItem(notificationKey, true); // Mark as notified
          } else if (purchase.status === "Rejected") {
            toast.error(`Your purchase request for "${purchase.bookID.title}" was rejected.`);
            localStorage.setItem(notificationKey, true); // Mark as notified
          }
        }
      });

      setPurchasedBookIds(purchasedBooks.map((purchase) => purchase.bookID._id));
      setPurchaseStatuses(statusMap);

      // Fetch the user's reading history
      const historyResponse = await axiosInstance.get(`/readinghistory/${userId}`);
      const historyData = historyResponse.data;
      const historyMap = {};
      historyData.forEach((entry) => {
        historyMap[entry.bookID._id] = entry;
      });
      setReadingHistory(historyMap);

      // Fetch all books
      const response = await axiosInstance.get("/book");
      setBooks(response.data);

      // Fetch the user's cart items
      const cartResponse = await axiosInstance.get(`/cart?userId=${userId}`);
      setCartItemsCount(cartResponse.data.length);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSearchResults = (results) => {
    if (!results || results.length === 0) {
      toast.error("No Book Found");
    } else {
      setBooks(results);
    }
  };

  const addToCart = async (bookId) => {
    const userId = localStorage.getItem("userID");

    try {
      await axiosInstance.post("/cart", { userId, bookId });
      setCartItemsCount(cartItemsCount + 1);
      toast.success("Book added to cart successfully.");
    } catch (error) {
      toast.error("Error adding book to cart");
    }
  };

  const isBookPurchased = (bookId) => {
    return purchasedBookIds.includes(bookId);
  };

  const getPurchaseStatus = (bookId) => {
    return purchaseStatuses[bookId];
  };

  const getReadingStatus = (bookId) => {
    return readingHistory[bookId];
  };

  return (
    <div className="books-page-container">
      <div className="books-header">
        <h2 className="page-title">Explore Our Book Collection</h2>
      </div>
      <div className="cart-indicator">
        <Link to="/cart" className="text">
          <span className="cart-icon">&#128722;</span>
          <span className="cart-count">{cartItemsCount}</span>
        </Link>
      </div>
      <SearchBooks onSearchResults={handleSearchResults} />
        <p className="book-detail-text">Click on Books to see details</p>
      <div className="book-grid">
        {books.length > 0 ? books.map((book) => (
          <div key={book._id} className="book-card">
            <Link
              to={
               `/book/${book._id}`
              }
            >
              <img
                src={`${axiosInstance.defaults.baseURL}/uploads/bookUploads/${book.coverImage}`}
                alt={book.title}
                className="book-cover-image"
              />
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-price">Price: ${book.price}</p>

              </div>
              </Link> 
            
              {isBookPurchased(book._id) ? (
                getPurchaseStatus(book._id) === "Approved" ? (
                  getReadingStatus(book._id) ? (
                    <Link
                      to={`/track/${book._id}?page=${
                        getReadingStatus(book._id)?.numberOfPagesRead || 1
                      }`}
                    >
                      <button className="book-action-button continue-reading-button">Continue Reading</button>
                    </Link>
                  ) : (
                    <Link to={`/track/${book._id}`}>
                      <button className="book-action-button read-button">Read</button>
                    </Link>
                  )
                ) : getPurchaseStatus(book._id) === "Rejected" ? (
                  <button
                    className="book-action-button add-to-cart-button"
                    onClick={() => addToCart(book._id)}
                  >
                    Purchase Again
                  </button>
                ) : (
                  <button className="book-action-button pending-button" disabled>
                    Pending Purchase Request
                  </button>
                  
                ) 
                 ) : (
                  
                <button
                  className="book-action-button add-to-cart-button"
                  onClick={() => addToCart(book._id)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          
        )) : (
          <p className="no-books-message">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Books;
