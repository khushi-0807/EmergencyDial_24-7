import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function HomeMiddleNF() {
  const location = useLocation();
  const { fullname } = location.state || {};

  return (
    <>
      <div className="mx-4 my-3 ml-5">
        <div class=" mx-2 my- ml-5 text-center">
          <h1 class="display-5 fw-bold text-body-emphasis">
            Welcome {fullname} !!
          </h1>
          <div class="mx-auto display-flex align-items-center justify-content-center">
            <p class="lead mb-4">
              We provide round-the-clock emergency services to ensure your
              safety, health, and peace of mind. Whether you're facing a medical
              emergency, a fire outbreak, or need immediate roadside assistance,
              our expert team is ready to respond swiftly and professionally.
            </p>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-2">
          <button type="button" class="btn btn-primary btn-lg">
            Back
          </button>
          <button type="button" class="btn btn-secondary btn-lg">Emergency Now</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeMiddleNF;
