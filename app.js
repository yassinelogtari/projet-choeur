const express = require ("express")
const mongoose=require("mongoose")
require('dotenv').config();

const CondidatRouter=require("./routes/candidat")




mongoose
  .connect(
   "mongodb+srv://projetchoeur2023:ragQa2RziaW649oe@cluster0.mqsisyo.mongodb.net/"
  )
  .then(console.log("connected to mongodb"))
  .catch((err) => console.log(err));

const app = express()
app.use(express.json())


app.use("/api",CondidatRouter)


module.exports = app