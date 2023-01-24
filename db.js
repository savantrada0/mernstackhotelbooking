const mongoose = require("mongoose");

var mongourl = process.env.MONGOURI;

mongoose.set("strictQuery", false);
mongoose.connect(mongourl);

var conn = mongoose.connection;

conn.on("error", () => {
  console.log("mongo db connection failed");
});

conn.on("connected", () => {
  console.log("mongo db connection successful");
});

module.exports = mongoose;
