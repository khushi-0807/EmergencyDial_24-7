import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';


function ProviderProcessCompleted() {
    const [status, setStatus] = useState(false);
    const navigate = useNavigate();
    

    const handleWorkDone = () => {

          navigate('/emergencyprovider'); // Replace with the route to home component
    
      };

    return (
        <div className="container my-5 border border-black rounded-3">
          <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
            <div className="px-4 pt-5 my-5 text-center">
              <div className="overflow-hidden" style={{ maxHeight: "30vh" }}>
                <div className="container px-5">
              {status === "PaymentDone" ?  (  <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" className="bi bi-radar" viewBox="0 0 16 16">
                    <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"/>
                  </svg>):(<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
  <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
  <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
</svg>)}
                </div>
              </div>
              <h1 className="display-4 fw-bold text-body-emphasis">
                {status === "PaymentDone" ? "Payment Completed" : "Payment Processing"}
              </h1>
              <div className="col-lg-6 mx-auto">
                <p className="lead mb-4">
             {status==="PaymentDone"?   "We sincerely appreciate your dedication to completing the emergency service task. The payment for this service is currently being processed. You will receive a confirmation along with the Transaction ID once the payment is completed. For any questions or support during this process, please contact us at [Support Contact Information]. Thank you for your patience and continued excellence in service!":"Thank you for your efforts in completing the emergency service task, and the payment for this task has been successfully received. Transaction ID: [Transaction_ID]. Should you need assistance or have questions about the transaction, please feel free to connect with our support team at [Support Contact Information]. We truly appreciate your hard work and prompt service delivery!"
}
                </p>
                {status==="PaymentDone" &&
                  <button className="btn btn-success w-100 mt-3" onClick={handleWorkDone}>Go Back</button>
                }
              </div>
            </div>
          </div>
        </div>
      );
}

export default ProviderProcessCompleted