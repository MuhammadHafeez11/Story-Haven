import React, { useState, useEffect } from "react";
import './SeeAllPurchases.css'; 
import axiosInstance from "../../../axios/axiosInstance";

const SeeAllPurchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axiosInstance.get("/purchase");
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchPurchases();
  }, []);

  const handleApprovePurchase = async (purchaseId) => {
    try {
      await axiosInstance.put(`/purchase/${purchaseId}/approve`);
      setPurchases((prev) =>
        prev.map((purchase) => 
          purchase._id === purchaseId ? { ...purchase, status: 'approved' } : purchase
        )
      );
      toast.success('Purchase approved successfully');
    } catch (error) {
      console.error("Error approving purchase:", error);
    }
  };

  return (
    <div className="see-all-purchases-container">
      <h2 className="purchases-title">All Purchases</h2>
      {purchases.length === 0 ? (
        <p className="no-purchases">No purchases yet</p>
      ) : (
        <div className="see-all-purchases-list">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="purchase-item">
              <p><strong>Purchase ID:</strong> {purchase?._id}</p>
              <p><strong>User Name:</strong> {purchase?.userID?.username}</p>
              <p><strong>Book Title:</strong> {purchase?.bookID?.title}</p>
              <p><strong>Card Info:</strong> {purchase?.cardInfo}</p>
              <p><strong>Purchase Date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {purchase.status}</p>
              {purchase.status === 'pending' && (
                <button 
                  className="approve-purchase-button"
                  onClick={() => handleApprovePurchase(purchase._id)}>
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeeAllPurchases;
