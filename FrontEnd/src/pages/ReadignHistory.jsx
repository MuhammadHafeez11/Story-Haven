import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axios/axiosInstance';
import toast from 'react-hot-toast';

const ReadingHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get(`/readinghistory`);
        setHistory(response.data);
      } catch (error) {
        toast.error('Error fetching reading history');
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div>
      <h1>Reading History</h1>
      {history.length > 0 ? (
        <ul>
          {history.map((entry) => (
            <li key={entry._id}>
              <h2>Book: {entry.bookID.title}</h2>
              <p>Start Time: {(entry.startTime).toLocaleString()}</p>
              <p>End Time: {entry.endTime ? (entry.endTime).toLocaleString() : 'Still Reading'}</p>
              <p>Pages Read: {entry.numberOfPagesRead}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reading history available.</p>
      )}
    </div>
  );
};

export default ReadingHistory;
