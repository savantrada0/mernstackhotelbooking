const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

const dbconfig = require("./db");

const roomRoute = require("./routes/roomsRoute");
const userRoute = require("./routes/usersRoute");
const bookingRoute = require("./routes/bookingsRoute");

app.use(express.json());
app.use(cors());

app.use("/api/rooms", roomRoute);
app.use("/book/api/rooms", roomRoute);
app.use("/api/users", userRoute);
app.use("/api/bookings", bookingRoute);

// app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
