import React from "react";
import '../../../styles/componentsStyles/UserDashboard/UserModalStyles/PurchaseModal.css'

const PurchasesModal = ({ isOpen, onClose, purchasedBooks, totalSpent }) => {
  if (!isOpen) return null;

   // Close the modal when clicking outside the content area
   const handleBackgroundClick = (e) => {
    if (e.target.className.includes("modal-background")) {
      onClose();
    }
  };

  return (
    isOpen && 
    <div className="modal-background" onClick={handleBackgroundClick}>
    {/* <div className="modal-overlay" onClick={onClose}> */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Purchases</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p><b>Total Spent:</b> ${totalSpent.toFixed(2)}</p>
          <ul className="purchased-books-list">
            {purchasedBooks.length > 0 ? (
              purchasedBooks.map((book) => (
                <li key={book._id}>
                  <h3>{book.title}</h3>
                  <p>${book.price}</p>
                </li>
              ))
            ) : (
              <p>No purchases yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default PurchasesModal;
