import React from 'react'
import { useNavigate } from 'react-router-dom';

function HomeFirstLogin() {

  const navigate=useNavigate();
  return (
    <div className="container  ">
  <div className="p-4 text-center bg-body-tertiary rounded-3">
    {/* <h1 className="text-body-emphasis">Jumbotron with icon</h1> */}
    <p className=" mx-auto fs-5 text-black fw-bold">
    "Welcome to our Emergency Response Portal. Your safety is our top priority, and we are dedicated to providing you with real-time updates, critical information, and essential resources to help you stay informed and prepared during emergencies. Our comprehensive platform is designed to support you in making informed decisions and accessing the help you need when it matters most. Trust us to be your reliable source for timely and accurate emergency information."
    </p>
    <div className="d-inline-flex gap-2 mb-3">
      <button className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill border border-black border-2" type="button" onClick={()=>navigate('/signupuser')}>
        SignUp as user
        <svg className="bi ms-2" width="24" height="24"><use xlink:href="#arrow-right-short"></use></svg>
      </button>
      <button className="btn btn-secondary btn-lg px-4 rounded-pill border border-black border-2" type="button" onClick={()=>navigate('/signupemergency')}>
        SignUp as Emergency Provider
      </button>
    </div>
    {/* <div className="d-flex text-center"> */}
    <p className="fw-bold">Already have an account? <button onClick={() => navigate('/login')} className="btn btn-link p-0">Login</button></p>
    </div>
  {/* </div> */}
</div>
  )
}

export default HomeFirstLogin