import axios from 'axios';
import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

export default function Payment() {
  const [product] = useState({
    name: "Sample Service",
    price: 200, // As a number
    description: "This is the sample service charge",
  });

  async function handleToken(token, addresses) {
    try {
      const response = await axios.post('http://localhost:5000/payment', {
        token,
        product,
      });
      if (response.status === 200) {
        alert("Payment Successful!");
        
      } else {
        alert("Payment Failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an issue processing your payment.");
    }
  }
  

  return (
    <div className='container'>
      <br /><br />
      <h1 className='text-center'>Stripe Payment Checkout</h1>
      <br /><br />
      <h2 className='text-center'>Stripe Payment Checkout</h2>
      <h3 className='text-center'>Product Name : {product.name}</h3>
      <h3 className='text-center'>Product Price : {product.price}</h3>
      <h3 className='text-center'>Product Description : {product.description}</h3>
      <div className='form-group container'>
        <StripeCheckout
          className='d-flex w-100 justify-content-center'
          stripeKey='pk_test_51QKuZ6JP5PSOJeLv7gsS8ZHnBI4JWpcLjk2LY6P9Av4PANv7SVUjAk4l0jbuDdqeyUr2H4eyJXVpBo8fOGTJtaUL00K9NeFv0O'
          token={handleToken}
          amount={product.price * 100} // Convert to cents
          name={product.name}
          description={product.description}
          billingAddress
          shippingAddress
        />
      </div>
    </div>
  );
}
