import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "../../../styles/componentsStyles/UserDashboard/UserModalStyles/ViewBookMarkModal.css";
import axiosInstance from "../../../axios/axiosInstance";

const ViewBookmarksModal = ({ isOpen, onClose, userId }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [readingHistory, setReadingHistory] = useState({});
  
  useEffect(() => {
    if (isOpen) {
      fetchBookmarks();
     
     
    }
  }, [isOpen]);

  const fetchBookmarks = async () => {
    try {
      // Fetch bookmarks
      const bookmarkResponse = await axiosInstance.get(`/bookmark/${userId}`);
      const bookmarkData = bookmarkResponse.data;
      // console.log(bookmarkData)


      // Fetch reading history
      const historyResponse = await axiosInstance.get(`/readinghistory/${userId}`);
      const historyData = historyResponse.data;
    //   console.log(historyData);
      const historyMap = {};
      historyData.forEach((entry) => {
        historyMap[entry.bookID._id] = entry;
      });

      setBookmarks(bookmarkData);
      setReadingHistory(historyMap);
    } catch (error) {
      console.error("Error fetching bookmarks and reading history", error);
    }
  };

  const closeModal = () => {
    onClose();
  };

  const renderBookActions = (book) => {
    const historyEntry = readingHistory[book?._id];
    if (historyEntry) {
      const lastReadPage = historyEntry.numberOfPagesRead;
   
      return (
        <div className="bookmark-buttons">
          <button className="read-button">
            <Link to={`/track/${book._id}?page=${lastReadPage}`} className="anchor-text">Continue Reading (Page {lastReadPage})</Link>
          </button>
        </div>
      );
    } else {
      return (
        <div className="bookmark-buttons">
          <button className="read-button">
            <Link href={`/track/${book?._id}`} className="anchor-text">Read</Link>
          </button>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bookmark-modal-overlay" onClick={closeModal}>
      <div className="bookmark-modal-content" onClick={(e) => e.stopPropagation()}>
        <FaTimes className="close-icon" onClick={closeModal} />
        <h2 className="modal-header">Your Bookmarks</h2>
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <div key={bookmark?.bookID?._id} className="bookmark-item">
              <div className="bookmark-info">
                <h3>{bookmark?.bookID?.title}</h3>
                <p>Bookmarked Page: {bookmark?.pageNumber}</p>
                {renderBookActions(bookmark?.bookID)}
              </div>
            </div>
          ))
        ) : (
          <p>No bookmarks available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewBookmarksModal;
