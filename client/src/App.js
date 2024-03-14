import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookscreen from "./screens/Bookscreen";
import Loginscreen from "./screens/Loginscreen";
import Registerscreen from "./screens/Registerscreen";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Profilescreen from "./screens/Profilescreen";
import Landingscreen from "./screens/Landingscreen";
import Adminscreen from "./screens/Adminscreen";

const promise = loadStripe(process.env.STRIPEPKEY);

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route path="/home" element={<Homescreen />} />
            <Route
              path="/book/:roomid/:fromdate/:todate"
              element={
                <Elements stripe={promise}>
                  <Bookscreen />
                </Elements>
              }
            />
            <Route path="/register" element={<Registerscreen />} />
            <Route path="/login" element={<Loginscreen />} />
            <Route path="/profile" element={<Profilescreen />} />
            <Route path="/admin" element={<Adminscreen />} />
            <Route path="/" element={<Landingscreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
