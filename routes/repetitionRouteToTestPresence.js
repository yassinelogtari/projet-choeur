const express = require("express");
const router = express.Router();
const Repetition = require("../models/repetitionModel");
const addQrCodeToRepetition = require("../middlewares/createQrCodeMiddleware");

router.post("/create", async (req, res) => {
  try {
    const newRepetition = new Repetition(req.body);
    await newRepetition.save();
    req.repetitionId = newRepetition._id;
    await addQrCodeToRepetition.addQrCodeToRepetition(req, res, () => {});
  } catch (error) {
    console.error("Error creating repetition:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
