import React from "react";
import { Link } from "react-router-dom";

const Landingscreen = () => {
  return (
    <div className="row landing justify-content-center">
      <div className="col-md-9 my-auto text-center">
        <h2 style={{ color: "white", fontSize: "130px" }}>E-Bookings</h2>
        <h1 style={{ color: "white" }}>"There is only one boss. The Guest.</h1>
        <Link to="/home">
          <button
            className="btn btn-primary landingbtn"
            style={{ color: "black" }}
          >
            Get started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Landingscreen;
