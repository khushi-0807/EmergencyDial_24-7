import React from "react";
import { useNavigate } from "react-router-dom";

function HomeMenuSecComp({ occupation, description,photo ,_id}) {
  const navigate = useNavigate();
  console.log(_id);
  return (
    <div className="col">
      <div className="card shadow-sm">
        <img src={photo}/>
        <div className="card-body">
          <h className="justify-content-center fw-bold text-2">{occupation}</h>
          <p className="card-text">{description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-4"
                onClick={() => navigate(`/companylist/${occupation}`,{ state: { _id:_id } })} // Pass the selected occupation
              >
                View Emergencies
              </button>
            </div>
            <small className="text-body-secondary">9 mins</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeMenuSecComp;
