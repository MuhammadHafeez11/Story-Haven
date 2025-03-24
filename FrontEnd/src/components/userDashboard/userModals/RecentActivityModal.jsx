// RecentActivityModal.jsx
import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa"; // Icon for close button
import "./RecentActivityModal.css"; // Import the CSS file for modal

const RecentActivityModal = ({ isOpen, onClose, books, readingHistory }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open
    } else {
      document.body.style.overflow = 'unset'; // Re-enable scrolling when modal is closed
    }
  }, [isOpen]);

  // Close the modal when clicking outside the content area
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-background")) {
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="modal-background" onClick={handleBackgroundClick}>
        <div className="modal-content">
          <button className="modal-close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h2 className="modal-header">Recent Activity</h2>
          <div className="activity-list">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book._id} className="activity-item">
                  <h3>{book.title}</h3>
                  <p>
                    {readingHistory[book._id]
                      ? `Started: ${readingHistory[book._id].startTime}, 
                          Ended: ${readingHistory[book._id].endTime || "In progress"}`
                      : "No reading history available"}
                  </p>
                </div>
              ))
            ) : (
              <p>No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default RecentActivityModal;
