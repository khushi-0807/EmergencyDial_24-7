import React from "react";
import GoogleMapReact from "google-map-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        style={{
          marginRight: "2px",
          color: i < rating ? "#f9c733" : "#e4e5e9",
        }}
      />
    );
  }
  return stars;
};

export default function EmergencyProviderDetails() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <div className="flex-grow-1" style={{ flexBasis: "75%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </div>

      <div className="flex-grow-1 mt-2" style={{ flexBasis: "25%" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card d-flex flex-row">
                <img
                  src="../src/assets/Photos/car_centre.png"
                  alt="Hardcoded Company"
                  className="card-img-left"
                  style={{ width: "180px", height: "auto", objectFit: "cover" }}
                />
                <div style={{ padding: "1rem" }}>
                  <h5 className="card-title">Company ABC</h5>
                  <p className="card-text">1234 Main St, Anytown, USA</p>
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(4)}
                    <span className="ms-2">4 Ratings</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card d-flex flex-row">
                <div style={{ padding: "1rem", width: "100%" }}>
                  <h5 style={{ fontWeight: "bold" }}>Price: $200</h5>
                  <p className="card-text">+91 8579654859</p>
                  <div className="d-flex">
                    <button type="button" className="btn btn-danger flex-grow-1">Cancel</button>
                    <button type="button" className="btn btn-primary flex-grow-1 ms-2">Pay</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
