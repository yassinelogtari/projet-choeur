const { io } = require("../utils/socket");
const { userSocketMap } = require("../utils/socket");
const Membre = require("../models/membreModel");

const sendNotificationMiddleware = async (req, res, next) => {
  console.log(io)
  try {
    const { userId, notificationMessage } = req.notificationData;

    const user = await Membre.findById(userId);
    console.log(user);
    console.log(user.statut);
    if (user.statut != "En congé") {
      console.log(userId);
      console.log(notificationMessage);
      const userSocketId = userSocketMap[userId];

      if (userSocketId) {
        io.to(userSocketId).emit("getNotification", notificationMessage);
      }

      const Newnotification = {
        notification: notificationMessage,
        read: false,
      };

      await Membre.findOneAndUpdate(
        { _id: userId },
        { $push: { notifications: Newnotification } },
        { new: true }
      );
    }

    next();
  } catch (error) {
    console.error("Error sending notification:", error);

    if (res && res.status && res.json) {
      res
        .status(500)
        .json({ message: "Internal server error sending notification" });
    }
  }
};



module.exports = sendNotificationMiddleware
