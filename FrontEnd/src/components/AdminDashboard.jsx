import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUser, FaDollarSign, FaClipboardList, FaUserFriends } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import axiosInstance from '../axios/axiosInstance';
import '../styles/componentsStyles/AdminDashboard.css';
import toast from 'react-hot-toast';
import CustomSidebar from '../pages/Products/SideBar/SideBar';

const AdminDashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [booksPurchasedCount, setBooksPurchasedCount] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [userRole, setUserRole] = useState("");
  const userId = localStorage.getItem("userID");

  // useEffect(() => {
    // Fetch the tasks dynamically (use mock data for now)
  //   const tasks = [
  //     { name: "canSale", label: "Sale", link: "/sale" },
  //     { name: "canPurchase", label: "Purchase", link: "/purchase" },
  //     {
  //       name: "Invoices",
  //       label: "Invoices",
  //       submenu: [
  //         { name: "canPrintSaleInvoices", label: "Sales Invoices", link: "/invoices/sales" },
  //         { name: "canPrintPurchaseInvoices", label: "Purchase Invoices", link: "/invoices/purchase" },
  //         { name: "canPrintConsolidateInvoice", label: "Consolidated Invoices", link: "/invoices/consolidated" },
  //       ],
  //     },
  //   ];

  //   setMenuItems(tasks);
  // }, []);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axiosInstance.get('/adminData/revenue');
        setTotalRevenue(response?.data?.totalRevenue);
      } catch (error) {
        toast.error(error.response.data.message)
        console.error('Error fetching total revenue:', error);
      }
    };

    const fetchNewUsersCount = async () => {
      try {
        const response = await axiosInstance.get('/adminData/newUser');
        setNewUsersCount(response.data.newUsersCount);
      } catch (error) {
        console.error('Error fetching new users count:', error);
      }
    };

    const fetchBooksPurchasedData = async () => {
      try {
        const response = await axiosInstance.get('/adminData/purchased');
        setBooksPurchasedCount(response.data.booksPurchasedCount);
      } catch (error) {
        console.error('Error fetching books purchased data:', error);
      }

    };

    const getUserRoleById = async () => {
      try{
        const response = await axiosInstance.get(`/user/${userId}`);
        setUserRole(response.data.data.role.name);
      }
      catch(error){
        console.log(error);
      }
    }

    fetchTotalRevenue();
    fetchNewUsersCount();
    fetchBooksPurchasedData();
    getUserRoleById();
  }, []);

  return (
    <div className="admin-dashboard-page">
      {/* <div className='admin-header'>  */}
        {/* <CustomSidebar /> */}
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
{/* </div> */}
     
      <div className="admin-stats-section">
        <div className="admin-stat-card">
          <FaDollarSign className="admin-stat-icon" />
          <div className="stat-info">
            <p className="stat-number">${totalRevenue}</p>
            <p className="stat-label">Total Revenue</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <FaUser className="admin-stat-icon" />
          <div className="stat-info">
            <p className="stat-number">{newUsersCount}</p>
            <p className="stat-label">New Users Today</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <FaBook className="admin-stat-icon" />
          <div className="stat-info">
            <p className="stat-number">{booksPurchasedCount}</p>
            <p className="stat-label">Books Purchased</p>
          </div>
        </div>
      </div>

      <div className="admin-options-section">
        <Link to="/admin/books" className="admin-option-link">
          <div className="admin-option-card">
            <FaBook className="admin-option-icon" />
            <p className="admin-option-label">Manage Books</p>
          </div>
        </Link>
        <Link to="/admin/users" className="admin-option-link">
          <div className="admin-option-card">
            <FaUserFriends className="admin-option-icon" />
            <p className="admin-option-label">Manage Users</p>
          </div>
        </Link>
        <Link to="/admin/categories" className="admin-option-link">
          <div className="admin-option-card">
            <MdCategory className="admin-option-icon" />
            <p className="admin-option-label">Manage Categories</p>
          </div>
        </Link>
        <Link to="/admin/authors" className="admin-option-link">
          <div className="admin-option-card">
            <FaUser className="admin-option-icon" />
            <p className="admin-option-label">Manage Authors</p>
          </div>
        </Link>
        <Link to="/admin/purchase-requests" className="admin-option-link">
          <div className="admin-option-card">
            <FaClipboardList className="admin-option-icon" />
            <p className="admin-option-label">Purchase Requests</p>
          </div>
        </Link>
        {/* <Link to="/admin/home" className="admin-option-link">
          <div className="admin-option-card">
            <FaClipboardList className="admin-option-icon" />
            <p className="admin-option-label">Home</p>
          </div>
        </Link> */}
       {/* {userRole === "Admin" && <Link to="/assign-tasks" className="admin-option-link">
          <div className="admin-option-card">
            <FaClipboardList className="admin-option-icon" />
            <p className="admin-option-label">Assign Tasks</p>
          </div>
        </Link>} */}
        {/* <Link to="/admin/print-invoices" className="admin-option-link">
          <div className="admin-option-card">
            <FaClipboardList className="admin-option-icon" />
            <p className="admin-option-label">Print Sales Invoices</p>
          </div>
        </Link>
        <Link to="/admin/sell-product" className="admin-option-link">
          <div className="admin-option-card">
            <FaClipboardList className="admin-option-icon" />
            <p className="admin-option-label">Sell Products</p>
          </div>
        </Link>
        <Link to="/Purchase-List" className="admin-option-link">
          <div className="admin-option-card">
            <FaClipboardList className="admin-option-icon" />
            <p className="admin-option-label">Product Purchases</p>
          </div>
        </Link>
        <Link to="/all-purchase-invoice" className="admin-option-link">
          <div className="admin-option-card">
            <FaClipboardList className="admin-option-icon" />
            <p className="admin-option-label">Print Purchase Invoices</p>
          </div>
        </Link> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
