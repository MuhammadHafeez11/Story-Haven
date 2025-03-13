import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import '../../styles/pagesStyles/manageCategoryStyles/CategoryForm.css';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

const CategoryFormModal = ({ isOpen, onClose, category, refreshCategories }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const isEditing = !!category;

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description);
        } else {
            setName('');
            setDescription('');
        }
    }, [category]);

    const handleSubmit = async () => {
        if (!name || !description) {
            toast.error('Both name and description are required.');
            return;
        }

        try {
            if (isEditing) {
                await axiosInstance.put(`/category/${category._id}`, { name, description });
                toast.success("Category Updated Successfully");
            } else {
                await axiosInstance.post('/category', { name, description });
                toast.success("Category Added Successfully");
            }
            onClose();
            refreshCategories();
        } catch (error) {
            console.error('Error submitting category:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">{isEditing ? 'Edit Category' : 'Add Category'}</h2>
                <div className="form-group-category">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="cat-input-field"
                    />
                    <textarea
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="cat-input-field"
                    />
                    <button onClick={handleSubmit} className="submit-button">
                        {isEditing ? 'Update Category' : 'Add Category'}
                    </button>
                </div>
                <FaTimes className="modal-close-icon" onClick={onClose} />
            </div>
        </div>
    );
};

export default CategoryFormModal;
