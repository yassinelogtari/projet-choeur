const qr = require("qrcode");
const Repetition = require("../models/repetitionModel");
const Cancert = require("../models/concertModel");

const addQrCodeToRepetition = async (req, res, next) => {
  try {
    const repetitionId = req.repetitionId;

    const confirmationLink = `http://localhost:3000/presence/repetition/${repetitionId}`;
    const qrCodeDataURL = await qr.toDataURL(confirmationLink);
    await Repetition.findByIdAndUpdate(
      repetitionId,
      { $set: { QrCode: qrCodeDataURL } },
      { new: true }
    );
    const updatedRepetition = await Repetition.findById(repetitionId, {
      "membres._id": 0,
    });
    return res.status(201).json({
      message: "Répétition crée avec succées",
      repetition: updatedRepetition,
    });
  } catch (error) {
    console.error("Error adding QR code to repetition:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addQrCodeToCancert = async (req, res, next) => {
  try {
    const cancertId = req.cancertId;

    const confirmationLink = `http://localhost:3000/presence/cancert/${cancertId}`;
    const qrCodeDataURL = await qr.toDataURL(confirmationLink);
    await Cancert.findByIdAndUpdate(
      cancertId,
      { $set: { QrCode: qrCodeDataURL } },
      { new: true }
    );
    const updatedCancert = await Cancert.findById(cancertId, {
      "listeMembres._id": 0,
    });
    return res.status(201).json({
      message: "Cancert created successfully",
      cancert: updatedCancert,
    });
  } catch (error) {
    console.error("Error adding QR code to cancert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addQrCodeToRepetition,
  addQrCodeToCancert,
};
