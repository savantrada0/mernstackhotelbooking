import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { Tag } from "antd";
import Swal from "sweetalert2";
import { Tabs } from "antd";
const Profilescreen = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <div className="pfscr mt-3">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Profile" key="1">
          <h1>My Profile</h1>
          <br />
          <h1>Name : {user.name}</h1>
          <h1>Email : {user.email}</h1>
          <h1>isAdmin : {user.isAdmin ? "Yes" : "No"}</h1>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Bookings" key="2">
          <MyBookings />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profilescreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [booking, setBooking] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getbookings() {
      try {
        setLoading(true);
        const rooms = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        console.log(rooms.data);
        setBooking(rooms.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    }

    getbookings();
  }, []);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/cancelbooking", {
        bookingid,
        roomid,
      }).data;
      setLoading(false);
      console.log(result);
      Swal.fire(
        "Congratulations",
        "Your booking has been cancelled successfully",
        "success"
      ).then((result) => {
        window.location.reload();
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Oops", "Something went wrong", "error");
      console.log(error);

      setError(error);
    }
  }
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <Loader />}
          {booking &&
            booking.map((book) => {
              return (
                <div className="bs bookcard  " key={book._id}>
                  <h1>{book.room}</h1>

                  <p>
                    <b>BookingId</b> : {book._id}
                  </p>
                  <p>
                    <b>CheckIn</b> : {book.fromdate}
                  </p>
                  <p>
                    <b>CheckOut</b> : {book.todate}
                  </p>
                  <p>
                    <b>Amount</b> : {book.totalamount}
                  </p>
                  <p>
                    <b>status</b> :{" "}
                    {book.status == "cancelled" ? (
                      <Tag color="red">CANCELLED</Tag>
                    ) : (
                      <Tag color="green">CONFIRMED</Tag>
                    )}
                  </p>

                  {book.status !== "cancelled" && (
                    <div style={{ float: "right" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          cancelBooking(book._id, book.roomid);
                        }}
                      >
                        CANCEL BOOKING
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
