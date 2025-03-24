import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PurchaseRequest.css';
import axiosInstance from '../../../axios/axiosInstance';

const PurchaseRequests = () => {
  const [purchaseRequests, setPurchaseRequests] = useState([]);

  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const response = await axiosInstance.get('/purchase');
        setPurchaseRequests(response.data);
      } catch (error) {
        toast.error('Error fetching purchase requests');
      }
    };

    fetchPurchaseRequests();
  }, []);

  const approvePurchase = async (purchaseId) => {
    try {
      await axiosInstance.post('/purchase/approve', { purchaseId });
      setPurchaseRequests((prev) =>
        prev.map((purchase) =>
          purchase._id === purchaseId ? { ...purchase, status: 'Approved' } : purchase
        )
      );
      toast.success('Purchase approved successfully');
    } catch (error) {
      toast.error('Error approving purchase');
    }
  };

  const rejectPurchase = async (purchaseId) => {
    try {
      await axiosInstance.post('/purchase/reject', { purchaseId });
      setPurchaseRequests((prev) =>
        prev.map((purchase) =>
          purchase._id === purchaseId ? { ...purchase, status: 'Rejected' } : purchase
        )
      );
      toast.success('Purchase rejected successfully');
    } catch (error) {
      toast.error('Error rejecting purchase');
    }
  };

  return (
    <div className="purchase-requests-container">
      <h2 className="purchases-title">Purchase Requests</h2>
      <div className="purchase-details-container">
        <Link to="/admin/purchases">
          <button className="purchase-details-button">See Details</button>
        </Link>
      </div>
      {purchaseRequests.length === 0 ? (
        <p className="no-purchase-requests">No purchase requests available</p>
      ) : (
        <ul className="purchase-requests-list">
          {purchaseRequests.map((purchase) => (
            <li key={purchase._id} className="purchase-request-item">
              <p><strong>User:</strong> {purchase?.userID?.username}</p>
              <p><strong>Book:</strong> {purchase?.bookID?.title}</p>
              <p><strong>Status:</strong> {purchase?.status}</p>
              {purchase.status === 'Pending' && (
                <div className="purchase-actions">
                  <button
                    className="approve-purchase-button"
                    onClick={() => approvePurchase(purchase._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-purchase-button"
                    onClick={() => rejectPurchase(purchase._id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PurchaseRequests;
