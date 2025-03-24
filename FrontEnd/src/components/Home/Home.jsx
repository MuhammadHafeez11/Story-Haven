import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { FaBook, FaArrowRight, FaUsers } from 'react-icons/fa';
import { fetchAllBooks } from '../../api/bookApi';
import { fetchTotalUsers } from '../../api/userApi'; 
import { fetchCategories } from '../../api/categoryApi'; 
import { fetchAuthors } from '../../api/authorApi';  
import axiosInstance from '../../axios/axiosInstance';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  // Fix: Move handleStartedClick outside of useEffect
  const handleStartedClick = () => {
    navigate('/signup');
  };

  useEffect(() => {
    const getBooks = async () => {
      const fetchedBooks = await fetchAllBooks();
      setBooks(fetchedBooks.filter(book => book.isFeatured));
    };

    const getTotalUsers = async () => {
      const fetchedUsers = await fetchTotalUsers();
      setTotalUsers(fetchedUsers);
    };

    const getCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories.filter(category => category.isFeatured));
    };

    const getAuthors = async () => {
      const fetchedAuthors = await fetchAuthors();
      setAuthors(fetchedAuthors.filter(author => author.isFeatured));
    };

    getBooks();
    getTotalUsers();
    getCategories();
    getAuthors();
  }, []);

  return (
    <div className="home-page-container" id="home">
      {/* Hero Section */}
      <div className="home-hero-section">
        <div className="home-hero-content">
          <h1 className="home-title">Welcome to the <span>STORYHAVEN</span></h1>
          <p className="home-subtitle">Discover a vast library of books, read at your own pace, and manage your reading history seamlessly.</p>
          <p className="home-description">
            Whether you're a casual reader or a bookworm, our app is designed to enhance your reading experience.
            Join our community of readers and enjoy the freedom of accessing your favorite books anytime, anywhere.
          </p>
          <button className="home-login-button" onClick={handleStartedClick}>
            Get Started <FaArrowRight className="button-icon" />
          </button>
        </div>
        <div className="hero-decoration">
          <div className="floating-book book-1"></div>
          <div className="floating-book book-2"></div>
          <div className="floating-book book-3"></div>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="home-featured-books" id="featured-books">
        <h2 className="home-section-title">Featured Books</h2>
        <div className="home-book-list">
          {books.length > 0 ? (
            books.slice(0, 6).map(book => (
              <div key={book._id} className="home-book-item">
                <div className="book-cover-wrapper">
                  <img
                    src={`${axiosInstance.defaults.baseURL}/uploads/bookUploads/${book.coverImage}`}
                    alt={book.title}
                    className="home-book-cover"
                  />
                </div>
                <p className="home-book-title">{book.title}</p>
                <p className="home-book-author">by {book.authorID.name}</p>
              </div>
            ))
          ) : (
            <p className="no-content-message">No books available</p>
          )}
        </div>
      </div>

      {/* Trending Categories Section */}
      <div className="home-trending-categories">
        <h2 className="home-section-title">Trending Categories</h2>
        <div className="home-categories-list">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category._id} className="home-category-item">
                {category.name}
              </div>
            ))
          ) : (
            <p className="no-content-message">No categories available</p>
          )}
        </div>
      </div>

      {/* Authors Section */}
      <div className="home-authors-section" id="authors">
        <h2 className="home-section-title">Meet Our Authors</h2>
        <div className="home-authors-list">
          {authors.length > 0 ? (
            authors.map(author => (
              <div key={author._id} className="home-author-item">
                <div className="author-photo-wrapper">
                  <img
                    src={`${axiosInstance.defaults.baseURL}/uploads/authorUploads/${author.photo}`}
                    alt={author.name}
                    className="home-author-photo"
                  />
                </div>
                <p className="home-author-name">{author.name}</p>
              </div>
            ))
          ) : (
            <p className="no-content-message">No authors available</p>
          )}
        </div>
      </div>

      {/* User Count Section */}
      <div className="home-user-count">
        <div className="user-count-content">
          <h2 className="home-section-title">Join Our Growing Community</h2>
          <div className="home-user-info">
            <div className="user-icon-wrapper">
              <FaUsers className="home-user-icon" />
            </div>
            <p className="home-total-users"><span className="user-count-number">{totalUsers}</span> readers have joined!</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="home-testimonials-section">
        <h2 className="home-section-title">What Our Readers Say</h2>
        <div className="testimonials-container">
          <div className="home-testimonial-item">
            <div className="quote-mark left-quote">"</div>
            <p className="home-testimonial-text">This app changed the way I read books. The library is amazing, and the features are intuitive!</p>
            <div className="quote-mark right-quote">"</div>
            <div className="testimonial-author-container">
              <div className="testimonial-avatar"></div>
              <p className="home-testimonial-author">- Hadi</p>
            </div>
          </div>
          <div className="home-testimonial-item">
            <div className="quote-mark left-quote">"</div>
            <p className="home-testimonial-text">I love how easy it is to find and read my favorite books. Best reading app ever!</p>
            <div className="quote-mark right-quote">"</div>
            <div className="testimonial-author-container">
              <div className="testimonial-avatar"></div>
              <p className="home-testimonial-author">- Talha</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="home-community-section">
        <div className="community-content">
          <h2 className="home-section-title">Join Our Community</h2>
          <p className="home-community-description">
            Be a part of a growing community of book lovers. Share your reviews, discuss with fellow readers, and explore new genres.
          </p>
          <Link to="/community" className="home-community-button">
            Join Now <FaUsers className="button-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;