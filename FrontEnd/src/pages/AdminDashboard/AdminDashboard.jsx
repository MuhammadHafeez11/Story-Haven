import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaBook, FaUser, FaDollarSign, FaClipboardList, FaUserFriends } from "react-icons/fa"
import { MdCategory, MdDashboard } from "react-icons/md"
import "./AdminDashboard.css"
import toast from "react-hot-toast"
import axiosInstance from "../../axios/axiosInstance"

const AdminDashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [newUsersCount, setNewUsersCount] = useState(0)
  const [booksPurchasedCount, setBooksPurchasedCount] = useState(0)
  const [userRole, setUserRole] = useState("")
  const userId = localStorage.getItem("userID")

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axiosInstance.get("/adminData/revenue")
        setTotalRevenue(response?.data?.totalRevenue)
      } catch (error) {
        toast.error(error.response.data.message)
        console.error("Error fetching total revenue:", error)
      }
    }

    const fetchNewUsersCount = async () => {
      try {
        const response = await axiosInstance.get("/adminData/newUser")
        setNewUsersCount(response.data.newUsersCount)
      } catch (error) {
        console.error("Error fetching new users count:", error)
      }
    }

    const fetchBooksPurchasedData = async () => {
      try {
        const response = await axiosInstance.get("/adminData/purchased")
        setBooksPurchasedCount(response.data.booksPurchasedCount)
      } catch (error) {
        console.error("Error fetching books purchased data:", error)
      }
    }

    const getUserRoleById = async () => {
      try {
        const response = await axiosInstance.get(`/user/${userId}`)
        setUserRole(response?.data?.data?.role?.name)
      } catch (error) {
        console.log(error)
      }
    }

    fetchTotalRevenue()
    fetchNewUsersCount()
    fetchBooksPurchasedData()
    getUserRoleById()
  }, [])

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-content">
        <h1 className="admin-dashboard-title">
          <MdDashboard style={{ marginRight: "10px", verticalAlign: "middle" }} />
          Admin Dashboard
        </h1>

        <div className="admin-stats-section">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-info">
              <p className="stat-number">${totalRevenue}</p>
              <p className="stat-label">Total Revenue</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaUser />
            </div>
            <div className="stat-info">
              <p className="stat-number">{newUsersCount}</p>
              <p className="stat-label">New Users Today</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaBook />
            </div>
            <div className="stat-info">
              <p className="stat-number">{booksPurchasedCount}</p>
              <p className="stat-label">Books Purchased</p>
            </div>
          </div>
        </div>

        <div className="admin-options-section">
          <Link to="/admin/books" className="admin-option-link" style={{ "--animation-order": 1 }}>
            <div className="admin-option-card">
              <div className="admin-option-icon">
                <FaBook />
              </div>
              <p className="admin-option-label">Manage Books</p>
            </div>
          </Link>

          <Link to="/admin/users" className="admin-option-link" style={{ "--animation-order": 2 }}>
            <div className="admin-option-card">
              <div className="admin-option-icon">
                <FaUserFriends />
              </div>
              <p className="admin-option-label">Manage Users</p>
            </div>
          </Link>

          <Link to="/admin/categories" className="admin-option-link" style={{ "--animation-order": 3 }}>
            <div className="admin-option-card">
              <div className="admin-option-icon">
                <MdCategory />
              </div>
              <p className="admin-option-label">Manage Categories</p>
            </div>
          </Link>

          <Link to="/admin/authors" className="admin-option-link" style={{ "--animation-order": 4 }}>
            <div className="admin-option-card">
              <div className="admin-option-icon">
                <FaUser />
              </div>
              <p className="admin-option-label">Manage Authors</p>
            </div>
          </Link>

          <Link to="/admin/purchase-requests" className="admin-option-link" style={{ "--animation-order": 5 }}>
            <div className="admin-option-card">
              <div className="admin-option-icon">
                <FaClipboardList />
              </div>
              <p className="admin-option-label">Purchase Requests</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard