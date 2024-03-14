import React, { useState } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from "../components/Success";

const Registerscreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const register = async () => {
    if (password == cpassword) {
      const user = { name, email, password, cpassword };
      try {
        setLoading(true);
        const { data } = await axios.post("api/users/register", user);
        setLoading(false);
        setSuccess(true);
        setName("");
        setCpassword("");
        setPassword("");
        setEmail("");
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    } else {
      alert("passwords does not match");
    }
  };

  return (
    <div>
      {loading && <Loader />}

      <div className="row register justify-content-center ">
        <div className="col-md-5" style={{ marginTop: 120 }}>
          {success && <Success message="User Registered Succeessfully" />}
          {error && <Error />}

          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
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
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
              value={cpassword}
            />
            <button className="btn btn-primary mt-3" onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registerscreen;
