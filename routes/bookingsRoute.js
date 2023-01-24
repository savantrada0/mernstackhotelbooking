const express = require("express");
const router = express.Router();
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPESKEY);
const { v4: uuidv4 } = require("uuid");

const Room = require("../models/room");
const Booking = require("../models/booking");

router.post("/bookRoom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } =
    req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount: totalamount * 100,
      currency: "inr",
    });

    // const cfp = await stripe.confirmCardPayment(payment.client_secret, {
    //   payment_method: {
    //     card: {
    //       token: token,
    //     },
    //   },
    // });

    if (payment) {
      const newbooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalamount,
        totaldays,
        transactionId: "45345",
      });
      const booking = await newbooking.save();

      const temproom = await Room.findOne({ _id: room._id });

      temproom.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });

      await temproom.save();
    }

    res.status(201).send({
      clientSecret: payment.client_secret,
      message: "payment successfull",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;
  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const booking = await Booking.findOne({ _id: bookingid });
    booking.status = "cancelled";
    await booking.save();
    const room = await Room.findOne({ _id: roomid });
    const bookings = room.currentbookings;
    const temp = bookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );
    room.currentbookings = temp;
    await room.save();
    res.send("Your booking cancelled successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    return res.status(400).json(error);
  }
});
module.exports = router;
