import React, { useState, useEffect } from "react";
import "../../../styles/componentsStyles/UserDashboard/UserModalStyles/UserProfileModal.css";
import axiosInstance from "../../../axios/axiosInstance";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const UserProfileModal = ({ isOpen, onClose, userId }) => {
  const [step, setStep] = useState(1); // State to manage steps
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const currentUserName = localStorage.getItem("userName")
  const [currentPassword, setCurrentPassword] = useState("");
  const [credentials, setCredentials] = useState({ username: "", password: "" }); // For credential verification
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal opens
      setStep(1);
      setCredentials({ username: "", password: "" });
      setProfileData({ username: "", email: "", password: "" });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleCredentialsChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleVerifyCredentials = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      if( currentUserName === credentials.username ){
        console.log(currentUserName, credentials.username);

        
      const response = await axiosInstance.post(`/user/verify`, credentials);
      if (response.data.status === "Success") {
        // If verification is successful, fetch user profile data and move to step 2
        const profileResponse = await axiosInstance.get(`/user/${userId}`);
        setProfileData(profileResponse.data.data);
        setStep(2);
      }
    }
    else {
      setLoading(false);
      toast.error("Incorrect username or password.");
    }
    } catch (error) {
      setLoading(false);
      console.error("Error verifying credentials", error);
      toast.error("Incorrect username or password.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Include currentPassword in the request payload
      await axiosInstance.patch(`/user/${userId}`, { ...profileData, currentPassword });

      setLoading(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile", error);
      toast.error("Error updating profile.");
    }
  };

  const closeModal = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="user-profile-modal">
          <div className="modal-header">
            <h2>{step === 1 ? "Verify Credentials" : "Update Profile"}</h2>
            <FaTimes className="close-icon" onClick={onClose} />
          </div>
          {step === 1 ? (
            <form onSubmit={handleVerifyCredentials}>
              <div className="profile-modal-content">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Current Username"
                  value={credentials.username}
                  onChange={handleCredentialsChange}
                  required
                />
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Current Password"
                  value={credentials.password}
                  onChange={handleCredentialsChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="profile-modal-content">
                <label>Name:</label>
                <input
                  type="name"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                />

                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                />

                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter New Password"
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );
};

export default UserProfileModal;
