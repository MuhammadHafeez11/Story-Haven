"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Document, Page, pdfjs } from "react-pdf"
import { toast } from "react-hot-toast"
import {
  FaBookmark,
  FaArrowLeft,
  FaArrowRight,
  FaCog,
  FaTimes,
  FaMinus,
  FaPlus,
  FaSun,
  FaMoon,
  FaBook,
  FaSignOutAlt,
} from "react-icons/fa"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "./TrackBook.css"
import axiosInstance from "../../axios/axiosInstance"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `${axiosInstance.defaults.baseURL}/pdfjs/pdf.worker.min.mjs`

const TrackBook = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const pageFromUrl = Number.parseInt(queryParams.get("page")) || 1

  // State variables
  const [book, setBook] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkedPage, setBookmarkedPage] = useState(null)
  const [currentPage, setCurrentPage] = useState(pageFromUrl)
  const [pageInputValue, setPageInputValue] = useState(pageFromUrl.toString())
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState("light")
  const [fontSize, setFontSize] = useState(100)
  const [showBookmarkTooltip, setShowBookmarkTooltip] = useState(false)

  // Refs
  const pdfContainerRef = useRef(null)

  // Effect to fetch book data and bookmark
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/book/${bookId}`)
        const bookData = response.data
        setBook(bookData)

        // Set the start time when the component mounts
        if (!startTime) {
          const startingTime = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
          setStartTime(startingTime)
        }

        // Fetch bookmark
        const userId = localStorage.getItem("userID")
        const bookmarkResponse = await axiosInstance.get(`/bookmark`, {
          params: { userID: userId, bookID: bookId },
        })

        if (bookmarkResponse.data) {
          const { pageNumber } = bookmarkResponse.data
          setIsBookmarked(true)
          setBookmarkedPage(pageNumber)

          // If no page specified in URL and bookmark exists, go to bookmarked page
          if (!queryParams.get("page") && pageNumber) {
            setCurrentPage(pageNumber)
            setPageInputValue(pageNumber.toString())
          }
        }

        // Load saved theme preference
        const savedTheme = localStorage.getItem("reader-theme") || "light"
        setTheme(savedTheme)
        document.body.className = `reader-theme-${savedTheme}`

        // Load saved font size
        const savedFontSize = localStorage.getItem("reader-font-size")
        if (savedFontSize) {
          setFontSize(Number.parseInt(savedFontSize))
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching book or bookmark:", error)
        toast.error("Failed to load book. Please try again.")
        setLoading(false)
      }
    }

    fetchBook()

    const handleBeforeUnload = () => {
      storeReadingHistory()
    }

    // Attach event listeners for tab close or page navigation
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", storeReadingHistory)

    return () => {
      // Cleanup event listeners on component unmount
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", storeReadingHistory)

      // Also store reading history on component unmount
      storeReadingHistory()
    }
  }, [bookId, startTime])

  // Update URL when page changes
  useEffect(() => {
    const newUrl = `${location.pathname}?page=${currentPage}`
    window.history.replaceState(null, "", newUrl)
  }, [currentPage, location.pathname])

  // Function to store reading history
  const storeReadingHistory = async () => {
    if (startTime && book) {
      const userId = localStorage.getItem("userID")
      try {
        const endTime = new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })

        await axiosInstance.post("/readinghistory", {
          userID: userId,
          bookID: bookId,
          startTime,
          endTime,
          numberOfPagesRead: currentPage,
        })
      } catch (error) {
        console.error("Error saving reading history:", error)
      }
    }
  }

  // Function to handle bookmark
  const handleBookmark = async () => {
    const userId = localStorage.getItem("userID")
    try {
      await axiosInstance.post("/bookmark", {
        userID: userId,
        bookID: bookId,
        pageNumber: currentPage,
      })
      setIsBookmarked(true)
      setBookmarkedPage(currentPage)

      // Show bookmark tooltip
      setShowBookmarkTooltip(true)
      setTimeout(() => {
        setShowBookmarkTooltip(false)
      }, 3000)

      toast.success(`Bookmark saved for page ${currentPage}!`)
    } catch (error) {
      toast.error("Failed to save bookmark.")
    }
  }

  const handleReturnToBookmark = () => {
    if (bookmarkedPage) {
      setCurrentPage(bookmarkedPage)
      setPageInputValue(bookmarkedPage.toString())
      pdfContainerRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleExitBook = () => {
    storeReadingHistory()
    navigate("/book") // Navigate to the books page
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber)
      setPageInputValue(pageNumber.toString())
      pdfContainerRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value)
  }

  const handlePageInputSubmit = (e) => {
    e.preventDefault()
    const pageNum = Number.parseInt(pageInputValue)
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= numPages) {
      handlePageChange(pageNum)
    } else {
      setPageInputValue(currentPage.toString())
    }
  }

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    document.body.className = `reader-theme-${newTheme}`
    localStorage.setItem("reader-theme", newTheme)
  }

  const changeFontSize = (delta) => {
    const newSize = Math.max(50, Math.min(200, fontSize + delta))
    setFontSize(newSize)
    localStorage.setItem("reader-font-size", newSize.toString())
  }

  return (
    <div className="reader-container">
      {/* Header */}
      <header className="reader-header">
        <div className="reader-header-left">
          <button
            className="reader-btn reader-btn-secondary reader-btn-icon"
            onClick={handleExitBook}
            title="Exit Book"
          >
            <FaArrowLeft />
          </button>
          {book && (
            <div>
              <h1 className="reader-title">{book.title}</h1>
              {book.authorID && <p className="reader-author">by {book.authorID.name}</p>}
            </div>
          )}
        </div>

        <div className="reader-header-right">
          <button
            className={`reader-bookmark-btn ${isBookmarked ? "reader-bookmark-active" : ""}`}
            onClick={handleBookmark}
            title={isBookmarked ? "Update Bookmark" : "Add Bookmark"}
          >
            <FaBookmark color={isBookmarked ? "var(--reader-accent)" : "currentColor"} />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>

          {isBookmarked && bookmarkedPage && bookmarkedPage !== currentPage && (
            <button
              onClick={handleReturnToBookmark}
              className="reader-btn reader-btn-primary"
              title="Go to Bookmarked Page"
            >
              Go to Page {bookmarkedPage}
            </button>
          )}

          <button
            className="reader-btn reader-btn-secondary reader-btn-icon"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <FaCog />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="reader-settings-panel">
          <div className="reader-settings-header">
            <h3 className="reader-settings-title">Reading Settings</h3>
            <button className="reader-settings-close" onClick={() => setShowSettings(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="reader-settings-section">
            <h4 className="reader-settings-section-title">Theme</h4>
            <div className="reader-theme-options">
              <div
                className={`reader-theme-option reader-theme-light ${theme === "light" ? "active" : ""}`}
                onClick={() => changeTheme("light")}
                title="Light Theme"
              >
                {theme === "light" && <FaSun />}
              </div>
              <div
                className={`reader-theme-option reader-theme-sepia ${theme === "sepia" ? "active" : ""}`}
                onClick={() => changeTheme("sepia")}
                title="Sepia Theme"
              >
                {theme === "sepia" && <FaBook />}
              </div>
              <div
                className={`reader-theme-option reader-theme-dark ${theme === "dark" ? "active" : ""}`}
                onClick={() => changeTheme("dark")}
                title="Dark Theme"
              >
                {theme === "dark" && <FaMoon />}
              </div>
            </div>
          </div>

          <div className="reader-settings-section">
            <h4 className="reader-settings-section-title">Font Size</h4>
            <div className="reader-font-size-controls">
              <button className="reader-font-size-btn" onClick={() => changeFontSize(-10)} title="Decrease Font Size">
                <FaMinus />
              </button>
              <span className="reader-font-size-value">{fontSize}%</span>
              <button className="reader-font-size-btn" onClick={() => changeFontSize(10)} title="Increase Font Size">
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="reader-content">
        {loading ? (
          <div className="reader-loading">
            <div className="reader-loading-spinner"></div>
            <p className="reader-loading-text">Loading book...</p>
          </div>
        ) : book ? (
          <div className="reader-pdf-container" ref={pdfContainerRef}>
            {/* PDF Viewer */}
            {book.pdfFile && (
              <>
                <div className="reader-pdf-viewer" style={{ fontSize: `${fontSize}%` }}>
                  <Document
                    file={`${axiosInstance.defaults.baseURL}/uploads/bookUploads/${book.pdfFile}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="reader-loading">
                        <div className="reader-loading-spinner"></div>
                        <p className="reader-loading-text">Loading page...</p>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={currentPage}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      scale={fontSize / 100}
                    />
                  </Document>
                </div>

                {/* PDF Controls */}
                <div className="reader-controls">
                  <span className="reader-page-info">
                    Page {currentPage} of {numPages}
                  </span>

                  <div className="reader-page-controls">
                    <button
                      className="reader-btn reader-btn-secondary"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <FaArrowLeft /> Previous
                    </button>

                    <form onSubmit={handlePageInputSubmit}>
                      <input
                        type="text"
                        className="reader-page-input"
                        value={pageInputValue}
                        onChange={handlePageInputChange}
                        onBlur={handlePageInputSubmit}
                      />
                    </form>

                    <button
                      className="reader-btn reader-btn-secondary"
                      disabled={currentPage >= numPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next <FaArrowRight />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="reader-loading">
            <p className="reader-loading-text">Book not found</p>
          </div>
        )}
      </main>

      {/* Exit Button (Mobile) */}
      <button onClick={handleExitBook} className="reader-btn-exit" title="Exit Book">
        <FaSignOutAlt />
      </button>

      {/* Bookmark Tooltip */}
      {showBookmarkTooltip && (
        <div className="reader-bookmark-tooltip">
          <FaBookmark className="reader-bookmark-tooltip-icon" />
          <span>Page {currentPage} bookmarked successfully!</span>
        </div>
      )}
    </div>
  )
}

export default TrackBook

