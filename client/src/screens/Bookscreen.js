import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import Error from "../components/Error";
import moment from "moment";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import StripeCheckout from "react-stripe-checkout";

const Bookscreen = () => {
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const params = useParams();

  const { roomid, fromdate, todate } = params;

  const from = moment(fromdate, "DD-MM-YYYY");
  const to = moment(todate, "DD-MM-YYYY");

  const total = moment.duration(to.diff(from)).asDays() + 1;

  const [totalamount, setTotalamount] = useState();

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      window.location.reload = "/login";
    }
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post("/book/api/rooms/getroombyid", {
          roomid: roomid,
        });
        setTotalamount(data.rentperday * total);
        setRoom(data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.log(error);
      }
    };

    getData();
  }, []);

  async function onToken(token) {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate: from,
      todate: to,
      totalamount,
      totaldays: total,
      token,
    };
    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setClientSecret(result.data.clientSecret);

      // confirmPayment(token);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Oops!", "Something Went Wrong", "error");
    }
  }

  // const confirmPayment = async (token) => {
  //   await stripe
  //     .confirmCardPayment(clientSecret, {
  //       payment_method: {
  //         card: {
  //           token,
  //         },
  //       },
  //     })
  //     .then((result) => {
  //       alert(result.data.message);
  //     })
  //     .catch((err) => console.warn(err));
  // };

  return (
    <div style={{ margin: 60 }}>
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" alt="roomimg" />
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>
                    Name :{" "}
                    {JSON.parse(localStorage.getItem("currentUser")).name}
                  </p>
                  <p>From Date : {fromdate} </p>
                  <p>To Date : {todate} </p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Account</h1>
                  <hr />
                  <p>Total days : {total} </p>
                  <p>Rent per day : {room.rentperday}</p>
                  <p>Total Amount : {totalamount}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalamount * 100}
                  token={onToken}
                  currency="INR"
                  stripeKey={process.env.REACT_APP_STRIPEPKEY}
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
};

export default Bookscreen;
