
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../../../axios/axiosInstance"
import "./BookForm.css"
import { FaTimes } from "react-icons/fa"

const BookForm = ({ id, onClose }) => {
  const [bookData, setBookData] = useState({
    title: "",
    description: "",
    coverImage: null,
    pdfFile: null,
    price: "",
    authorID: "",
    categoryID: "",
  })
  const [currentImage, setCurrentImage] = useState(null)
  const [currentPDF, setCurrentPDF] = useState(null)
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [imageFileName, setImageFileName] = useState("")
  const [pdfFileName, setPdfFileName] = useState("")

  useEffect(() => {
    const fetchAuthorsAndCategories = async () => {
      try {
        const [authorsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("/author"),
          axiosInstance.get("/category"),
        ])
        setAuthors(authorsRes.data)
        setCategories(categoriesRes.data)

        if (id) {
          const bookRes = await axiosInstance.get(`/book/${id}`)
          setBookData({
            title: bookRes.data.title,
            description: bookRes.data.description,
            coverImage: null,
            pdfFile: null,
            price: bookRes.data.price,
            authorID: bookRes.data.authorID._id,
            categoryID: bookRes.data.categoryID._id,
          })
          setCurrentImage(bookRes.data.coverImage)
          setCurrentPDF(bookRes.data.pdfFile)
        }
      } catch (error) {
        toast.error("Error loading data")
        console.error("Error loading data:", error)
      }
    }
    fetchAuthorsAndCategories()
  }, [id])

  const handleInputChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      if (name === "coverImage") {
        setBookData({ ...bookData, coverImage: files[0] })
        setImageFileName(files[0].name)
      } else if (name === "pdfFile") {
        setBookData({ ...bookData, pdfFile: files[0] })
        setPdfFileName(files[0].name)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission

    try {
      // Validate required fields
      if (!bookData.title || !bookData.description || !bookData.price || !bookData.authorID || !bookData.categoryID) {
        return toast.error("Please fill all required fields")
      }

      // Validate file requirements for new book
      if (!id && (!bookData.coverImage || !bookData.pdfFile)) {
        return toast.error("Cover image and PDF file are required for new books")
      }

      const formData = new FormData()
      formData.append("title", bookData.title)
      formData.append("description", bookData.description)
      formData.append("price", bookData.price)
      formData.append("authorID", bookData.authorID)
      formData.append("categoryID", bookData.categoryID)

      // Only append files if they exist
      if (bookData.coverImage) {
        formData.append("image", bookData.coverImage)
      }

      if (bookData.pdfFile) {
        formData.append("pdf", bookData.pdfFile)
      }

      // Log FormData entries for debugging
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      if (id) {
        await axiosInstance.put(`/book/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        toast.success("Book updated successfully")
      } else {
        await axiosInstance.post("/book", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        toast.success("Book added successfully")
      }

      onClose()
    } catch (error) {
      console.error("Error saving book:", error)
      toast.error(error.response?.data?.message || "Error saving book")
    }
  }

  return (
    <div className="book-form-card">
      <div className="book-form-header">
        <h2>{id ? "Update Book" : "Add Book"}</h2>
        <FaTimes className="modal-close-icon" onClick={onClose} />
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Title: <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={bookData.title}
          onChange={handleInputChange}
          className="book-input-field"
          required
        />

        <label htmlFor="description">
          Description: <span className="required">*</span>
        </label>
        <textarea
          name="description"
          id="description"
          placeholder="Description"
          value={bookData.description}
          onChange={handleInputChange}
          className="book-input-field"
          required
        ></textarea>

        <label htmlFor="authorID">
          Author: <span className="required">*</span>
        </label>
        <select
          name="authorID"
          id="authorID"
          value={bookData.authorID}
          onChange={handleInputChange}
          className="book-input-field"
          required
        >
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>

        <label htmlFor="categoryID">
          Category: <span className="required">*</span>
        </label>
        <select
          name="categoryID"
          id="categoryID"
          value={bookData.categoryID}
          onChange={handleInputChange}
          className="book-input-field"
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="price">
          Price: <span className="required">*</span>
        </label>
        <input
          type="number"
          name="price"
          id="price"
          placeholder="Price"
          value={bookData.price}
          onChange={handleInputChange}
          className="book-input-field"
          required
        />

        {/* Cover Image Input */}
        <label htmlFor="coverImage" className="file-label">
          Cover Image: {!id && <span className="required">*</span>}
          <span className="file-note">(Image must be 300x300 pixels)</span>
        </label>
        <div className="file-input-wrapper">
          <input
            type="file"
            name="coverImage"
            id="coverImage"
            onChange={handleFileChange}
            className="book-input-field"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            required={!id}
          />
          {imageFileName && <div className="file-name">Selected: {imageFileName}</div>}
          {currentImage && (
            <a
              href={`${axiosInstance.defaults.baseURL}/uploads/bookUploads/${currentImage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-image-links"
            >
              View Current Image
            </a>
          )}
        </div>

        {/* PDF Input */}
        <label htmlFor="pdfFile" className="file-label">
          PDF File: {!id && <span className="required">*</span>}
        </label>
        <div className="file-input-wrapper">
          <input
            type="file"
            name="pdfFile"
            id="pdfFile"
            accept=".pdf"
            onChange={handleFileChange}
            className="book-input-field"
            required={!id}
          />
          {pdfFileName && <div className="file-name">Selected: {pdfFileName}</div>}
          {currentPDF && (
            <a
              href={`${axiosInstance.defaults.baseURL}/uploads/bookUploads/${currentPDF}`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-image-links"
            >
              View Current PDF
            </a>
          )}
        </div>

        <button type="submit" className="book-form-action-button">
          {id ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  )
}

export default BookForm