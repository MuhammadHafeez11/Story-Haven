import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBook, FaUser, FaSignOutAlt, FaChevronDown, FaUserCircle, FaCogs } from 'react-icons/fa';
import logo from '../assets/logo.jpeg';
import { logout } from '../actions/userAction';
import { useDispatch } from 'react-redux';
import { toast } from "react-hot-toast";
import '../styles/componentsStyles/Navbar.css';
// import axiosInstance from '../axios/axiosInstance';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('role'); 

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown element

  const handleLogout = async () => {
    try {
      dispatch(logout());
      // await axiosInstance.post('/user/logout');
      localStorage.removeItem('userID');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      navigate('/');
    } catch (error) {
      toast.error(error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // Scroll to specific sections
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="logo-text"><i>StoryHaven</i></span>
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to='/' onClick={() => scrollToSection('home')} className="nav-link">Home</Link>
        </li>
        <li>
          <Link to='/' onClick={() => scrollToSection('featured-books')} className="nav-link">Books</Link>
        </li>
        <li>
          <Link to='/' onClick={() => scrollToSection('authors')} className="nav-link">Authors</Link>
        </li>
      </ul>

      <ul className="navbar-user-actions">
        {userId ? (
          <>
            <li className="nav-username">Hi, {userName}</li>
            <li className="dropdown">
              <button className="dropdown-toggle" onClick={toggleDropdown}>
                <FaUserCircle /> <FaChevronDown />
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu" ref={dropdownRef}>
                  {role === 'admin' ? (
                    <li>
                      <Link to="/admin/dashboard" className="dropdown-item">
                        <FaCogs /> Admin Dashboard
                      </Link>
                    </li>
                  ) : (
                    <>
                    <li>
                      <Link to="/user-dashboard" className="dropdown-item">
                        <FaUser /> User Dashboard
                      </Link>
                    </li>
                    <li>
                    <Link to='/book' className="dropdown-item">
                      <FaBook /> Books
                    </Link>
                  </li>
                  </>
                  )}
                  <li>
                    <a onClick={handleLogout} className="dropdown-item">
                      <FaSignOutAlt /> Sign Out
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className="nav-link">
              Login <FaUser />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
