import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import HomeFirstNav from './HomeFirstNav';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import {io} from "socket.io-client";
var socket = io("http://localhost:5000");

const CompanyList = () => {
  const { occupation } = useParams();  // Capture occupation from the route params
 
  const [companyData, setCompanyData] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [problems, setProblems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const[Socket,setSocket]=useState(false);
  const navigate = useNavigate(); 
  const location = useLocation();
const { _id } = location.state || {};
// const { _id: userId } = location.state || {}; 

  console.log(_id);
  
  

  useEffect(() => {
    if (selectedCompany) {
      const roomId = `${_id}_${selectedCompany._id}`;
      // socket.emit("UserId",{userId:_id});
      console.log(selectedCompany._id);
      socket.emit("joinRoom", { userId: _id, companyId: selectedCompany._id });
      localStorage.setItem("userId", JSON.stringify(_id));
      localStorage.setItem("company", JSON.stringify(selectedCompany._id));
  
      return () => {
        socket.off("recieved_user_problems");
      };
    }
  }, [selectedCompany, _id]);
  

  const handleNavigate = () => {
    if (selectedCompany) {
      // Request live location access
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Retrieve location coordinates
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              // latitude: 26.507700,
              // longitude: 80.303067,
            };
  
            // Emit the problem, timestamp, userId, companyId, and location data
            socket.emit("User_Problems", {
              message: problems,
              timestamp: new Date(),
              userId: _id,
              companyId: selectedCompany._id,
              location: locationData,
            });
  
            setProblems([]); // Clear the problems after submission
            navigate('/UserRequested'); // Navigate to the confirmation or next screen
          },
          (error) => {
            alert("Unable to access your location. Please enable location services.");
            console.error("Location access denied:", error);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
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

  // Fetch company data based on occupation
  useEffect(() => {
    axios.get(`http://localhost:5000/api/emergency/getEmergency/${occupation}`)
      .then((response) => {
        console.log('Fetched company data:', response.data);
        setCompanyData(response.data);
      })
      .catch((error) => console.error('Error fetching company data:', error));
  }, [occupation]);

  const handleBookNowClick = (company) => {
    setSelectedCompany(company);
    console.log(company._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProblems([]);
  };

  const handleAddProblem = () => {
    setProblems([...problems, '']);
  };

  const handleProblemChange = (index, value) => {
    const updatedProblems = problems.map((problem, i) => (i === index ? value : problem));
    setProblems(updatedProblems);
  };

  return (
    <div style={bgStyle}>
      <div className="container ">
        <div className="overflow-hidden " style={{ top: 0, zIndex: 1050 }}>
          <HomeFirstNav />
        </div>
        <div className="row mt-3">
          {companyData.length === 0 ? (
            <p>No companies available for the selected occupation.</p>
          ) : (
            companyData.map((company) => (
              <div className="col-md-12 mb-4" key={company._id}>
                {/* <div>{company._id}</div> */}
                <div className="card d-flex flex-row border border-black border-3">
                  <img
                    src={`http://localhost:5000${company.photo}`}
                    alt={company.fullname}
                    className="card-img-left m-3 border border-black"
                    style={{ width: '40%', height: 'auto', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <h3 className="card-title border-bottom border-black border-3 "><em>{company.companyname}</em></h3>
                    <p className="card-text"><em><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>{company.address}</em></p>
                    <h5 ><em className='border-black border-2 border-bottom'>Features Provided:</em></h5>
                    <ul>
                      {company.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <p style={{ fontWeight: 'bold' }}>Price: {company.price}</p>
                    <div className='d-flex justify-content-between'>
                      <button
                        type="button"
                        className="btn btn-primary mb-3"
                        onClick={() => handleBookNowClick(company)}
                      >Book Now
                      </button>
                      <div>
                        <div className='d-flex'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="yellow" className="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                          </svg>
                          {/* Other rating stars */}
                        </div>
                        Ratings
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="modal-content border border-black border-3">
                <div className="modal-header border-bottom border-black border-2">
                  <h5 className="modal-title border-bottom border-1 border-black fw-bold"><em>Add your problems to {selectedCompany ? selectedCompany.companyname : ''}</em></h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body border-bottom border-black border-2">
                  {problems.map((problem, index) => (
                    <div className="mb-3" key={index}>
                      <input
                        type="text"
                        className="form-control border border-black border-1"
                        value={problem}
                        onChange={(e) => handleProblemChange(index, e.target.value)}
                        placeholder="Enter problem description"
                      />
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={handleAddProblem}>+ Add your Problem</button>
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
  );
};

export default CompanyList;
