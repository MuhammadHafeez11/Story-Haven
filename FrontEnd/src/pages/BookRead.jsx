import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/pagesStyles/BookRead.css'; 
import axiosInstance from '../axios/axiosInstance';
import toast from 'react-hot-toast';

const ReadBook = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`/book/${bookId}`);
        const bookData = response.data; // Assuming the response contains the book object
        setBook(bookData);
      } catch (error) {
        toast.error('Error fetching book');
      }
    };

    fetchBook();
  }, [bookId]);

  const handleBackClick = () => {
    navigate('/book');
  };

  return (
<>
     {/* Back button */}
     <button className="back-button" onClick={handleBackClick}>
     &#8592; Back to Books
   </button>
    <div className="read-book-container">
     

      {book ? (
        <div className="book-details">
          <h1>{book.title}</h1>
          <p>{book.description}</p>
          <h2>Author: {book.authorID.name}</h2>
          <p>{book.authorID.biography}</p>
          <h2>Category: {book.categoryID.name}</h2>
          <p>{book.categoryID.description}</p>

          {/* Display cover image */}
          {book.coverImage && (
            <div className="cover-image">
              <h3>Cover Image:</h3>
              <img
                src={`http://localhost:5000/uploads/bookUploads/${book.coverImage}`}
                alt="Cover"
              />
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div> </>
  );
};


export default ReadBook;
