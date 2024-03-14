import React, { useState } from "react";
import RiseLoader from "react-spinners/RiseLoader";

const Loader = () => {
  let [loading, setLoading] = useState(true);
  return (
    <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
      <div className="sweet-loading">
        <RiseLoader
          color="#000"
          loading={loading}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default Loader;
