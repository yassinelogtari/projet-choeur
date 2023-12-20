const express = require("express");
const router = express.Router();
const Member = require("../models/membreModel");
const Concert = require("../models/concertModel");
const Oeuvre = require("../models/oeuvreModel");
const Repetition = require("../models/repetitionModel");

const fetchHistory = async (req, res) => {
  const memberId = req.params.id;
  const oeuvreName = req.query.oeuvre;

  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const concerts = await Concert.find({
      "listeMembres.membre": memberId,
      "listeMembres.presence": true,
    }).populate({
      path: "programme.oeuvre",
      model: Oeuvre,
    });

    const filteredConcerts = oeuvreName
      ? concerts.filter((concert) =>
          concert.programme.some((item) => item.oeuvre.titre === oeuvreName)
        )
      : concerts;

    const repetitions = await Repetition.find({
      "membres.member": memberId,
      "listeMembres.presence": true,
    });

    const response = {
      member_info: member,
      number_of_repetition: repetitions.length,
      number_of_concerts: filteredConcerts.length,
      concerts: filteredConcerts,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  const memberName = req.params.nom;
  try {
    const member = await Member.findOne({ nom: memberName });
    if (member) {
      res.json(member);
    } else res.status(201).json("member not found in the DB");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateNotificationField = async (req, res) => {
  const memberid = req.params.id;
  const notifs = req.body.notifications;

  try {
    const updatedMember = await Member.findOneAndUpdate(
      { _id: memberid },
      { $set: { notifications: notifs } },
      { new: true }
    );
    if (updatedMember) {
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedMember });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const fetchAbsences = async (req, res) => {
  const memberId = req.params.id;

  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const concerts = await Concert.find({
      "listeMembres.membre": memberId,
    });

    const repetitions = await Repetition.find({
      "membres.member": memberId,
    });

    const absences = {
      concerts: [],
      repetitions: [],
    };

  
    for (const concert of concerts) {
      if (concert.listeMembres) {
        const isAbsent = concert.listeMembres.some(
          (item) => item.membre && item.membre.toString() === memberId && !item.presence
        );

        if (isAbsent) {
          absences.concerts.push({
            concertId: concert._id,
            date: concert.date,
            lieu: concert.lieu,
          });
        }
      }
    }


    for (const repetition of repetitions) {
      if (repetition.listeMembres) {
        const isAbsent = repetition.listeMembres.some(
          (item) => item.member && item.member.toString() === memberId && !item.presence
        );

        if (isAbsent) {
          absences.repetitions.push({
            repetitionId: repetition._id,
            date: repetition.date,
          });
        }
      }
    }

    const response = {
      member_info: member,
      number_of_concert_absences: absences.concerts.length,
      number_of_repetition_absences: absences.repetitions.length,
      absences,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  fetchHistory,
  getUser,
  updateNotificationField,
  fetchAbsences,
  
};
