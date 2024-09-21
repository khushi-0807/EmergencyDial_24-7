import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import {io} from "socket.io-client";
import EmergencyProviderNav from './EmergencyProviderNav';
const AnyReactComponent = ({ text }) => <div>{text}</div>;
var socket = io("http://localhost:5000");

const EmergencyProvider = () => {
  const [accepted, setAccepted] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [emergencyData, setEmergencyData] = useState(null);
  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   const newSocket = new WebSocket("ws://localhost:5000");

  //   newSocket.onopen = () => {
  //     console.log("WebSocket connected");
  //   };

  //   newSocket.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       console.log("Message from server:", data.message);
  //       setEmergencyData(data); // Update emergency data as needed
  //     } catch (err) {
  //       console.error("Error parsing message:", err);
  //       console.log("Message from server:", event.data);
  //     }
  //   };

  //   newSocket.onclose = () => {
  //     console.log("WebSocket closed");
  //   };

  //   newSocket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   setSocket(newSocket);

  //   return () => {
  //     if (newSocket) newSocket.close();
  //   };
  // }, []);

  const [showNotification, setShowNotification] = useState(false);
  const [receivedData, setReceivedData] = useState('');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    socket.on('recieved_user_problems', (data) => {
      console.log(data);
      setReceivedData(data);
      setShowNotification(true);
      setAlerts((prevAlerts) => [...prevAlerts, data]);
      
    });

    return () => {
      socket.off('recieved_user_problems',);
    };
  }, []);
    
  const handleViewAlert = () => {
    // Reset notification after viewing
    setShowNotification(false);
  };
  
  // socket.emit("hii", (arg) => {
  //   console.log("message", arg);
  // });
  // socket.on("hello ", "Myself emergency provider , how can i assist you server!!");

  const handleAccept = () => {
    setAccepted(true);
    socket.emit("Send_Status","accepted");
  };

  const handleReject = () => {
    setShowCard(false);
    socket.emit("Send_Status","Sorry Not Available");
  };

  const handleWorkDone = () => {
    alert('Work has been marked as done.');
  };

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div>
      <EmergencyProviderNav/>
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

      {showCard && receivedData && (
        <div className="container mt-3 ">
          <div className="card mb-4 border border-black border-2 p-3 bg-light">
            <div className="card-body">
              {!accepted && <h4 className="card-title fw-bold"><em>Emergency from {receivedData.user}</em></h4>}
              <div className="row">
                <div className="col-md-6">
                  <p className="card-text m-2"><strong><em>Problem:</em></strong> {receivedData.message}</p>
                  {/* <p className="card-text"><strong>Location:</strong> {receivedData.location}</p> */}
                </div>
              </div>

              {!accepted ? (
                <div className="d-flex m-2">
                  <button className="btn btn-success me-2 border border-black" onClick={handleAccept}>Accept</button>
                  <button className="btn btn-danger border border-black" onClick={handleReject}>Reject</button>
                </div>
              ) : (
                <button className="btn btn-success w-100 mt-3" onClick={handleWorkDone}>Work Done</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>

  

  );
};

export default EmergencyProvider;
