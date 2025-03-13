import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { loginUser } from "../api/userApi"; 
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userAction";
import { toast } from "react-hot-toast";
import "../styles/componentsStyles/Login.css"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading, isAuthenticated, user } = useSelector(state=> state.user);

  const handleLogin = async (e) => {
    e.preventDefault();

    // try {
      // const response = await loginUser(username, password);
      dispatch(login(username, password));
      if(isAuthenticated){
        localStorage.setItem("userID", user._id);
        localStorage.setItem("userName", user.username);
        // Check if the user is admin
        if (user.isAdmin) {
          localStorage.setItem("role", "admin");
          // console.log(user.isAdmin);
          navigate("/admin/dashboard");
        }
         else {
          localStorage.setItem("role", "user");
          navigate("/user-dashboard");
        }
        toast.success("Login successful!");
      }

  //     if (response.message === "Login successful") {
  //       const userId = response.user._id;
  //       const userName = response.user.username;
  //       const token = response.token;

  //       localStorage.setItem("userID", userId);
  //       localStorage.setItem("userName", userName);

  //       // Check if the user is admin
  //       if (response.user.isAdmin) {
  //         localStorage.setItem("role", "admin");
  //         navigate("/admin/dashboard");
  //       } else {
  //         localStorage.setItem("role", "user");
  //         navigate("/user-dashboard");
  //       }

  //       toast.success("Login successful!");
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "Invalid Credentials. Please try again.");
  //   }
  };

  useEffect(()=>{
    if(error){
      toast.error(error);
    }
  }, [error])

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Sign in to continue to StoryHaven</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>
        <p className="signup-prompt">
          Don't have an account?{" "}
          <Link to='/signup' className="signup-text">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
