import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import EmergencyProviderNav from './EmergencyProviderNav';
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const socket = io("http://localhost:5000");

const EmergencyProvider = () => {
  const [accepted, setAccepted] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [receivedData, setReceivedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userPayment, setUserPayment] = useState(" ");
  const [companyPayment, setcompanyPayment] = useState(" ");
  const [providerLocation, setProviderLocation] = useState({
    // lat: 10.99835602,
    // lng: 77.01502627,
  });
  const [destinationLocation, setDestinationLocation] = useState({});
  const [companyDetails, setCompanyDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [workdonecharges, setworkdonecharges] = useState([]);
  const [servicecharge, setservicecharge] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

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

    const fetchCompanyDetails = async () => {
            try {
              const response = await axios.get(`http://localhost:5000/api/paymentreciept/company/${company}`);
              console.log("Company Details",response.data);
           setCompanyDetails(response.data); // Assuming your API returns company details
         
            } catch (error) {
              console.error("Error fetching company details:", error);
            }
          };
         
      
          fetchCompanyDetails();
      
       
   
    console.log("Socket connected:", socket.id);
    socket.emit("joinRoom", { userId: user, companyId: company });
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
              // lat: 26.507700,
              // lng: 80.303067,
            };
            setProviderLocation(newProviderLocation);
            console.log("Provider location updated:", newProviderLocation);
            socket.emit("updateProviderLocation", {
              userId: user, companyId: company,
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
    const locationInterval = setInterval(updateProviderLocation, 20000); // Update every 10 seconds

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
  console.log(companyDetails);


  useEffect(() => {
    axios.get(`http://localhost:5000/api/userInformation/user/${userPayment}`)
      .then((response) => {
        console.log("User Details",response.data);
           setUserDetails(response.data);
      })
      .catch((error) => console.error('Error fetching company data:', error));
  },[userPayment]);

   console.log("user details fetched properly" ,userDetails);

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

  useEffect(() => {
    // Listen for 'Status_Checked' event from the server
    socket.on('Payment_Proceed', (data) => {
      console.log("Received Data:", data);
      // Show alert message based on status
      if (data === "Done") {
      navigate('/ProviderWorkDone');
      } else  {
        alert("Sorry Not Available.");
      }
    });
  });

  const handleAccept = () => {
    setAccepted(true);
    socket.emit("ProviderTrackingInformation", { companyId });
    socket.emit("Send_Status", "accepted");
  };

  const handleReject = () => {
    setShowCard(false);
    socket.emit("Send_Status", "Sorry Not Available");
  };

  const handleWorkDone = () => {
    
    alert('Work has been marked as done.');
    setShowModal(true);
   
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProblems([]);
  };

  const handleAddProblem = () => {
    setworkdonecharges([...workdonecharges, '']);
    setservicecharge([...servicecharge, '']);
  };

  const handleProblemChange = (index, value, fieldType) => {
    if (fieldType === "workdonecharges") {
      const updatedProblems = workdonecharges.map((item, i) => (i === index ? value : item));
      setworkdonecharges(updatedProblems);
    } else if (fieldType === "servicecharge") {
      const updatedCharges = servicecharge.map((item, i) => (i === index ? value : item));
      setservicecharge(updatedCharges);
    }
  };

  const handleNavigate = () => {
   
           socket.emit("WorkDoneCharges", { userId:userPayment, companyId:companyPayment ,charges:workdonecharges,servicecharges:servicecharge});
            setworkdonecharges([]); // Clear the problems after submission
            setservicecharge([]);
            socket.emit("workDone",  { userId:userPayment, companyId:companyPayment });
            navigate('/ProviderProcessCompleted'); // Navigate to the confirmation or next screen
         
  };

  return (
    <div>
      <EmergencyProviderNav />
      <h1 class="p-3 container fst-italic ">Welcome  {companyDetails ? companyDetails.companyname : "Loading..."} !!</h1>
      <div className="d-flex flex-column ">
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
                <p className="card-text d-flex border-black border-bottom ">
                            <h4 className="card-title fw-bold">
                                <em>Emergency from </em>
                            </h4>
                            <h4 className="card-title fst-italic mx-2">
                            "{userDetails ? userDetails.address : "Loading..."}" </h4>
                        </p>
                        <p className=" d-flex  ">
                            <p className="text-black">
                               <strong> <em>Username :</em></strong>
                            </p>
                            <p className=" fst-italic mx-2">
                            "{userDetails ? userDetails.fullname : "Loading..."}" </p>
                        </p>
                        <p className=" d-flex  ">
                            <p className=" text-black">
                               <strong> <em>Problems :</em></strong>
                            </p>
                            <p className=" fst-italic mx-2">
                          "{receivedData.message}" </p>
                        </p>
                  
                </p>

                {!accepted ? (
                  <div className="d-flex">
                    <button className="btn btn-success me-2 border border-black" onClick={handleAccept}>Accept</button>
                    <button className="btn btn-danger border border-black" onClick={handleReject}>Reject</button>
                  </div>
                ) : (
                  <button className="btn btn-success w-100 mt-3" onClick={handleWorkDone}>Work Done</button>
                )}

{showModal && (
          <div className="modal fade show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="modal-content border border-black border-3">
                <div className="modal-header border-bottom border-black border-2">
                  <h5 className="modal-title border-bottom border-1 border-black fw-bold"><em>Any Extra Service/Charge</em></h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body border-bottom border-black border-2">
                  {workdonecharges.map((workdonecharges, index) => (
  <div className="mb-3 d-flex" key={index}>
    <input
      type="text"
      className="form-control border border-black border-1"
      value={workdonecharges}
      onChange={(e) => handleProblemChange(index, e.target.value, "workdonecharges")}
      placeholder="Enter service/charge description"
    />
    <input
      type="number"
      min="1"
      step="any"
      className="form-control border border-black border-1 ms-2"
      value={servicecharge[index] || ""}
      onChange={(e) => handleProblemChange(index, e.target.value, "servicecharge")}
      placeholder="00 Rs."
    />
  </div>
))}
                 <form>
                 <div class="form-group mb-2 d-flex">
                   <div className='mx-2'>
                     <label for="exampleFormControlFile1 mx-2 fw-bold text-black">Add Proof:</label></div>
                     <input type="file" class="form-control-file" id="exampleFormControlFile1"/>
                   </div>
                 </form>
                  <button type="button" className="btn btn-secondary" onClick={handleAddProblem}>+ Add Service Charge with Description</button>
                </div>
                <div className="modal-footer d-flex justify-content-between border-top border-black border-2">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleNavigate}>Submit</button>
                </div>
              </div>
            </div>
          </div>
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
