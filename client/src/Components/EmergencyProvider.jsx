import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const EmergencyProvider = () => {
  const [accepted, setAccepted] = useState(false);
  const [showCard, setShowCard] = useState(true);

  const problem = ['Flat Tire', 'Battery Issue', 'Engine Trouble'];
  const location = '123 Main St, Springfield';
  const name = 'John Doe';
  const phone = '123-456-7890';

  const handleAccept = () => {
    setAccepted(true);
  };

  const handleReject = () => {
    setShowCard(false);
  };

  const handleWorkDone = () => {
    alert('Work has been marked as done.');
  };

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      {accepted && (
        <div className="flex-grow-1" style={{ flexBasis: "75%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "" }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
          </GoogleMapReact>
        </div>
      )}

      {showCard && (
        <div className="container mt-3">
          <div className="card mb-4">
            <div className="card-body">
              {!accepted && <h5 className="card-title">Emergency !!</h5>}
              <div className="row">
                <div className="col-md-6">
                  <p className="card-text"><strong>Problem:</strong> {problem}</p>
                  <p className="card-text"><strong>Location:</strong> {location}</p>
                </div>
                {accepted && (
                  <div className="col-md-6">
                    <p className="card-text"><strong>Name:</strong> {name}</p>
                    <p className="card-text"><strong>Phone:</strong> {phone}</p>
                  </div>
                )}
              </div>
<br/>
              {!accepted ? (
                <div className="d-flex">
                  <button className="btn btn-success me-2" onClick={handleAccept}>Accept</button>
                  <button className="btn btn-danger" onClick={handleReject}>Reject</button>
                </div>
              ) : (
                <button className="btn btn-success w-100 mt-3" onClick={handleWorkDone}>Work Done</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyProvider;
