import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
// import { signup } from '../api/userApi'; 
import { register } from '../actions/userAction';
import { useDispatch, useSelector} from 'react-redux'
import '../styles/componentsStyles/SignUp.css'; // Import the CSS file for Signup component

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setName] = useState('');
  const [emailError, setEmailError] = useState('');  // State to hold email error message
  const [usernameError, setUsernameError] = useState('');  // State to hold username error message
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading, isAuthenticated, user } = useSelector(state=>state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error messages
    setEmailError('');
    setUsernameError('');

    const data = {
      username,
      email,
      password,
    };
    dispatch(register(data));

    if (isAuthenticated){
      // const userName = user.username;
      localStorage.setItem('userID', user._id);
            localStorage.setItem('userName', user.username);
            localStorage.setItem("role", "user");
            navigate('/book');
    }
    // try {
      // const response = await signup({
      //   username,
      //   email,
      //   password,
      // });

  //     if (response.message === "Signup successful") {
  //       // console.log(response.message);
  //       const id = response.result._id;
  //       const userName = response.result.username;
  //       localStorage.setItem('userID', id);
  //       localStorage.setItem('userName', userName);
  //       localStorage.setItem("role", "user");
  //       navigate('/book');
  //     }
  //   } catch (error) {
  //     const errorMessage = error.message;
  //     console.log(errorMessage);
      
  //     if (errorMessage === 'Username already exists.') {
  //       setUsernameError('Username already exists');
  //     } else if (errorMessage === 'Email already exists.') {
  //       setEmailError('Email already exists');
  //     } else {
  //       toast.error('Signup failed');
  //     }
  //   }
  };

  useEffect(()=>{
    if (error){
      toast.error(error);
    }
    // if (isAuthenticated){
    //   console.log(user);
    //   navigate('/book');
    // }
  },[error])

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            {usernameError && <div className="error-message">{usernameError}</div>} 
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            {emailError && <div className="error-message">{emailError}</div>} 
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
