"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { FaEdit, FaTrashAlt, FaPlus, FaStar, FaBook } from "react-icons/fa"
import toast from "react-hot-toast"
// import axiosInstance from "../../axios/axiosInstance"
// import SearchBooks from "../../components/SearchBooks"
// import CustomTable from "../../customComponents/customTable"
import { createColumnHelper } from "@tanstack/react-table"
import BookForm from "./BookForm"
import "./ManageBook.css"
import axiosInstance from "../../../axios/axiosInstance"
import SearchBooks from "../../../components/Search/SearchBooks"
import CustomTable from "../../../components/customComponents/customTable"

const ManageBooks = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showBookForm, setShowBookForm] = useState(false)
  const [editingBookId, setEditingBookId] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/book")
      setBooks(response.data)
    } catch (error) {
      toast.error("Error fetching books")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchResults = (results) => {
    if (!results || results.length === 0) {
      toast.error("No Book Found")
    } else {
      setBooks(results)
    }
  }

  const deleteBook = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5d3891",
      cancelButtonColor: "#f05454",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      borderRadius: "0.5rem",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/book/${id}`)
          setBooks(books.filter((book) => book._id !== id))
          toast.success("Book deleted successfully")
          fetchBooks()
        } catch (error) {
          toast.error("Error deleting the book")
        }
      }
    })
  }

  const handleToggleBookIsFeatured = async (bookId, isFeatured) => {
    try {
      await axiosInstance.patch(`/book/${bookId}`, { isFeatured: !isFeatured })
      fetchBooks()
      toast.success(`Book ${!isFeatured ? "added to" : "removed from"} featured collection`)
    } catch (error) {
      console.error("Error updating featured status:", error)
      toast.error("Error updating featured status")
    }
  }

  const openAddBookForm = () => {
    setEditingBookId(null)
    setShowBookForm(true)
  }

  const openEditBookForm = (id) => {
    setEditingBookId(id)
    setShowBookForm(true)
  }

  const closeBookForm = () => {
    setShowBookForm(false)
    fetchBooks()
  }

  const columnHelper = createColumnHelper()

  const columns = [
    {
      header: "Cover",
      accessorKey: "coverImage",
      cell: ({ row }) => (
        <img
          src={`${axiosInstance.defaults.baseURL}/uploads/bookUploads/${row.original.coverImage}`}
          alt={row.original.title}
          className="book-cover-preview"
        />
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Author",
      accessorKey: "authorID.name",
    },
    {
      header: "Category",
      accessorKey: "categoryID.name",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => `$${row.original.price}`,
    },
    columnHelper.accessor("isFeatured", {
      header: () => "Featured",
      cell: (info) => (
        <div className="featured-container">
          <FaStar
            className={`featured-icon ${info.getValue() ? "featured" : ""}`}
            onClick={() => handleToggleBookIsFeatured(info.row.original._id, info.getValue())}
            title={info.getValue() ? "Remove from featured" : "Add to featured"}
          />
        </div>
      ),
    }),
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="action-icon">
          <button
            className="action-button edit-icon"
            onClick={() => openEditBookForm(row.original._id)}
            title="Edit book"
          >
            <FaEdit />
          </button>
          <button
            className="action-button delete-icon"
            onClick={() => deleteBook(row.original._id)}
            title="Delete book"
          >
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="manage-books-container">
      <h2 className="title">Manage Books</h2>

      <div className="search-add-container">
        <div className="search-wrapper">
          <SearchBooks onSearchResults={handleSearchResults} className="search" />
        </div>
        <button onClick={openAddBookForm} className="add-book-button" title="Add book">
          <FaPlus />
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading books...</p>
        </div>
      ) : books.length > 0 ? (
        <CustomTable columns={columns} data={books} />
      ) : (
        <div className="empty-state">
          <FaBook className="empty-state-icon" />
          <p className="empty-state-text">No books available yet</p>
          <button className="empty-state-button" onClick={openAddBookForm}>
            Add Your First Book
          </button>
        </div>
      )}

      {showBookForm && (
        <div className="modal-container">
          <div className="modal-overlay" onClick={closeBookForm}></div>
          <div className="book-form-modal">
            <BookForm id={editingBookId} onClose={closeBookForm} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBooks