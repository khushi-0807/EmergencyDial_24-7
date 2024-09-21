import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchAddress from './SearchAddress';

function SignupEmergency() {
  const [occupation, setOccupation] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [featuresProvided, setFeaturesProvided] = useState(['']);
  const [photo, setPhoto] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [coordinates,setCoordinates]=useState({});

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFeatureChange = (index, event) => {
    const newFeatures = [...featuresProvided];
    newFeatures[index] = event.target.value;
    setFeaturesProvided(newFeatures);
  };

  const addFeature = () => {
    setFeaturesProvided([...featuresProvided, '']);
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };
  console.log(coordinates);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!coordinates.lat || !coordinates.lng) {
      alert('Please select a valid address');
      return;
    }
    // Handle form submission logic
    const { lat: latitude, lng: longitude } = coordinates;
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signupemergency",
        {
        occupation,
        fullName,
        companyName,
        email,
        address,
        phoneNo,
        featuresProvided,
        photo,
        latitude,
        longitude,
        password,
        confirmPassword,

      });
      if(response.status===201)
      {
        setOccupation('');
        setFullName('');
        setCompanyName('');
        setEmail('');
        setAddress('')
        setPhoneNo('');
        setFeaturesProvided('');
        setPhoto(null);
        setPassword('');
        setConfirmPassword('');
        alert('emergency signed up successfully!');
        navigate('/login');
      }
      
    }catch (error) {
      console.error('Emergency Sign up error:', error.response?.data || error.message); // Log the error response
      alert(error.response?.data?.error || 'Failed to Emergency sign up. Please try again.');
    }
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

  return (
    <div className="App1" style={bgStyle}>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="form-container bg-light p-4 rounded shadow" style={{ maxWidth: '400px', maxHeight: '90vh', opacity: '0.9', overflowY: 'auto' }}>
          <div className="form-header text-center mb-4">
            <h2>Welcome to Emergency-dial</h2>
            <p>Signup to Continue</p>
          </div>
          <form className="form" >
            <div className="form-group mb-3">
              <select
                className="form-control"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                required
              >
                <option value="" disabled>Select Your Occupation</option>
                <option value="mechanic">Mechanic</option>
                <option value="hospitality">Hospitality</option>
                <option value="fire brigade">Fire Brigade</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
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
            <div className="form-group mb-3">
              <SearchAddress
                type="text"
                className="form-control"
                placeholder="Occupation Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                setCoordinates={setCoordinates}
                setAddress={setAddress}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Phone No"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Features Provided</label>
              {featuresProvided.map((feature, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e)}
                    required
                  />
                  {index === featuresProvided.length - 1 && (
                    <div className="input-group-append">
                      <button type="button" className="btn btn-outline-secondary" onClick={addFeature}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="form-group mb-3">
              <label>Upload Photo</label>
              <input
                type="file"
                className="form-control-file"
                onChange={handlePhotoChange}
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
            <div className="form-group mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye} 
                className="position-absolute password-toggle-icon" 
                style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} 
                onClick={togglePasswordVisibility} 
              />
            </div>
            <p>By pressing "Signup" you agree to our Terms & Conditions</p>
            <button type="submit" className="btn btn-primary w-100 mb-3 " onClick={handleSubmit}>Signup</button>
          </form>
          <div className="switch-form text-center">
            <p>Already have an account? <button onClick={() => navigate('/login')} className="btn btn-link p-0">Login</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupEmergency;
