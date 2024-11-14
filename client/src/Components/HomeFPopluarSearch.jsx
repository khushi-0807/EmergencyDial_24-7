import React from 'react'

function HomeFPopluarSearch() {
  return (
    <div className="container px-4 pt-5" id="featured-3">
    <h2 className="pb-2 border-bottom border-black border-2">Popular Searches</h2>
    <div className="row g-4 pt-5 pb-4 row-cols-1 row-cols-lg-3">
      <div className="feature col ">
      <div className="card border border-black border-2" style={{width: "18rem"}}>
  <img src="../src/assets/Photos/Ambulance2.jpeg" className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Ambulance</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" className="btn btn-primary">View more</a>
  </div>
</div>
      </div>
      <div className="feature col">
      <div className="card border-black border-2" style={{width: "18rem"}}>
  <img src="../src/assets/Photos/FireDepartment2.jpeg" className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Fire Brigade</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" className="btn btn-primary">View more</a>
  </div>
</div>
      </div>
      <div className="feature col">
      <div className="card border-black border-2" style={{width: "18rem"}}>
  <img src="../src/assets/Photos/Vehicle.jpeg" className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">Mechanic</h5>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" className="btn btn-primary">View more</a>
  </div>
</div>
      </div>
      
    </div>
  </div>
  )
}

export default HomeFPopluarSearch