// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userId = localStorage.getItem('userID');
  const userRole = localStorage.getItem('role'); // Assuming you store the user's role in localStorage as 'role'

  if (!userId) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If the user does not have the correct role, redirect to the home page
    return <Navigate to="/" />;
  }

  return children; // If the user is authenticated and authorized, render the requested component
};

export default ProtectedRoute;
