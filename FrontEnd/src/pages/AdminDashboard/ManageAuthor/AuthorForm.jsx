import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../axios/axiosInstance';
import './AuthorForm.css';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

const AuthorFormModal = ({ authorId, closeModal, fetchAuthors }) => {
    const [name, setName] = useState('');
    const [biography, setBiography] = useState('');
    const [photo, setPhoto] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState('');
    const [imageError, setImageError] = useState('');
    const isEditing = Boolean(authorId);

    useEffect(() => {
        if (isEditing) {
            fetchAuthorDetails();
        }
    }, [authorId]);

    const fetchAuthorDetails = async () => {
        try {
            const response = await axiosInstance.get(`/author/${authorId}`);
            const { name, biography, photo } = response.data;
            setName(name);
            setBiography(biography);
            setCurrentPhoto(photo);
        } catch (error) {
            console.error('Error fetching author details:', error);
        }
    };

    const handleSaveAuthor = async () => {
        if (!name || !biography || (!isEditing && !photo)) {
            toast.error('All fields are required.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('biography', biography);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            if (isEditing) {
                await axiosInstance.put(`/author/${authorId}`, formData);
                toast.success('Author Updated Successfully');
            } else {
                await axiosInstance.post('/author', formData);
                toast.success('Author Added Successfully');
            }
            fetchAuthors();
            closeModal();
        } catch (error) {
            setImageError(error.response.data.error);
            toast.error('Failed to save author. Check the image dimensions (300x300) and try again.');
        }
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    return (
        <div className="author-form-modal-overlay" onClick={closeModal}>
            <div className="author-form-modal-container" onClick={(e) => e.stopPropagation()}>
                <FaTimes className="modal-close-icon" onClick={closeModal} />
                <h1 className="title">{isEditing ? 'Edit Author' : 'Add Author'}</h1>

                <div className="form-group">
                    <label htmlFor="name">Author Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Author Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="biography">Biography</label>
                    <textarea
                        id="biography"
                        placeholder="Biography"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        className="textarea-field"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="photo">Upload Author Image</label>
                    <div className="file-input-wrapper">
                        <input
                            id="photo"
                            type="file"
                            onChange={handlePhotoChange}
                            className="file-input"
                        />
                        {currentPhoto && (
                            <a
                                href={`${axiosInstance.defaults.baseURL}/authorUploads/${currentPhoto}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="author-photo-link"
                            >
                                View Current Photo
                            </a>
                        )}
                    </div>
                    {imageError && <p className="error-message">{imageError}</p>}
                </div>
                <button onClick={handleSaveAuthor} className="save-button">
                    {isEditing ? 'Update Author' : 'Add Author'}
                </button>
            </div>
        </div>
    );
};

export default AuthorFormModal;
