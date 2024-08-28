import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import HomeFirstNav from './HomeFirstNav';

const CompanyList = () => {
  const [showModal, setShowModal] = useState(false);
  const [problems, setProblems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);


  const companyFeatures = {
    1: ['24/7 Support', 'Roadside Assistance', 'Repair Services','AC Repair'],
    2: ['Towing Service', 'Car Wash', 'Oil Change'],
    3: ['Tire Replacement', 'Battery Jumpstart', 'Engine Diagnostics'],
    4: ['Brake Repair', 'Transmission Services', 'AC Repair'],
    5: ['Window Tinting', 'Detailing', 'Alignment Services'],
    6: ['Engine Overhaul', 'Suspension Repair', 'Exhaust Services'],
    7: ['Custom Modifications', 'Interior Repairs', 'Paint Services'],
  };

  const companies = [
    {
      id: 1,
      name: 'New Vishwakarma Motors',
      address: 'Barra Bypass Road Damodar Nagar, Kanpur',
      photo: "../src/assets/Photos/car_centre.png", 
      ratings: 38,
      price: '$20,000',
    },
    {
      id: 2,
      name: 'Company B',
      address: 'Address B',
      photo: "../src/assets/Photos/car_centre.png", 
      ratings: 42,
      price: '$30,000',
    },
    {
      id: 3,
      name: 'Company C',
      address: 'Address C',
      photo: "../src/assets/Photos/car_centre.png", 
      ratings: 30,
      price: '$25,000',
    },
    {
      id: 4,
      name: 'Company D',
      address: 'Address D',
      photo: "../src/assets/Photos/car_centre.png", 
      ratings: 45,
      price: '$28,000',
    },
    {
      id: 5,
      name: 'Company E',
      address: 'Address E',
      photo: "../src/assets/Photos/car_centre.png", 
      ratings: 45,
      price: '$28,000',
    },
    {
      id: 6,
      name: 'Company F',
      address: 'Address F',
      photo: "../src/assets/Photos/car_centre.png", 
      ratings: 45,
      price: '$28,000',
    },
    {
      id: 7,
      name: 'Company G',
      address: 'Address G',
      photo: "../src/assets/Photos/car_centre.png", 
      ratings: 45,
      price: '$28,000',
    },
  ];

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

  const handleBookNowClick = (company) => {
    setSelectedCompany(company);
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

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Submitted problems for company:', selectedCompany.name);
    console.log('Problems:', problems);
    setShowModal(false);
    setProblems([]); 
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          style={{ marginRight: '2px', color: i < rating / 10 ? '#f9c733' : '#e4e5e9' }}
        />
      );
    }
    return stars;
  };

  return (
    <div style={bgStyle}>
      <div className="container">
      <HomeFirstNav/>
        <div className="row mt-3" >
          {companies.map((company) => (
            <div className="col-md-6 mb-4" key={company.id}>
              <div className="card d-flex flex-row">
                <img src={company.photo} alt={company.name} className="card-img-left" style={{ width: '180px', height: 'auto', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h5 className="card-title">{company.name}</h5>
                  <p className="card-text">{company.address}</p>
                  <h6>Features Provided:</h6>
                  <ul>
                    {companyFeatures[company.id]?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(company.ratings)}
                    <span className="ms-2">{company.ratings} Ratings</span>
                  </div>
                  <p style={{ fontWeight: 'bold' }}>Price: {company.price}</p>
                  <button type="button" className="btn btn-primary mb-3" onClick={() => handleBookNowClick(company)}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="modalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalLabel">Add your problems to {selectedCompany ? selectedCompany.name : ''}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {problems.map((problem, index) => (
                  <div className="mb-3" key={index}>
                    <input
                      type="text"
                      className="form-control"
                      value={problem}
                      onChange={(e) => handleProblemChange(index, e.target.value)}
                      placeholder="Enter problem description"
                    />
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={handleAddProblem}>+ Add your Problem</button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Book</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
