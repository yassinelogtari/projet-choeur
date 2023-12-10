const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const candidatRoute = require("./routes/candidatRoute");
const auditionRoute = require("./routes/auditionRoute");
const saisonRoute = require("./routes/saisonRoute");
const oeuvreRoute = require("./routes/ouevreRoute");
const cron = require("node-cron");
const Candidat = require("./models/candidatModel");
const User = require("./models/membreModel");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL + "choeurProjectBD")
  .then(console.log("connected to mongodb"))
  .catch((err) => console.log(err));

const userSocketMap = {};
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("setSocketId", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User with ID ${userId} connected with socketId: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User with ID ${userId} disconnected`);
    }
  });
});

cron.schedule("0 10 * * *", async () => {
  try {
    const adminUsers = await User.find({ role: "admin" });

    const allCandidates = await Candidat.find();
    console.log(adminUsers);
    console.log(userSocketMap);
    adminUsers.forEach((adminUser) => {
      const adminSocketId = userSocketMap[adminUser._id];

      if (adminSocketId) {
        io.to(adminSocketId).emit(
          "getNotification",
          ` ${allCandidates.length} nouveaux candidats ont été créés`
        );
      }
    });
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
});

io.listen(5000);
const app = express();
app.use(express.json());

app.use("/api/candidats", candidatRoute);
app.use("/api/auditions", auditionRoute);
app.use("/api/saison", saisonRoute);
app.use("/api/oeuvre", oeuvreRoute);

module.exports = app;
