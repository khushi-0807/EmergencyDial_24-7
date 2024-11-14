import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io("http://localhost:5000");

function UserRequested() {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for 'Status_Checked' event from the server
    socket.on('Status_Checked', (data) => {
      console.log("Received Data:", data);
      setStatus(data);

      // Show alert message based on status
      if (data === "accepted") {
        alert("Your request has been accepted!");
      } else if (data === "Sorry Not Available") {
        alert("Sorry Not Available.");
      }
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off('Status_Checked');
    };
  }, []);

  // Handle button click based on status
  const handleButtonClick = () => {
    if (status === "accepted") {
      navigate('/TrackEmergencyService'); // Replace with the actual route to track service
    } else if (status === "Sorry Not Available") {
      navigate('/home'); // Replace with the route to home component
    } else {
      // Implement withdraw request logic here if needed
      console.log("Withdraw request initiated.");
    }
  };

  return (
    <div className="container my-5 border border-black rounded-3">
      <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
        <div className="px-4 pt-5 my-5 text-center">
          <div className="overflow-hidden" style={{ maxHeight: "30vh" }}>
            <div className="container px-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" className="bi bi-radar" viewBox="0 0 16 16">
                <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"/>
              </svg>
            </div>
          </div>
          <h1 className="display-4 fw-bold text-body-emphasis">
            {status ? (status === "accepted" ? "Request Accepted" : "Sorry Not Available") : "Processing Request..."}
          </h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">
              Thank you for your patience! Your request is currently being reviewed, and we appreciate your understanding as we process it.
              Please hold on for a moment until it is accepted. We’re doing our best to handle everything as quickly as possible, and we’ll
              notify you as soon as it’s completed.
            </p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
              <button
                type="button"
                className="btn btn-primary btn-lg px-4 me-sm-3"
                onClick={handleButtonClick}
              >
                {status === "accepted" ? "Track Your Emergency Service" : status === "Sorry Not Available" ? "Go Back" : "Withdraw Request?"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRequested;