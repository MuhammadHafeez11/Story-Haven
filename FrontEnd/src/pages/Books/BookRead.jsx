import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookRead.css"; 
import toast from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";

const ReadBook = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`/book/${bookId}`);
        setBook(response.data);
      } catch (error) {
        toast.error("Error fetching book");
      }
    };

    fetchBook();
  }, [bookId]);

  const handleBackClick = () => {
    navigate("/book");
  };

  return (
    <div className="read-book-container">
      {/* Back button */}
      <button className="back-button" onClick={handleBackClick}>
        &#8592; Back to Books
      </button>

      {book ? (
        <div className="book-details">
          {/* Cover Image */}
          {book.coverImage && (
            <div className="cover-image">
              <img
                src={`${axiosInstance.defaults.baseURL}/uploads/bookUploads/${book.coverImage}`}
                alt="Cover"
              />
            </div>
          )}

          {/* Book Information */}
          <div className="book-info">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-description">{book.description}</p>

            <div className="book-meta">
              <h2>Author: <span>{book.authorID.name}</span></h2>
              <p>{book.authorID.biography}</p>

              <h2>Category: <span>{book.categoryID.name}</span></h2>
              <p>{book.categoryID.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default ReadBook;
