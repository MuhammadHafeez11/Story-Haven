import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { FaBookmark } from "react-icons/fa";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { toast } from "react-hot-toast";
import "../styles/pagesStyles/TrackBook.css";
import axiosInstance from "../axios/axiosInstance";

pdfjs.GlobalWorkerOptions.workerSrc = `http://localhost:5000/pdf.worker.min.mjs`;

const TrackBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedPage, setBookmarkedPage] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(queryParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`/book/${bookId}`);
        const bookData = response.data;
        setBook(bookData);

        // Set the start time when the component mounts
        if (!startTime) {
          const startingTime = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          setStartTime(startingTime);
        }

        // Fetch bookmark
        const userId = localStorage.getItem("userID");
        const bookmarkResponse = await axiosInstance.get(`/bookmark`, {
          params: { userID: userId, bookID: bookId },
        });

        if (bookmarkResponse.data) {
          const { pageNumber } = bookmarkResponse.data;
          setIsBookmarked(true);
          setBookmarkedPage(pageNumber);
        }
      } catch (error) {
        console.error("Error fetching book or bookmark:", error);
      }
    };

    fetchBook();

    const handleBeforeUnload = (event) => {
      storeReadingHistory();
    };

    // Attach event listeners for tab close or page navigation
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", storeReadingHistory);

    return () => {
      // Cleanup event listeners on component unmount
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", storeReadingHistory);

      // Also store reading history on component unmount
      storeReadingHistory();
    };
  }, [bookId, currentPage, startTime]);

  // Function to store reading history
  const storeReadingHistory = async () => {
    if (startTime) {
      const userId = localStorage.getItem("userID");
      try {
        const endTime = new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        await axiosInstance.post("/readinghistory", {
          userID: userId,
          bookID: bookId,
          startTime,
          endTime,
          numberOfPagesRead: currentPage,
        });
      } catch (error) {
        console.error("Error saving reading history:", error);
      }
    }
  };

  // Function to handle bookmark
  const handleBookmark = async () => {
    const userId = localStorage.getItem("userID");
    try {
      await axiosInstance.post("/bookmark", {
        userID: userId,
        bookID: bookId,
        pageNumber: currentPage,
      });
      setIsBookmarked(true);
      setBookmarkedPage(currentPage);
      toast.success(`Bookmark saved for page ${currentPage}!`);
    } catch (error) {
      toast.error("Failed to save bookmark.");
    }
  };

  const handleReturnToBookmark = () => {
    if (bookmarkedPage) {
      setCurrentPage(bookmarkedPage);
    }
  };

  const handleExitBook = () => {
    navigate("/book"); // Navigate to the books page
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top of the PDF viewer
  };

  return (
    <div className="track-book-container">
      {book ? (
        <div className="track-book-details">
          <h1>{book.title}</h1>

          <div className="bookmark-section">
            {/* Return to bookmarked page button */}
            {isBookmarked && bookmarkedPage && (
              <button
                onClick={handleReturnToBookmark}
                className="return-to-bookmark-button"
              >
                Return to Bookmarked Page {bookmarkedPage}
              </button>
            )}

            {/* Bookmark button */}
            <button onClick={handleBookmark} className="bookmark-button">
              <FaBookmark color={isBookmarked ? "gold" : "gray"} />
              {isBookmarked
                ? ` Bookmarked (Page ${bookmarkedPage})`
                : " Bookmark"}
            </button>
          </div>

          {/* Display PDF */}
          {book.pdfFile && (
            <div className="pdf-viewer">
              <Document
                file={`http://localhost:5000/uploads/bookUploads/${book.pdfFile}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={currentPage} />
              </Document>

              <p>
                Page {currentPage} of {numPages}
              </p>

              <button
                className="page-button"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <button
                className="page-button"
                disabled={currentPage >= numPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}

          {/* Exit button */}
          <button onClick={handleExitBook} className="exit-button">
            Exit Book
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TrackBook;