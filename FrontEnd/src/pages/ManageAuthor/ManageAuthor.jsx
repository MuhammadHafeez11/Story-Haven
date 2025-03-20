import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrashAlt, FaPlus, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "../../axios/axiosInstance";
import "../../styles/pagesStyles/manageAuthorStyles/ManageAuthor.css";
import toast from "react-hot-toast";
import CustomTable from "../../customComponents/customTable";
import { createColumnHelper } from "@tanstack/react-table";
import AuthorFormModal from "./AuthorForm";

const ManageAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/author");
      setAuthors(response.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByName = () => {
    if (searchName) {
      const filteredAuthors = authors.filter((author) =>
        author.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setAuthors(filteredAuthors);
    } else {
      fetchAuthors();
    }
  };

  const handleAddAuthor = () => {
    setEditingAuthorId(null);
    setIsModalOpen(true);
  };

  const handleEditAuthor = (authorId) => {
    setEditingAuthorId(authorId);
    setIsModalOpen(true);
  };

  const handleDeleteAuthor = async (authorId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/author/${authorId}`);
        setAuthors(authors.filter((author) => author._id !== authorId));
        toast.success("Author deleted successfully.");

        Swal.fire({
          title: "Deleted!",
          text: "Author has been deleted.",
          icon: "success",
        });
        fetchAuthors();
      } catch (error) {
        console.error("Error deleting author:", error);
        toast.error("Error deleting author.");
      }
    }
  };

  const handleToggleFeatured = async (authorId, isFeatured) => {
    try {
      await axiosInstance.patch(`/author/${authorId}`, { isFeatured: !isFeatured });
      fetchAuthors();
      toast.success("Author featured status updated.");
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Error updating featured status.");
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("biography", {
      header: () => "Biography",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("photo", {
      header: () => "Photo",
      cell: (info) =>
        info.getValue() && (
          <img
            src={`${axiosInstance.defaults.baseURL}/uploads/authorUploads/${info.getValue()}`}
            alt="Author"
            width="50"
            className="author-photo"
          />
        ),
    }),
    columnHelper.accessor("isFeatured", {
      header: () => "Featured",
      cell: (info) => (
        <FaStar
          className={`featured-icon ${info.getValue() ? "featured" : ""}`}
          onClick={() => handleToggleFeatured(info.row.original._id, info.getValue())}
        />
      ),
    }),
    columnHelper.accessor("_id", {
      header: "Actions",
      cell: (info) => (
        <div className="action-icon">
          <FaEdit
            className="edit-icon"
            onClick={() => handleEditAuthor(info.getValue())}
          />
          <FaTrashAlt
            className="delete-icon"
            onClick={() => handleDeleteAuthor(info.getValue())}
          />
        </div>
      ),
    }),
  ];

  if (loading) return <p className="loading-text">Loading authors...</p>;

  return (
    <div className="manage-authors-container">
      <h1 className="title">Manage Authors</h1>

      <div className="search-add-container">
        <div className="search-bar">
          <input
            id="searchName"
            type="text"
            placeholder="Search by Author Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
          <FaSearch
            onClick={handleSearchByName}
            className="book-search-button"
          />
        </div>
        <button onClick={handleAddAuthor} className="add-button">
          <FaPlus />
        </button>
      </div>

      <CustomTable data={authors} columns={columns} />

      {isModalOpen && (
        <AuthorFormModal
          authorId={editingAuthorId}
          closeModal={() => setIsModalOpen(false)}
          fetchAuthors={fetchAuthors}
        />
      )}
    </div>
  );
};

export default ManageAuthors;
