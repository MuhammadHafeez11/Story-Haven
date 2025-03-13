import React, { useState, useEffect } from "react";
import { FaUserCircle, FaBook, FaBookmark, FaShoppingCart } from "react-icons/fa";
import RecentActivityModal from "./userModals/RecentActivityModal";
import ViewBookmarksModal from "./userModals/ViewBookMarkModal";
import PurchasesModal from "./userModals/PurchaseModal";
import UserProfileModal from "./userModals/UserProfileModal"; // Import UserProfileModal
import axiosInstance from "../../axios/axiosInstance";
import "../../styles/componentsStyles/UserDashboard/UserDashboard.css";

const UserDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isPurchasesModalOpen, setIsPurchasesModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Profile modal state
  const [books, setBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [readingHistory, setReadingHistory] = useState({});
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userID");

  // Open and close profile modal
  const openProfileModal = () => setIsProfileModalOpen(true); // Open Profile Modal
  const closeProfileModal = () => setIsProfileModalOpen(false); // Close Profile Modal

  // Fetch Recent Activity Modal data
  const openModal = async () => {
    try {
      const purchasedBooksResponse = await axiosInstance.get(`/purchase/${userId}`);
      const historyResponse = await axiosInstance.get(`/readinghistory/${userId}`);

      const purchasedBooks = purchasedBooksResponse.data;
      const readingData = historyResponse.data;
      

      const historyMap = {};
      readingData.forEach((entry) => {
        historyMap[entry.bookID?._id] = entry;
      });

      setBooks(purchasedBooks.map((purchase) => purchase.bookID));
      setReadingHistory(historyMap);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching recent activity data", error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  // Fetch Purchases Modal data
  const openPurchasesModal = async () => {
    try {
      const response = await axiosInstance.get(`/purchase/${userId}`);
      const purchasedData = response.data;

      const totalSpentAmount = purchasedData.reduce((total, purchase) => {
        return total + (purchase.bookID.price || 0); // Calculate total price
      }, 0);

      setPurchasedBooks(purchasedData.map((purchase) => purchase.bookID));
      setTotalSpent(totalSpentAmount);
      setIsPurchasesModalOpen(true);
    } catch (error) {
      console.error("Error fetching purchases data", error);
    }
  };

  const closePurchasesModal = () => setIsPurchasesModalOpen(false);

  // Open and close Bookmarks modal
  const openBookmarkModal = () => setIsBookmarkModalOpen(true);
  const closeBookmarkModal = () => setIsBookmarkModalOpen(false);

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-header">
        <h1>Welcome {userName}</h1>
        <p>Manage your profile, track your activity, and explore more features.</p>
      </div>

      <div className="dashboard-cards-container">
        {/* Profile Overview */}
        <div className="dashboard-card">
          <FaUserCircle className="dashboard-icon" />
          <h2>Profile Overview</h2>
          <p>View and edit your personal information.</p>
          <button className="dashboard-button" onClick={openProfileModal}>
            View Profile
          </button>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <FaBook className="dashboard-icon" />
          <h2>Recent Activity</h2>
          <p>Track your recent book readings and activity.</p>
          <button className="dashboard-button" onClick={openModal}>
            See Activity
          </button>
        </div>

        {/* Bookmarks */}
        <div className="dashboard-card">
          <FaBookmark className="dashboard-icon" />
          <h2>Your Bookmarks</h2>
          <p>Access saved pages and books quickly.</p>
          <button className="dashboard-button" onClick={openBookmarkModal}>
            View Bookmarks
          </button>
        </div>

        {/* Purchases */}
        <div className="dashboard-card">
          <FaShoppingCart className="dashboard-icon" />
          <h2>Purchases</h2>
          <p>Check your purchase history and total spending.</p>
          <button className="dashboard-button" onClick={openPurchasesModal}>
            View Purchases
          </button>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        userId={userId}
      />

      {/* Recent Activity Modal */}
      <RecentActivityModal
        isOpen={isModalOpen}
        onClose={closeModal}
        books={books}
        readingHistory={readingHistory}
      />

      {/* View Bookmarks Modal */}
      <ViewBookmarksModal
        isOpen={isBookmarkModalOpen}
        onClose={closeBookmarkModal}
        userId={userId}
      />

      {/* Purchases Modal */}
      <PurchasesModal
        isOpen={isPurchasesModalOpen}
        onClose={closePurchasesModal}
        purchasedBooks={purchasedBooks}
        totalSpent={totalSpent}
      />
    </div>
  );
};

export default UserDashboard;
