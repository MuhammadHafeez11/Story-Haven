import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";
import "../../styles/pagesStyles/manageBooksStyles/BookForm.css";
import { FaTimes } from 'react-icons/fa';

const BookForm = ({ id, onClose }) => {
  const [bookData, setBookData] = useState({
    title: "",
    description: "",
    coverImage: null,
    pdfFile: null,
    price: "",
    authorID: "",
    categoryID: "",
  });
  const [currentImage, setCurrentImage] = useState(null); // For current image in edit mode
  const [currentPDF, setCurrentPDF] = useState(null); // For current PDF in edit mode
  // const [selectedImageName, setSelectedImageName] = useState(''); // Placeholder for image file
  // const [selectedPDFName, setSelectedPDFName] = useState(''); // Placeholder for PDF file
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAuthorsAndCategories = async () => {
      try {
        const [authorsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("/author"),
          axiosInstance.get("/category"),
        ]);
        setAuthors(authorsRes.data);
        setCategories(categoriesRes.data);

        if (id) {
          const bookRes = await axiosInstance.get(`/book/${id}`);
          setBookData({
            title: bookRes.data.title,
            description: bookRes.data.description,
            coverImage: null, // Reset to allow file upload
            pdfFile: null,
            price: bookRes.data.price,
            authorID: bookRes.data.authorID._id,
            categoryID: bookRes.data.categoryID._id,
          });
          setCurrentImage(bookRes.data.coverImage); // Assuming it's a URL from backend
          setCurrentPDF(bookRes.data.pdfFile); // Assuming it's a URL from backend
          // setSelectedImageName('Current Image Selected');
          // setSelectedPDFName('Current PDF Selected');
        }
      } catch (error) {
        toast.error("Error loading data");
      }
    };
    fetchAuthorsAndCategories();
  }, [id]);

  const handleInputChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "coverImage") {
      setBookData({ ...bookData, coverImage: files[0] });
      // setSelectedImageName(files[0]?.name || "");
    } else if (name === "pdfFile") {
      setBookData({ ...bookData, pdfFile: files[0] });
      // setSelectedPDFName(files[0]?.name || "");
    }
  };

  const handleSubmit = async () => {
    try {
    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("description", bookData.description);
    formData.append("price", bookData.price);
    formData.append("authorID", bookData.authorID);
    formData.append("categoryID", bookData.categoryID);
    if (bookData.coverImage) formData.append("image", bookData.coverImage);
    if (bookData.pdfFile) formData.append("pdf", bookData.pdfFile);

    console.log(formData);

    
    
      if (id) {
        await axiosInstance.put(`/book/${id}`, formData);
        toast.success("Book updated successfully");
      } else {
        await axiosInstance.post('/book', formData);
        toast.success("Book added successfully");
      }

      onClose();
    } catch (error) {
      toast.error("Error saving book", error);
    }
  };

  return (
    <div className="book-form-card">
      <div className="book-form-header">
        <h2>{id ? "Update Book" : "Add Book"}</h2>
        <FaTimes className="modal-close-icon" onClick={onClose} />
      </div>

      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={bookData.title}
          onChange={handleInputChange}
          className="book-input-field"
        />

        <label htmlFor="description">Description:</label>
        <textarea
          name="description"
          placeholder="Description"
          value={bookData.description}
          onChange={handleInputChange}
          className="book-input-field"
        ></textarea>

        <label htmlFor="author">Author:</label>
        <select
          name="authorID"
          value={bookData.authorID}
          onChange={handleInputChange}
          className="book-input-field"
        >
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>

        <label htmlFor="category">Category:</label>
        <select
          name="categoryID"
          value={bookData.categoryID}
          onChange={handleInputChange}
          className="book-input-field"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={bookData.price}
          onChange={handleInputChange}
          className="book-input-field"
        />

        {/* Cover Image Input */}
        <label htmlFor="coverImage" className="file-label">
          Cover Image:
        </label>
        <div className="file-input-wrapper">
          <input
            type="file"
            name="coverImage"
            onChange={handleFileChange}
            className="book-input-field"
          />
          {currentImage && (
            <a
              href={`http://localhost:5000/uploads/bookUploads/${currentImage}`}
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
          PDF File:
        </label>
        <div className="file-input-wrapper">
          <input
            type="file"
            name="pdfFile"
            accept=".pdf"
            onChange={handleFileChange}
            className="book-input-field"
          />
          {currentPDF && (
            <a
              href={`http://localhost:5000/uploads/bookUploads/${currentPDF}`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-image-links"
            >
              View Current PDF
            </a>
          )}
        </div>

        <button onClick={handleSubmit} className="action-button">
          {id ? "Update Book" : "Add Book"}
        </button>
      </div>
    </div>
  );
};

export default BookForm;
