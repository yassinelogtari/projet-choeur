
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const candidatRoute = require("./routes/candidatRoute");
const auditionRoute = require("./routes/auditionRoute");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL + "choeurProjectBD")
  .then(console.log("connected to mongodb"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

app.use("/api/candidats", candidatRoute);
app.use("/api/auditions", auditionRoute);



module.exports = app
