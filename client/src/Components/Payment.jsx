import axios from 'axios';
import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Payment() {
  const [product] = useState({
    name: "Sample Service",
    price: 200, // Price as a number
    description: "This is the sample service charge",
  });
  const [companyDetails, setCompanyDetails] = useState(null);
  const [charge, setcharge] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userId"));
    const company = JSON.parse(localStorage.getItem("company"));

    console.log("User and company data from localStorage:", { user, company });
    if (!user || !company) {
      console.error("User or company data is missing in localStorage.");
      return;
    }

    // Fetch company details
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/paymentreciept/company/${company}`);
        setCompanyDetails(response.data); // Update company details
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompanyDetails();

   
   
    socket.emit("joinRoom", { userId: user, companyId: company });
    console.log("room join");
    
    socket.on("workdonecharges",({charges,servicecharges})=>{
      console.log(charges);
      setcharge(charges);
      console.log(servicecharges);
  
    })

    socket.on("roomJoined", (data) => {
      console.log("Room Joined:", data);
    });
   
   


    // Cleanup socket listeners on component unmount
    return () => {
      socket.off("roomJoined");
      // socket.off("workdonecharges");
    };
  }, []); // Empty dependency array ensures useEffect runs once


  useEffect(() => {
    console.log("Updated charge value:", charge);
  }, [charge]);

  async function handleToken(token, addresses) {
    try {
      const response = await axios.post('http://localhost:5000/payment', {
        token,
        product,
      });
      if (response.status === 200) {
        alert("Payment Successful!");
        socket.emit("PaymentDone","Done");
      } else {
        alert("Payment Failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an issue processing your payment.");
    }
  }
     


 
 console.log(charge);
  return (
    <div className='container'>
      <div className="px-4 py-5 my-1 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-credit-card d-block mx-auto mb-2" viewBox="0 0 16 16">
          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
          <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
        </svg>
        <h1 className="display-5 fw-bold text-body-emphasis">Resolve Your Emergency Charges Now</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4 fst-italic">"Supporting emergency services starts with you."</p>

          {companyDetails ? (
            <>
              <h2 className="text-center display-5 fw-bold fst-italic border-bottom border-black">{companyDetails.companyname}</h2>
              <h3 className="text-center fs-4 mt-2">Emergency Provider ID: {companyDetails.companyId}</h3>
            </>
          ) : (
            <p className="text-center">Loading company details...</p>
          )}
           <h3 className="text-center fs-4">Service Added Charge:{ charge}</h3>
          <h3 className="text-center fs-4">Service Charge: {product.price}</h3>
          <h3 className="text-center fs-4">Problem Resolved by Emergency Provider: {product.description}</h3>

          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center m-2">
            <div className="form-group container m-4">
              <StripeCheckout
                className="d-flex w-100 justify-content-center"
                stripeKey="pk_test_51QKuZ6JP5PSOJeLv7gsS8ZHnBI4JWpcLjk2LY6P9Av4PANv7SVUjAk4l0jbuDdqeyUr2H4eyJXVpBo8fOGTJtaUL00K9NeFv0O"
                token={handleToken}
                amount={product.price * 100} // Convert to cents
                name={product.name}
                description={product.description}
                billingAddress
                shippingAddress
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

