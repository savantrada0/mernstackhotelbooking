import React, { useState } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loader from "../components/Loader";

const Loginscreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const login = async () => {
    const user = { email, password };

    try {
      setLoading(true);
      const result = (await axios.post("api/users/login", user)).data;
      setLoading(false);

      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div>
      {loading && <Loader />}

      <div className="row register justify-content-center mt-5 ">
        <div className="col-md-5">
          {error && <Error message="Invalid Credentails" />}

          <div className="bs">
            <h2>Login</h2>

            <input
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />

            <button className="btn btn-primary mt-3" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginscreen;
