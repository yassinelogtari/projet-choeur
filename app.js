
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const candidatRoute = require("./routes/candidatRoute");
const auditionRoute = require("./routes/auditionRoute");
const saisonRoute=require("./routes/saisonRoute");
const oeuvreRoute=require("./routes/ouevreRoute")

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL + "choeurProjectBD")
  .then(console.log("connected to mongodb"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

app.use("/api/candidats", candidatRoute);
app.use("/api/auditions", auditionRoute);
app.use("/api/saison", saisonRoute);
app.use("/api/oeuvre", oeuvreRoute);



module.exports = app
