import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';




function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { person } = location.person || {};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    navigate('/forgot-password');
  };

  const bgStyle = {
    backgroundImage: "url('https://i.postimg.cc/XqgdLnDN/img.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
     
    try {
      const response=await axios.post("http://localhost:5000/api/auth/login",{
      email,
      password,
      });
      if(response.status==200)
      {
        const {fullname,profileType}=response.data;
        setEmail(" ");
        setPassword(" ");
<<<<<<< HEAD
        alert(' signed in successfully!');
        // if(person==User)
        // navigate('/home', { state: { fullname } });
        // else
        // navigate('/emergencyProvider', { state: { fullname } });
        if (profileType === "user") {
          navigate('/home', { state: { fullname } });
        } else if (profileType === "emergency") {
          navigate('/emergencyProvider', { state: { fullname } });
        } else {
          alert("Invalid profile type. Please try again.");
=======
        alert('Login successfull!');
        
        if (profileType === 'user') {
          navigate('/home', { state: { fullname } });
        } else if (profileType === 'emergency') {
          navigate('/emergencyprovider');
>>>>>>> a5c6ba9558f740fcfd0ec689c0d39431348344f3
        }
      }
    }
    catch(error) {
      console.error('Sign in error:', error.response?.data || error.message); // Log the error response
      alert(error.response?.data?.error || 'Please try again.');
    }
  };
  

  return (
    <div className="App1" style={bgStyle}>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="form-container bg-light p-4 rounded shadow" style={{ maxWidth: '400px', opacity: '0.9' }}>
          <div className="form-header text-center mb-4">
            <h2>Welcome to Emergengy-dial</h2>
            <p>Sign in to Continue</p>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye} 
                className="position-absolute password-toggle-icon" 
                style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} 
                onClick={togglePasswordVisibility} 
              />
            </div>
            <div className="form-footer d-flex justify-content-between align-items-center mb-3">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className="btn btn-link p-0" onClick={handleForgotPassword}>Forgot Password?</button>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
          </form>
          <div className="switch-form text-center">
            <p>Don't have an account? <button onClick={() => navigate('/signup')} className="btn btn-link p-0">Signup</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
