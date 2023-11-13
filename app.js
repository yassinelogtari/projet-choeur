const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/choeur-project")
  .then(console.log("connected to mongodb"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());
console.log("tests");

module.exports = app;
