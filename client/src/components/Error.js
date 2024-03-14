import React from "react";

const Error = ({ message }) => {
  return (
    <div className="alert alert-danger" role="alert">
      {message ? message : "somethig went wrong try again"}
    </div>
  );
};

export default Error;
