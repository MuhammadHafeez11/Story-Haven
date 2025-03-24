import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './ManageUser.css';
import toast from 'react-hot-toast';
import { FaTrash, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import axiosInstance from '../../axios/axiosInstance';
import CustomTable from '../../components/customComponents/customTable';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const userID = localStorage.getItem('userID')

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axiosInstance.get('/user');
                const users = response.data.filter(user=> user._id !== userID);
                
                setUsers(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const handlePromote = async (userId) => {
        try {
            await axiosInstance.put(`/user/promote/${userId}`, {});
            setUsers(users.map(user => user._id === userId ? { ...user, isAdmin: true } : user));
            toast.success("User Promoted to Admin");
        } catch (error) {
            toast.error('Error promoting user');
        }
    };

    const handleDemote = async (userId) => {
        try {
            await axiosInstance.put(`/user/demote/${userId}`, {});
            setUsers(users.map(user => user._id === userId ? { ...user, isAdmin: false } : user));
            toast.success("Admin demoted to User");
        } catch (error) {
            toast.error('Error demoting user');
        }
    };

    const handleDelete = async (userId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/user/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
                Swal.fire("Deleted!", "User has been deleted.", "success");
            } catch (error) {
                Swal.fire("Error!", "Failed to delete the user.", "error");
            }
        }
    };

    const columns = [
        { header: 'Username', accessorKey: 'username' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Admin',
            accessorKey: 'isAdmin',
            cell: info => (info.getValue() ? 'Yes' : 'No'),
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: ({ row }) => (
                <div className="manageuser-actions">
                    {!row.original.isAdmin && (
                        <button
                            onClick={() => handlePromote(row.original._id)}
                            className="manageuser-promote-button"
                        >
                            <FaUserPlus title="Promote to Admin" />
                        </button>
                    )}
                    {row.original.isAdmin && (
                        <button
                            onClick={() => handleDemote(row.original._id)}
                            className="manageuser-demote-button"
                        >
                            <FaUserMinus title="Demote from Admin" />
                        </button>
                    )}
                    <button
                        onClick={() => handleDelete(row.original._id)}
                        className="manageuser-delete-button"
                    >
                        <FaTrash title="Delete User" />
                    </button>
                </div>
            )
        }
    ];

    if (loading) return <p className="loading-spinner">Loading users...</p>;

    return (
        <div className="manage-users-container">
            <h1 className="manage-users-title">Manage Users</h1>
            <CustomTable columns={columns} data={users} />
        </div>
    );
};

export default ManageUsers;
