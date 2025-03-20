import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pagesStyles/Home.css';
import { FaBook, FaArrowRight, FaUsers } from 'react-icons/fa';
import { fetchAllBooks } from '../api/bookApi';  // Import the API function
import { fetchTotalUsers } from '../api/userApi'; // API call to fetch total users
import { fetchCategories } from '../api/categoryApi'; // API call for categories
import { fetchAuthors } from '../api/authorApi';  // API call for authors
import axiosInstance from '../axios/axiosInstance';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

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
        <h1 className="home-title">Welcome to the STORYHAVEN</h1>
        <p className="home-subtitle">Discover a vast library of books, read at your own pace, and manage your reading history seamlessly.</p>
        <p className="home-description">
          Whether you're a casual reader or a bookworm, our app is designed to enhance your reading experience.
          Join our community of readers and enjoy the freedom of accessing your favorite books anytime, anywhere.
        </p>
        <Link to="/signup" className="home-login-button">
          Get Started <FaArrowRight />
        </Link>
      </div>

      {/* Featured Books Section */}
      <div className="home-featured-books" id="featured-books">
        <h2 className="home-section-title">Featured Books</h2>
        <div className="home-book-list">
          {books.length > 0 ? (
            books.slice(0, 6).map(book => (
              <div key={book._id} className="home-book-item">
                <img
                  src={`${axiosInstance.defaults.baseURL}/uploads/bookUploads/${book.coverImage}`}
                  alt={book.title}
                  className="home-book-cover"
                />
                <p className="home-book-title">{book.title}</p>
                <p className="home-book-author">by {book.authorID.name}</p>
              </div>
            ))
          ) : (
            <p>No books available</p>
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
            <p>No categories available</p>
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
                <img
                  src={`${axiosInstance.defaults.baseURL}/uploads/authorUploads/${author.photo}`}
                  alt={author.name}
                  className="home-author-photo"
                />
                <p className="home-author-name">{author.name}</p>
              </div>
            ))
          ) : (
            <p>No authors available</p>
          )}
        </div>
      </div>

      {/* User Count Section */}
      <div className="home-user-count">
        <h2 className="home-section-title">Total Users</h2>
        <div className="home-user-info">
          <FaUsers className="home-user-icon" />
          <p className="home-total-users">{totalUsers} users have joined!</p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="home-testimonials-section">
        <h2 className="home-section-title">What Our Readers Say</h2>
        <div className="home-testimonial-item">
          <p className="home-testimonial-text">"This app changed the way I read books. The library is amazing, and the features are intuitive!"</p>
          <p className="home-testimonial-author">- Hadi</p>
        </div>
        <div className="home-testimonial-item">
          <p className="home-testimonial-text">"I love how easy it is to find and read my favorite books. Best reading app ever!"</p>
          <p className="home-testimonial-author">- Talha</p>
        </div>
      </div>

      {/* Community Section */}
      <div className="home-community-section">
        <h2 className="home-section-title">Join Our Community</h2>
        <p className="home-community-description">
          Be a part of a growing community of book lovers. Share your reviews, discuss with fellow readers, and explore new genres.
        </p>
        <Link to="/community" className="home-community-button">
          Join Now <FaUsers />
        </Link>
      </div>
    </div>
  );
};

export default Home;
