import React, { useState } from 'react';
import { searchBooks } from '../api/searchApi';
import { toast } from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import '../styles/componentsStyles/SearchBook.css'; 

const SearchBooks = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      const results = await searchBooks(searchTerm);
      console.log(results)
      if (results.length) {
        onSearchResults(results);
      } else {
        // toast.error('No books found');
        onSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An error occurred while searching');
      onSearchResults([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search by title, author, or category"
          className="search-input"
        />
        <button onClick={handleSearch} className="book-search-button">
          <FiSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBooks;
