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

const sendNotificationsForRehearsalToMembers = async (rehearsal) => {
  try {
    const members = await User.find({ _id: { $in: rehearsal.membres } });

    members.forEach((member) => {
      const memberSocketId = userSocketMap[member._id];

      if (memberSocketId) {
        const notificationMessage = `The rehearsal on ${rehearsal.DateRep.toLocaleDateString()} will start at ${rehearsal.HeureDeb.toLocaleTimeString()}.`;

        io.to(memberSocketId).emit("getNotification", notificationMessage);
      }
    });
  } catch (error) {
    console.error("Error sending notifications to members:", error);
  }
};

cron.schedule("07 21 * * *", async () => {
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
    console.log("repetitions starting today:", repetitions);

    repetitions.forEach((rehearsal) => {
      sendNotificationsForRehearsalToMembers(rehearsal);
    });
  } catch (error) {
    console.error("Error in rehearsal start notification task:", error);
  }
});

const sendNotificationForUpdatedRehearsal = async (repetition) => {
  try {
    const memberIds = repetition.membres.map((member) => member.member);

    const members = await User.find({ _id: { $in: memberIds } });

    members.forEach((member) => {
      const memberSocketId = userSocketMap[member._id];

      if (memberSocketId) {
        const notificationMessage = `The repetition on ${repetition.DateRep.toLocaleDateString()} has been updated. It will start at ${repetition.HeureDeb.toLocaleTimeString()} and end at ${repetition.HeureFin.toLocaleTimeString()} at ${
          repetition.lieu
        }.`;

        io.to(memberSocketId).emit("getNotification", notificationMessage);
      }
    });
  } catch (error) {
    console.error("Error sending notifications to members:", error);
  }
};

const updateAndSendNotification = async (req, res) => {
  const repetitionId = req.params.id;
  const { lieu, DateRep, HeureDeb, HeureFin, membres, QrCode } = req.body;

  try {
    const updatedRehearsal = await Repetition.findOneAndUpdate(
      { _id: repetitionId },
      {
        lieu,
        DateRep,
        HeureDeb,
        HeureFin,
        membres,
        QrCode,
      },
      { new: true }
    );
    if (!updatedRehearsal) {
      return res.status(404).json({ message: "Rehearsal not found" });
    }

    sendNotificationForUpdatedRehearsal(updatedRehearsal);

    res.status(200).json(updatedRehearsal);
  } catch (error) {
    console.error("Error updating rehearsal:", error);
    res
      .status(500)
      .json({ message: "Internal server error updating rehearsal" });
  }
};

io.listen(5000);
const app = express();
app.use(express.json());
//app.use(upload.array());
app.put("/update/:id", updateAndSendNotification);
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

module.exports = app;
