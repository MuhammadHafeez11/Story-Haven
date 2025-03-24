import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { register, clearErrors } from "../../actions/userAction" // Import clearErrors action
import { useDispatch, useSelector } from "react-redux"
import "./SignUp.css"
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle, FaCheck, FaArrowLeft } from "react-icons/fa"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setName] = useState("")
  const [emailError, setEmailError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [formError, setFormError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { error, loading, isAuthenticated, user } = useSelector((state) => state.user)

  // Clear errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearErrors())

    // Cleanup function to clear errors when component unmounts
    return () => {
      dispatch(clearErrors())
    }
  }, [dispatch])

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("")
      return
    }

    const hasLowerCase = /[a-z]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    const strength =
      (hasLowerCase ? 1 : 0) +
      (hasUpperCase ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecialChar ? 1 : 0) +
      (isLongEnough ? 1 : 0)

    if (strength <= 2) return "weak"
    if (strength <= 4) return "medium"
    return "strong"
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrength(checkPasswordStrength(newPassword))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset error messages
    setEmailError("")
    setUsernameError("")
    setFormError("")
    setIsLoading(true)

    const data = {
      username,
      email,
      password,
    }

    dispatch(register(data))
  }

  useEffect(() => {
    if (error) {
      if (error.includes("Username")) {
        setUsernameError(error)
      } else if (error.includes("Email")) {
        setEmailError(error)
      } else {
        setFormError(error)
      }
      setIsLoading(false)
    }

    if (isAuthenticated && user) {
      localStorage.setItem("userID", user._id)
      localStorage.setItem("userName", user.username)
      localStorage.setItem("role", "user")

      toast.success("Account created successfully! Welcome to StoryHaven.")
      navigate("/book")
      setIsLoading(false)
    }
  }, [error, isAuthenticated, user, navigate])

  return (
    <div className="signup-container">
      <Link to="/" className="back-to-home">
        <FaArrowLeft /> Back to Home
      </Link>

      {/* Decorative book elements */}
      <div className="book-decoration book-top-right"></div>
      <div className="book-decoration book-bottom-left"></div>

      <div className="signup-card">
        <h2>Join StoryHaven</h2>

        {formError && (
          <div className="form-error-message">
            <FaExclamationCircle /> {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="input-icon" /> Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className={usernameError ? "input-error" : ""}
              required
              placeholder="Choose a username"
              disabled={isLoading}
            />
            {usernameError && (
              <div className="error-message">
                <FaExclamationCircle /> {usernameError}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" /> Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? "input-error" : ""}
              required
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {emailError && (
              <div className="error-message">
                <FaExclamationCircle /> {emailError}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              placeholder="Create a secure password"
              disabled={isLoading}
            />

            {password && (
              <>
                <div className="password-strength">
                  <div className={`password-strength-bar strength-${passwordStrength}`}></div>
                </div>
                <div className="password-strength-text">
                  {passwordStrength === "weak" && "Weak password"}
                  {passwordStrength === "medium" && "Medium strength"}
                  {passwordStrength === "strong" && (
                    <span style={{ color: "#10b981" }}>
                      <FaCheck /> Strong password
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <button type="submit" className={`signup-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <Link to="/login" className="login-link">
          Already have an account? <span className="login-text">Sign In</span>
        </Link>
      </div>
    </div>
  )
}

export default Signup