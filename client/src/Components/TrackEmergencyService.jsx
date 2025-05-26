import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

// Initialize Socket.IO connection
const socket = io("http://localhost:5000");

function TrackEmergencyService() {
    const [userLocation, setUserLocation] = useState(null);
    const [providerLocation, setProviderLocation] = useState(null);
    const [routeDistance, setRouteDistance] = useState(null);
    const [providerInformation, SetproviderInformation] = useState(null);
    const [companyDetails, setCompanyDetails] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const userMarkerRef = useRef(null);
    const providerMarkerRef = useRef(null);
    const routingControlRef = useRef(null);
    const [isWorkDone, setIsWorkDone] = useState(false);
    const [company, setcompany] = useState(" ");
    const [user, setuser] = useState(" ");
    const navigate = useNavigate();

    const proceedPayment= () => {
        alert("Proceed to Payment")
        socket.emit("WorkDoneCharges",{user,company,status:"ProccedPayment"})
        navigate('/payment');
      };
    

    // Join the room and set up location tracking
    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("userId"));
        setuser(userId);
        const companyId = JSON.parse(localStorage.getItem("company"));
        setcompany(companyId);
        console.log("User and company data from localStorage:", { userId, companyId });
        
        if (!userId || !companyId) {
          console.error("User or company data is missing in localStorage.");
          return;
        }
        const fetchCompanyDetails = async () => {
            try {
              const response = await axios.get(`http://localhost:5000/api/paymentreciept/company/${companyId}`);
              console.log("Company Details",response.data);
           setCompanyDetails(response.data); // Assuming your API returns company details
         
            } catch (error) {
              console.error("Error fetching company details:", error);
            }
          };
         
      
          fetchCompanyDetails();
      
        socket.emit("joinRoom", { userId, companyId });
        console.log("room join");

        socket.on("providerTrackingInformation", (data) => {
            console.log(data);
            SetproviderInformation(data);
        });

        socket.on("WorkDone", () => {
            console.log("Work Done by provider side ");
            setIsWorkDone(true); // Show the payment button when work is done
        });



        // Watch user location
        const geoWatchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserLocation(location);
                console.log("updated location user",location);

                // Emit location to the server
                socket.emit("updateUserLocation", { userId, companyId, location, senderType: "user" });
                console.log("Updated location of user sent");
            },
            (error) => {
                console.error("Error getting user location:", error);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
        );

        // Listen for provider location updates from the server
        socket.on("locationUpdateProvider", ({ location,senderType }) => {
            // if(senderType=='provider')
            // {
    
            setProviderLocation(location);
            console.log(`Received location update from ${senderType}:`, location);}
        );

        // Clean up on component unmount
        return () => {
            navigator.geolocation.clearWatch(geoWatchId);
            socket.off("locationUpdateProvider");
            socket.off("WorkDone");
        };
    }, []);


    // Initialize map and update markers and routes
    useEffect(() => {
        if (!mapInstanceRef.current && mapRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);
        }

        // Google Maps Marker Image URL (Location Symbol)
        const googleMapsPinUrl = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

        // Define Google Maps Marker Icons for user and provider
        const userIcon = L.icon({
            iconUrl: googleMapsPinUrl,
            iconSize: [30, 30],  // size of the marker
            iconAnchor: [15, 30],  // point of the icon which will correspond to marker's location
            popupAnchor: [0, -30],  // point from which the popup should open relative to the icon
        });

        const providerIcon = L.icon({
            iconUrl: googleMapsPinUrl,  // Same symbol, you can use a different one for provider
            iconSize: [30, 30],  // size of the marker
            iconAnchor: [15, 30],  // point of the icon which will correspond to marker's location
            popupAnchor: [0, -30],  // point from which the popup should open relative to the icon
        });

        // Update user marker
        if (userLocation) {
            if (!userMarkerRef.current) {
                userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                    .addTo(mapInstanceRef.current)
                    .bindPopup("User Location")
                    .openPopup();
            } else {
                userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
            }
        }

        // Update provider marker
        if (providerLocation) {
            if (!providerMarkerRef.current) {
                providerMarkerRef.current = L.marker([providerLocation.lat, providerLocation.lng], { icon: providerIcon })
                    .addTo(mapInstanceRef.current)
                    .bindPopup("Provider Location")
                    .openPopup();
            } else {
                providerMarkerRef.current.setLatLng([providerLocation.lat, providerLocation.lng]);
            }
        }

        // Calculate and display route if both locations are available
        if (userLocation && providerLocation) {
            if (routingControlRef.current) {
                routingControlRef.current.remove();
            }

            if (
                userLocation.lat === providerLocation.lat &&
                userLocation.lng === providerLocation.lng
            ) {
                // Show a message if the locations are the same
                if (userMarkerRef.current) {
                    userMarkerRef.current.bindPopup("User and Provider are at the same location").openPopup();
                }
            } else {
                // Display route and calculate distance if locations differ
                routingControlRef.current = L.Routing.control({
                    waypoints: [
                        L.latLng(providerLocation.lat, providerLocation.lng),
                        L.latLng(userLocation.lat, userLocation.lng)
                    ],
                    routeWhileDragging: true,
                    showAlternatives: false,
                    lineOptions: {
                        styles: [{ color: 'blue', opacity: 0.6, weight: 4 }]
                    }
                })
                .on('routesfound', function (e) {
                    const route = e.routes[0];
                    const distance = (route.summary.totalDistance / 1000).toFixed(2);
                    setRouteDistance(distance);
                })
                .addTo(mapInstanceRef.current);
            }
        }

        return () => {
            if (routingControlRef.current) {
                routingControlRef.current.remove();
            }
        };
    }, [userLocation, providerLocation]);

    return (
        <div className="container mt-2">
            <div className="px-4 pt-3 my-3 text-center border-bottom border-black border-2">
                <h1 className="display-6 fw-bold text-body-emphasis">Your Emergency Service on the Move</h1>
            </div>

            <div ref={mapRef} style={{ height: '50vh', width: '100%' }} ></div>

            <div className="mt-4">
                <div className="card mb-2 border border-black border-2 p-3 bg-light">
                    <div className="card-body">
                        <p className="card-text d-flex border-black border-bottom ">
                            <h4 className="card-title fw-bold">
                                <em>Emergency Provided by </em>
                            </h4>
                            <h4 className="card-title fst-italic mx-2">
                            "{companyDetails ? companyDetails.companyname : "Loading..."}" </h4>
                        </p>
                        <p className=" d-flex  ">
                            <p className="card-title text-black">
                           <strong>    <em>Emergency Provider Id :</em></strong> 
                            </p>
                            <p className="card-title fst-italic mx-2">
                            "{companyDetails ? companyDetails.companyId : "Loading..."}" </p>
                        </p>
                        <p className=" d-flex ">
                            <p className="card-title text-black">
                            <strong>    <em>Location from</em></strong> 
                            </p>
                            <p className="card-title fst-italic mx-2">
                            "{companyDetails ? companyDetails.address : "Loading..."}" </p>
                        </p>
                    </div>
                </div>
            </div>
            {isWorkDone && (
                <button className="btn btn-primary btn-lg" onClick={proceedPayment}>
                    Proceed to Payment
                </button>
            )}
        </div>
    );
}

export default TrackEmergencyService;

