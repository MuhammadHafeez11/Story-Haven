import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login, clearErrors } from "../../actions/userAction" // Import clearErrors action
import { toast } from "react-hot-toast"
import "./Login.css"
import { FaUser, FaLock, FaArrowLeft, FaExclamationCircle } from "react-icons/fa"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { error, loading, isAuthenticated, user } = useSelector((state) => state.user)

  const handleLogin = async (e) => {
    e.preventDefault()
    setFormError("") // Clear any previous form errors
    setIsLoading(true)

    dispatch(login(username, password))
  }

  // Clear errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearErrors())

    // Cleanup function to clear errors when component unmounts
    return () => {
      dispatch(clearErrors())
    }
  }, [dispatch])

  useEffect(() => {
    if (error) {
      setFormError(error)
      setIsLoading(false)
    }

    if (isAuthenticated && user) {
      localStorage.setItem("userID", user._id)
      localStorage.setItem("userName", user.username)

      // Check if the user is admin
      if (user.isAdmin) {
        localStorage.setItem("role", "admin")
        navigate("/admin/dashboard")
      } else {
        localStorage.setItem("role", "user")
        navigate("/user-dashboard")
      }

      toast.success("Welcome back to StoryHaven!")
      setIsLoading(false)
    }
  }, [error, isAuthenticated, user, navigate])

  return (
    <div className="login-page-container">
      <Link to="/" className="back-to-home">
        <FaArrowLeft /> Back to Home
      </Link>

      {/* Decorative book elements */}
      <div className="book-decoration book-top-left"></div>
      <div className="book-decoration book-bottom-right"></div>

      <div className="login-card">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Sign in to continue to StoryHaven</p>

        {formError && (
          <div className="form-error-message">
            <FaExclamationCircle /> {formError}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <FaUser className="input-icon" /> Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`form-input ${formError && formError.toLowerCase().includes("username") ? "input-error" : ""}`}
              required
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FaLock className="input-icon" /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${formError && formError.toLowerCase().includes("password") ? "input-error" : ""}`}
              required
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="signup-prompt">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-text">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

