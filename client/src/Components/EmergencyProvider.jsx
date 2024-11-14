import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import EmergencyProviderNav from './EmergencyProviderNav';
import { useLocation } from "react-router-dom";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const socket = io("http://localhost:5000");

const EmergencyProvider = () => {
  const [accepted, setAccepted] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [receivedData, setReceivedData] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [userPayment, setUserPayment] = useState(" ");
  const [companyPayment, setcompanyPayment] = useState(" ");
  const [providerLocation, setProviderLocation] = useState({
    lat: 10.99835602,
    lng: 77.01502627,
  });
  const [destinationLocation, setDestinationLocation] = useState();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const location = useLocation();
  const { companyId } = location.state || {};
 
    
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userId"));
    setUserPayment(user);
    const company = JSON.parse(localStorage.getItem("company"));
    setcompanyPayment(company);
    console.log("User and company data from localStorage:", { user, company });
    
    if (!user || !company) {
      console.error("User or company data is missing in localStorage.");
      return;
    }
    console.log("Socket connected:", socket.id);
    socket.emit("joinRoom", { userId: user, companyId:company });
     console.log("room join");

    socket.on("roomJoined", (data) => {
      console.log("Room Joined:", data);
    });

    socket.on("recieved_user_problems", (data) => {
      console.log("Data received from server:", data); // Check data structure
      // if (data.message) {
      console.log(data);
        setReceivedData(data);
      // } else {
      //   console.warn("Invalid data received from server:", data);
      // }

      if (data.location && data.location.latitude !== undefined && data.location.longitude !== undefined) {
        setDestinationLocation({
          lat: data.location.latitude,
          lng: data.location.longitude
        });
      }
    });

    const updateProviderLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newProviderLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setProviderLocation(newProviderLocation);
            console.log("Provider location updated:", newProviderLocation);
            socket.emit("updateLocation", {
              location: newProviderLocation,
              senderType: "provider",
            });
          },
          (error) => {
            console.log("Error getting provider's location:", error);
          }
        );
      }
    };

    updateProviderLocation();
    const locationInterval = setInterval(updateProviderLocation, 10000); // Update every 10 seconds

    socket.on("locationUpdateUser", ({ location, senderType }) => {
      if (senderType === "user") {
        setDestinationLocation(location);
        console.log(`Received location update from ${senderType}:`, location);
      }
    });

    return () => {
      socket.off("recieved_user_problems");
      socket.off("roomJoined");
      socket.off("locationUpdateUser");
      clearInterval(locationInterval);
    };
  }, [companyId]);

  useEffect(() => {
    if (accepted && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([providerLocation.lat, providerLocation.lng], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const providerIcon = L.icon({
        iconUrl: 'path/to/provider-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
      });

      const destinationIcon = L.icon({
        iconUrl: 'path/to/destination-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
      });

      L.marker([providerLocation.lat, providerLocation.lng], { icon: providerIcon })
        .addTo(map)
        .bindTooltip("Provider Location", { permanent: true, direction: "right", offset: [10, 0] });

      if (destinationLocation) {
        const isSameLocation =
          providerLocation.lat === destinationLocation.lat &&
          providerLocation.lng === destinationLocation.lng;

        if (isSameLocation) {
          L.marker([destinationLocation.lat, destinationLocation.lng], { icon: destinationIcon })
            .addTo(map)
            .bindTooltip("Destination (Same as Provider)", { permanent: true, direction: "right", offset: [10, 0] });
        } else {
          L.marker([destinationLocation.lat, destinationLocation.lng], { icon: destinationIcon })
            .addTo(map)
            .bindTooltip("Destination Location", { permanent: true, direction: "right", offset: [10, 0] });

          L.Routing.control({
            waypoints: [
              L.latLng(providerLocation.lat, providerLocation.lng),
              L.latLng(destinationLocation.lat, destinationLocation.lng)
            ]
          }).addTo(map);
        }
      }
    }
  }, [accepted, providerLocation, destinationLocation]);

  const handleAccept = () => {
    setAccepted(true);
    socket.emit("ProviderTrackingInformation",{companyId});
    socket.emit("Send_Status", "accepted");
  };

  const handleReject = () => {
    setShowCard(false);
    socket.emit("Send_Status", "Sorry Not Available");
  };

  const handleWorkDone = () => {
    alert('Work has been marked as done.');
    socket.emit("workDone", { userPayment, companyPayment });
  };

  return (
    <div>
      <EmergencyProviderNav />
      <div className="d-flex flex-column mt-4">
        {accepted && (
          <div className="container flex-grow-1" style={{ flexBasis: "75%" }}>
            <div id="map" ref={mapRef} style={{ width: '100%', height: '50vh', overflow: 'auto' }}></div>
          </div>
        )}

        {showCard && receivedData && (
          <div className="container mt-4">
            <div className="card mb-4 border border-black border-2 p-3 bg-light">
              <div className="card-body">
            
                <p className="card-text">
                <h4 className="card-title fw-bold">
                    <em>Emergency from {receivedData.userId}</em>
                  </h4>
                  <strong><em>Problem:</em></strong> {receivedData.message}
                </p>

                {!accepted ? (
                  <div className="d-flex">
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

