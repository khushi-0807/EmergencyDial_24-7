import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function HomeMiddleNF() {
  const location = useLocation();
  const { fullname } = location.state || {};


  return (
    <>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
        </svg>
      </div>
      <div className="mx-4 my-3 ml-5">
        <h1>Welcome</h1>
        {/* Display fetched username */}
        <h1 className=''>{fullname} !!</h1>
        <p className="lead">How can I assist you? Feel free to ask us...</p>
        <nav className="navbar navbar-light bg-body-secondary">
          <form className="form-inline d-flex">
            <input className="form-control px-5 mx-2 border-black border-2" type="search" placeholder="Search here..." aria-label="Search" />
            <button className="btn btn-outline-success border-2 my-2 my-sm-0" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </form>
        </nav>
      </div>
    </>
  );
}

export default HomeMiddleNF;
