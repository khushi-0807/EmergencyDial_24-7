import React from 'react'
import { useNavigate } from 'react-router-dom';

function ProviderWorkDone() {
    const navigate = useNavigate();
    const handleButtonClick = () => {
      
          navigate('/emergencyprovider'); // Replace with the route to home component
      
        
      };

    return (
        <div className='container mt-4'>
          <div className="px-4 py-5 my-1 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
  <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
  <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
</svg>
            <h1 className="display-5 fw-bold text-body-emphasis">Service Completed</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4 fst-italic">"Thank you for your efforts in completing the emergency service task. We are pleased to confirm that the payment has been processed successfully. Transaction ID: [Transaction_ID]. For any further assistance, including payment inquiries, reach out to us at [Support Contact Information]. Your contribution is greatly appreciated!"</p>
    
             
    
              {/* <h3 className="text-center fs-4">Service Charge: {product.price}</h3>
              <h3 className="text-center fs-4">Problem Resolved by Emergency Provider: {product.description}</h3> */}
    
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center m-2">
              <button
                type="button"
                className="btn btn-primary btn-lg px-4 me-sm-3"
                onClick={handleButtonClick}
              >
                Go Back
              </button>
              </div>
            </div>
          </div>
        </div>
      );
}

export default ProviderWorkDone