import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
const { RangePicker } = DatePicker;

const Homescreens = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [duplicaterooms, setDuplicaterooms] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [type, setType] = useState("all");

  // const getData = async () => {
  //   try {
  //     setLoading(true);
  //     const { data } = await axios.get("api/rooms/getallrooms");
  //     setRooms(data);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(true);
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("api/rooms/getallrooms");
        setRooms(data);
        setDuplicaterooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, []);
  function filterByDate(dates) {
    setFromdate(moment(dates[0]).format("DD-MM-YYYY"));
    setTodate(moment(dates[1]).format("DD-MM-YYYY"));
    var temprooms = [];
    var availability = false;
    for (const room of duplicaterooms) {
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          let firstsld = moment(moment(dates[0], "DD-MM-YYYY").toISOString());
          let secondsld = moment(moment(dates[1], "DD-MM-YYYY").toISOString());
          if (
            !firstsld.isBetween(
              moment(booking.fromdate, "DD-MM-YYYY").toISOString(),
              moment(booking.todate, "DD-MM-YYYY").toISOString()
            ) &&
            !secondsld.isBetween(
              moment(booking.fromdate, "DD-MM-YYYY").toISOString(),
              moment(booking.todate, "DD-MM-YYYY").toISOString()
            ) &&
            !moment(
              moment(booking.fromdate, "DD-MM-YYYY").toISOString()
            ).isBetween(
              moment(dates[0], "DD-MM-YYYY").toISOString(),
              moment(dates[1], "DD-MM-YYYY").toISOString()
            )
          ) {
            if (
              moment(dates[0]).format("DD-MM-YYYY") !== booking.fromdate &&
              moment(dates[0]).format("DD-MM-YYYY") !== booking.todate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.fromdate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.todate
            ) {
              availability = true;
            }
          }
        }
      }
      if (availability === true || room.currentbookings.length === 0) {
        temprooms.push(room);
      }
      setRooms(temprooms);
      availability = false;
    }
  }

  function filterBySearch() {
    const temprooms = duplicaterooms.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );
    setRooms(temprooms);
  }

  function filterByType(e) {
    setType(e);
    if (e !== "all") {
      const temprooms = duplicaterooms.filter(
        (room) => room.type.toLowerCase() == e.toLowerCase()
      );
      setRooms(temprooms);
    } else {
      setRooms(duplicaterooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            value={searchkey}
            onChange={(e) => {
              setSearchkey(e.target.value);
            }}
            onKeyUp={filterBySearch}
            className="form-control "
            placeholder="search rooms"
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>
            <Loader />
          </h1>
        ) : (
          rooms.map((room) => {
            return (
              <div key={room._id} className="col-md-9 mt-2">
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Homescreens;
