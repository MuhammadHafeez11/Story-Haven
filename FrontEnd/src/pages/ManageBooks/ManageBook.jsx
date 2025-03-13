import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";
import SearchBooks from "../../components/SearchBooks";
import CustomTable from "../../customComponents/customTable";
import { createColumnHelper } from "@tanstack/react-table";
import BookForm from "./BookForm";
import '../../styles/pagesStyles/manageBooksStyles/ManageBook.css';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [showBookForm, setShowBookForm] = useState(false); // To toggle form visibility
    const [editingBookId, setEditingBookId] = useState(null); // To control edit mode

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axiosInstance.get("/book");
            setBooks(response.data);
        } catch (error) {
            toast.error("Error fetching books");
        }
    };

    const handleSearchResults = (results) => {
        if (!results || results.length === 0) {
          toast.error("No Book Found");
        } else {
          setBooks(results);
        }
      };

    const deleteBook = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/book/${id}`);
                    setBooks(books.filter((book) => book._id !== id));
                    toast.success("Book deleted successfully");
                    fetchBooks();
                } catch (error) {
                    toast.error("Error deleting the book");
                }
            }
        });
    };

    const handleToggleBookIsFeatured = async (bookId, isFeatured) => {
        try {
          await axiosInstance.patch(`/book/${bookId}`, { isFeatured: !isFeatured });
          fetchBooks();
          toast.success("Book featured status updated.");
        } catch (error) {
          console.error("Error updating featured status:", error);
          toast.error("Error updating featured status.");
        }
      };

    const openAddBookForm = () => {
        setEditingBookId(null); // Reset edit mode
        setShowBookForm(true); // Show form
    };

    const openEditBookForm = (id) => {
        setEditingBookId(id); // Set book ID for edit
        setShowBookForm(true); // Show form
    };

    const closeBookForm = () => {
        setShowBookForm(false); // Hide form
        fetchBooks();
    };

    const columnHelper = createColumnHelper();

    const columns = [
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
        },
        columnHelper.accessor("isFeatured", {
            header: () => "Featured",
            cell: (info) => (
              <FaStar
                className={`featured-icon ${info.getValue() ? "featured" : ""}`}
                onClick={() => handleToggleBookIsFeatured(info.row.original._id, info.getValue())}
              />
            ),
          }),
        {
            header: "Actions",
            cell: ({ row }) => (
                // <div className="actions-column">
                <div className="action-icon">
                    <FaEdit
                        className="edit-icon"
                        onClick={() => openEditBookForm(row.original._id)}
                        title="Edit"
                    />
                    <FaTrashAlt
                        className="delete-icon"
                        onClick={() => deleteBook(row.original._id)}
                        title="Delete"
                    />
                </div>
                // </div>
            ),
        },
    ];

    return (
        <div className="manage-books-container">
            <h2 className="title">Manage Books</h2>
            <div className="search-add-container">
            <SearchBooks onSearchResults={handleSearchResults} className='search'/>
            <button onClick={openAddBookForm} className="add-book-button">
                    <FaPlus />
                </button>
            </div>
            <CustomTable columns={columns} data={books} />

            {showBookForm && (
                // <div className="book-form-modal">
                    <BookForm
                        id={editingBookId} // Pass ID for editing
                        onClose={closeBookForm} // Close form handler
                    />
                // </div>
            )}
        </div>
    );
};

export default ManageBooks;
