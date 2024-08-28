import React from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const handleSignupAsUser = () => {
    // Close the modal
    const modal = document.getElementById('signupModal');
    const modalInstance = window.bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    // Navigate to SignupUser component
    navigate('/signupuser');
  };

  const handleSignupAsEmergency = () => {
    // Close the modal
    const modal = document.getElementById('signupModal');
    const modalInstance = window.bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    // Navigate to SignupEmergency component
    navigate('/signupemergency');
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
        <div className="form-container bg-light p-4 rounded shadow" style={{ maxWidth: '400px', opacity: '0.9' }}>
          <div className="form-header text-center mb-4">
            <h2>Welcome to Emergency-dial</h2>
            <p>Signup to Continue</p>
          </div>
          <button type="button" className="btn btn-primary w-100 mb-3" data-bs-toggle="modal" data-bs-target="#signupModal">
            View Signup Options
          </button>
          <div className="switch-form text-center">
            <p>Already have an account? <button onClick={() => navigate('/login')} className="btn btn-link p-0">Login</button></p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="signupModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="signupModalLabel">Signup Options</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary w-100 mb-3" onClick={handleSignupAsUser}>
                Signup as User
              </button>
              <button type="button" className="btn btn-secondary w-100 mb-3" onClick={handleSignupAsEmergency}>
                Signup as Emergency Provider
              </button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
