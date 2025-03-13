import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { FaSearch, FaEdit, FaTrashAlt, FaPlus, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import CustomTable from "../../customComponents/customTable";
import { createColumnHelper } from "@tanstack/react-table";
import CategoryFormModal from "./CategoryForm"; // Import the modal
import '../../styles/pagesStyles/manageCategoryStyles/ManageCategory.css';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get("/category");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSearchByName = async () => {
        if (!searchName) {
            toast.error('Please enter a category name to search.');
            return;
        }

        try {
            const response = await axiosInstance.get(`/category/name/${searchName}`);
            console.log(response.data)
            if (response.data) {
                setCategories([response.data]);
                setSearchName('');
            } else {
                toast.error('Category not found');
            }
        } catch (error) {
            console.error('Error searching category by name:', error);
        }
    };

    const handleToggleCategoryFeatured = async (categoryId, isFeatured) => {
        try {
          const response = await axiosInstance.patch(`/category/${categoryId}`, { isFeatured: !isFeatured });
          fetchCategories();
        //   console.log(response);
          if(response.data.updatedCategory.isFeatured){
          toast.success("Category is now featured.");
          } else {
            toast.success("Category is removed from featured.");
          }
        } catch (error) {
          console.error("Error updating featured status:", error);
          toast.error("Error updating featured status.");
        }
      };

    const deleteCategory = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            });

            if (result.isConfirmed) {
                await axiosInstance.delete(`/category/${id}`);
                setCategories(categories.filter((category) => category._id !== id));

                Swal.fire({
                    title: "Deleted!",
                    text: "Category deleted successfully.",
                    icon: "success"
                });
            }
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete the category.");
        }
    };

    const openModalForAdd = () => {
        setEditCategory(null); // clear editing state
        setModalOpen(true);
    };

    const openModalForEdit = (category) => {
        setEditCategory(category); // set category for editing
        setModalOpen(true);
    };

    const columnHelper = createColumnHelper();

    const columns = [
        { header: "Name", accessorKey: "name" },
        { header: "Description", accessorKey: "description" },
        columnHelper.accessor("isFeatured", {
            header: () => "Featured",
            cell: (info) => (
              <FaStar
                className={`featured-icon ${info.getValue() ? "featured" : ""}`}
                onClick={() => handleToggleCategoryFeatured(info.row.original._id, info.getValue())}
              />
            ),
          }),
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="action-icon">
                    <FaEdit
                        className="edit-icon"
                        onClick={() => openModalForEdit(row.original)}
                        title="Edit"
                    />
                    <FaTrashAlt
                        className="delete-icon"
                        onClick={() => deleteCategory(row.original._id)}
                        title="Delete"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="manage-categories-container">
            <h2 className="title">Manage Categories</h2>
            <div className="search-add-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by Category Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="search-input"
                    />
                    <FaSearch onClick={handleSearchByName} className="search-book-button" />
                </div>
                <button onClick={openModalForAdd} className="add-cat-button" title="Add Category">
                    <FaPlus />
                </button>
            </div>
            <CustomTable columns={columns} data={categories} />

            {/* Modal for Add/Edit Category */}
            {modalOpen && (
                <CategoryFormModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    category={editCategory}
                    refreshCategories={() => fetchCategories()}
                />
            )}
        </div>
    );
};

export default ManageCategories;
