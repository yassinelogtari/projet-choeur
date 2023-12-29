const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const candidatRoute = require("./routes/candidatRoute");
const auditionRoute = require("./routes/auditionRoute");
const congeRoute = require("./routes/congeRoute");
const saisonRoute = require("./routes/saisonRoute");
const oeuvreRoute = require("./routes/ouevreRoute");
const cron = require("node-cron");
const Candidat = require("./models/candidatModel");
const Repetition = require("./models/repetitionModel");
const User = require("./models/membreModel");
const repetitionRoute = require("./routes/repetitionRouteToTestPresence");
const presenceRoute = require("./routes/presenceRoute");
const disponibilityToCancertRoute = require("./routes/disponibilityToCancertRoute");
const concertRoute = require("./routes/concertRoute");
const ProfileRoute = require("./routes/profileRoute");
const membreRoute = require("./routes/membreRoute");
const { io } = require("./utils/socket");
const moment = require("moment");
const sendNotificationMiddleware = require("./middlewares/sendNotificationMiddleware");
const { userSocketMap } = require("./utils/socket");
const absenceRoute = require("./routes/absenceRoute");
const statisticsRoute = require("./routes/statistiqueRoute");
const placementRoute=require("./routes/placementRoute");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL + "choeurProjectBD")
  .then(console.log("connected to mongodb"))
  .catch((err) => console.log(err));

cron.schedule("* 10 * * *", async (req, res) => {
  try {
    const adminUsers = await User.find({ role: "admin" });

    const yesterdayTenAM = moment()
      .subtract(1, "days")
      .set({ hour: 10, minute: 0, second: 0, millisecond: 0 });
    const todayTenAM = moment().set({
      hour: 10,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const newCandidates = await Candidat.find({
      createdAt: {
        $gte: yesterdayTenAM.toDate(),
        $lt: todayTenAM.toDate(),
      },
    });

    console.log(adminUsers);
    console.log(userSocketMap);

    adminUsers.forEach(async (adminUser) => {
      const adminSocketId = userSocketMap[adminUser._id];

      if (adminSocketId) {
        console.log("//////////");
        console.log(userSocketMap);
        console.log(adminUser._id);
        console.log(`${newCandidates.length} nouveaux candidats ont été créés`);
        console.log("//////////");
        req.notificationData = {
          userId: adminUser._id,
          notificationMessage: `${newCandidates.length} nouveaux candidats ont été créés`,
        };

        await sendNotificationMiddleware(req, res, () => {});
      }
    });
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
});

cron.schedule("03 17 * * *", async (req, res) => {
  try {
    const now = new Date();
    console.log("Current Date:", now);

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    const repetitions = await Repetition.find({
      HeureDeb: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate("membres");

    if (repetitions.length === 0) {
      console.log("No repetitions today. Exiting function.");
      return;
    }

    repetitions.forEach(async (rehearsal) => {
      try {
        const memberIds = rehearsal.membres.map((member) => member.member);

        const members = await User.find({ _id: { $in: memberIds } });
        console.log(members);

        members.forEach(async (member) => {
          const memberSocketId = userSocketMap[member._id];
          if (memberSocketId) {
            req.notificationData = {
              userId: member._id,
              notificationMessage: `The rehearsal on ${rehearsal.DateRep.toLocaleDateString()} will start at ${rehearsal.HeureDeb.toLocaleTimeString()}.`,
            };
            console.log(req.notificationData);
            await sendNotificationMiddleware(req, res, () => {});
          }
        });
      } catch (error) {
        console.error("Error sending notifications to members:", error);
      }
    });
  } catch (error) {
    console.error("Error in rehearsal start notification task:", error);
  }
});

io.listen(5000);
const app = express();
app.use(express.json());
//app.use(upload.array());

app.use("/api/candidats", candidatRoute);
app.use("/api/auditions", auditionRoute);
app.use("/api/saison", saisonRoute);
app.use("/api/oeuvre", oeuvreRoute);
app.use("/api/conge", congeRoute);
app.use("/api/repetition", repetitionRoute);
app.use("/api/presence", presenceRoute);
app.use("/api/concerts", concertRoute);
app.use("/api/disponibility/cancert", disponibilityToCancertRoute);
app.use("/api/profile", ProfileRoute);
app.use("/api/membre", membreRoute);
app.use("/api/absence", absenceRoute);
app.use("/api/statistics", statisticsRoute);
app.use("/api/placement", placementRoute);

module.exports = app;
