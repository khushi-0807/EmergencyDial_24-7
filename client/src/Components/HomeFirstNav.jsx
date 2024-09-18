import React from 'react'

function HomeFirstNav() {

  

  return (
    <div className=" container pb-2 border-bottom border-3 border-black d-flex justify-content-between pt-5">
      
    <h1 className=" fw-bold"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="red" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg>Emergency Services</h1>
    <div className="form-group d-flex ">
      
<div className="col-md-5 mx-2  ">
    <input type="text" className="form-control mx-2 p-2 border border-black border-2" id="inputAddress" placeholder="Enter Your Location"/>
   </div> 
   <div className="col-md-7 mx-2 ">
    <input type="text" className="form-control p-2 border border-black border-2" id="validationCustom03" placeholder="Enter Your Emergency Services" required/>
  </div>
  </div></div>
  
  )
}

export default HomeFirstNav