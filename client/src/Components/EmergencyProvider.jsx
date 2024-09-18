import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const EmergencyProvider = () => {
  const [accepted, setAccepted] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [emergencyData, setEmergencyData] = useState(null);
  const [socket, setSocket] = useState(null); // State to store WebSocket instance

  // WebSocket setup
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:5000");

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setSocket(newSocket); // Store the WebSocket instance
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data.message);
      } catch (err) {
        console.log("Message from server:", event.data);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  const handleAccept = () => {
    setAccepted(true);
  };

  const handleReject = () => {
    setShowCard(false);
  };

  const handleWorkDone = () => {
    alert('Work has been marked as done.');
  };

  const handleBookClick = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const userInput = {
        user: "User1",
        problem: "Some problem",
        location: "Some location",
      };

      // Send the user input to the WebSocket server
      socket.send(JSON.stringify(userInput));
      console.log("Sent data to server:", userInput);
    } else {
      console.log("WebSocket is not open or connected.");
    }
  };

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      {accepted && (
        <div className="flex-grow-1" style={{ flexBasis: "75%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "" }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
          </GoogleMapReact>
        </div>
      )}

      {showCard && emergencyData && (
        <div className="container mt-3">
          <div className="card mb-4">
            <div className="card-body">
              {!accepted && <h5 className="card-title">Emergency from {emergencyData.user}</h5>}
              <div className="row">
                <div className="col-md-6">
                  <p className="card-text"><strong>Problem:</strong> {emergencyData.problem}</p>
                  <p className="card-text"><strong>Location:</strong> {emergencyData.location}</p>
                </div>
              </div>

              {!accepted ? (
                <div className="d-flex">
                  <button className="btn btn-success me-2" onClick={handleAccept}>Accept</button>
                  <button className="btn btn-danger" onClick={handleReject}>Reject</button>
                </div>
              ) : (
                <button className="btn btn-success w-100 mt-3" onClick={handleWorkDone}>Work Done</button>
              )}
              <button className="btn btn-primary mt-3" onClick={handleBookClick}>Book</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyProvider;
