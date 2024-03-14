import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import Loader from "../components/Loader";
import Error from "../components/Error";
import axios from "axios";
import Swal from "sweetalert2";

const Adminscreen = () => {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);
  return (
    <div className="mt-3 adminbox bs">
      <h2 className="text-center" style={{ fontSize: "30px" }}>
        Admin Panel
      </h2>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Bookings" key="1">
          <Bookings />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Rooms" key="2">
          <Rooms />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Add Room" key="3">
          <Addroom />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Users" key="4">
          <Users />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Adminscreen;

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getallbookings() {
      try {
        setLoading(true);
        const booking = await axios.get("/api/bookings/getallbookings");
        setBookings(booking.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    }
    getallbookings();
  }, []);
  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Bookings</h1>
        {loading && <Loader />}
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length &&
              bookings.map((booking) => {
                return (
                  <tr>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.room}</td>
                    <td>{booking.fromdate}</td>
                    <td>{booking.todate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getallrooms() {
      try {
        setLoading(true);
        const result = await axios.get("/api/rooms/getallrooms");
        setRooms(result.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    }
    getallrooms();
  }, []);
  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Rooms</h1>
        {loading && <Loader />}
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Room Id</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per Day</th>
              <th>Max Count</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length &&
              rooms.map((room) => {
                return (
                  <tr>
                    <td>{room._id}</td>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>{room.rentperday}</td>
                    <td>{room.maxcount}</td>
                    <td>{room.phonenumber}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getusers() {
      try {
        setLoading(true);
        const result = await axios.get("/api/users/getallusers");
        setUsers(result.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    }
    getusers();
  }, []);
  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Users</h1>
        {loading && <Loader />}
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>User Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.length &&
              users.map((user) => {
                return (
                  <tr>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "Yes" : "NO"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const Addroom = () => {
  const [name, setName] = useState("");
  const [rentperday, setRentperday] = useState();
  const [maxcount, setMaxcount] = useState();
  const [description, setDescription] = useState("");
  const [phonenumber, setPhonenumber] = useState();
  const [type, setType] = useState();
  const [imageurl1, setImageurl1] = useState();
  const [imageurl2, setImageurl2] = useState();
  const [imageurl3, setImageurl3] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  async function addRoom() {
    const newroom = {
      name,
      rentperday,
      maxcount,
      description,
      phonenumber,
      type,
      imageurls: [imageurl1, imageurl2, imageurl3],
    };
    try {
      setLoading(true);
      const result = await axios.post("/api/rooms/addroom", newroom);

      setLoading(false);
      Swal.fire("Congratulations", "Room created Successfully", "success").then(
        (result) => {
          window.location.href = "/home";
        }
      );
    } catch (error) {
      setLoading(false);
      setError(error);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  }
  return (
    <div className="row">
      <div className="col-md-5">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="form-control"
          placeholder="room name"
        />
        <input
          type="text"
          value={rentperday}
          onChange={(e) => {
            setRentperday(e.target.value);
          }}
          className="form-control"
          placeholder="rent per day"
        />
        <input
          type="text"
          value={maxcount}
          onChange={(e) => {
            setMaxcount(e.target.value);
          }}
          className="form-control"
          placeholder="max count"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="form-control"
          placeholder="description"
        />
        <input
          type="text"
          value={phonenumber}
          onChange={(e) => {
            setPhonenumber(e.target.value);
          }}
          className="form-control"
          placeholder="phone number"
        />
      </div>
      <div className="col-md-5">
        <input
          type="text"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
          className="form-control"
          placeholder="type"
        />
        <input
          type="text"
          value={imageurl1}
          onChange={(e) => {
            setImageurl1(e.target.value);
          }}
          className="form-control"
          placeholder="image URL 1"
        />
        <input
          type="text"
          value={imageurl2}
          onChange={(e) => {
            setImageurl2(e.target.value);
          }}
          className="form-control"
          placeholder="image URL 2"
        />
        <input
          type="text"
          value={imageurl3}
          onChange={(e) => {
            setImageurl3(e.target.value);
          }}
          className="form-control"
          placeholder="image URL 3"
        />
        <div className="text-right">
          <button className="btn btn-primary mt-2" onClick={addRoom}>
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
};
