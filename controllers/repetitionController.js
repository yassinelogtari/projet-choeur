const express = require("express");
const router = express.Router();
const Repetition = require("../models/repetitionModel");
const addQrCodeToRepetition = require("../middlewares/createQrCodeMiddleware");

const createRepetition = async (req, res) => {
  try {
    const newRepetition = new Repetition(req.body);
    await newRepetition.save();
    req.repetitionId = newRepetition._id;
    await addQrCodeToRepetition.addQrCodeToRepetition(req, res, () => {});
  } catch (error) {
    console.error("Error creating repetition:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const listPresenceByPupitre = async (req, res) => {
  try {
    const { repetitionId } = req.params;
    const { pupitre } = req.query;

    const repetition = await Repetition.findById(repetitionId).populate('membres.member');

    const membresPupitre = repetition.membres.filter((membre) => membre.member.role === 'choriste' && membre.member.pupitre === pupitre);

  
    const presenceList = membresPupitre.map((membre) => {
      return {
        nom: membre.member.nom,
        prenom: membre.member.prenom,
        presence: membre.presence,
      };
    });

    res.json({ presenceList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error:error });
  }
};

module.exports = {createRepetition,listPresenceByPupitre};
