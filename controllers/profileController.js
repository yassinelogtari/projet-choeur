const express = require("express");
const router = express.Router();
const Member = require("../models/membreModel");
const Concert = require("../models/concertModel");
const Oeuvre = require("../models/oeuvreModel");
const Repetition = require("../models/repetitionModel");
const Saison=require('../models/saisonModel')
const sendEmail = require("../utils/sendEmail");

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
  const memberId = req.params.id;
  try {
    const member = await Member.findOne({ _id: memberId });
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
const fetchAbsences = async (memberId) => {
  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return { error: "Member not found" };
    }

    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return { error: "Current season not found" };
    }

    const concerts = await Concert.find({
      "_id": { $in: saisonCourante.concerts },
      "listeMembres.membre": memberId,
    });

    const repetitions = await Repetition.find({
      "_id": { $in: saisonCourante.repetitions },
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
    const totalAbsences = absences.concerts.length + absences.repetitions.length;
    return {
      number_of_concert_absences: absences.concerts.length,
      number_of_repetition_absences: absences.repetitions.length,
      total_absences: totalAbsences,
      absences,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};




const fetchHistoriqueStatus = async (req, res) => {
  try {
    const memberId = req.params.id;
    const membre = await Member.findById(memberId);

    if (!membre) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }

    return res.status(200).json({ historiqueStatut: membre.historiqueStatut });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique du statut du membre :', error);
    return res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};

const fetchNominatedMembers = async (req, res) => {
  

  try {
    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return res.status(404).json({ error: "Current season not found" });
    }
    const seuilNominations = saisonCourante.seuilnomination;
    const membresSaisonCourante = saisonCourante.membres.map(memberId => memberId.toString());

    const members = await Member.find({
      _id: { $in: membresSaisonCourante },
      role: 'choriste' 
    });


    if (!members || members.length === 0) {
      return res.status(404).json({ error: "Members not found" });
    }

    const nominatedMembers = [];

    for (const member of members) {
      const absencesResponse = await fetchAbsences(member._id.toString());

      if (absencesResponse && absencesResponse.total_absences < seuilNominations) {
        nominatedMembers.push({
          memberId: member._id,
          nom: member.nom,
          prenom: member.prenom,
          total_absences: absencesResponse.total_absences,
        });
        const emailSubject = 'Vous avez été nominé !';
        const emailText = `Cher ${member.nom}, vous avez été nominé pour votre excellente présence. Félicitations !`;
        await sendEmail(member.email, emailSubject, emailText);
      }
    }
    saisonCourante.nominatedMembers = nominatedMembers;
    await saisonCourante.save();
    res.json({ nominatedMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchEliminatedMembers = async (req, res) => {
  try {
    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return res.status(404).json({ error: "Current season not found" });
    }

    const seuilEliminations = saisonCourante.seuilelimination;
    

    const membresSaisonCourante = saisonCourante.membres.map(memberId => memberId.toString());

    const members = await Member.find({
      _id: { $in: membresSaisonCourante },
      role: 'choriste' 
    });

    if (!members || members.length === 0) {
      return res.status(404).json({ error: "Choristers not found" });
    }

    const eliminatedMembers = [];

    for (const member of members) {
      const absencesResponse = await fetchAbsences(member._id.toString());

      if (absencesResponse && absencesResponse.total_absences >= seuilEliminations) {
        eliminatedMembers.push({
          memberId: member._id,
          nom: member.nom,
          prenom: member.prenom,
          total_absences: absencesResponse.total_absences,
        });



        const emailSubject = 'Vous avez été éliminé !';
        const emailText = `Cher ${member.nom}, vous avez été éliminé en raison d'un dépassement du seuil d'absences. Merci pour votre participation.`;
        await sendEmail(member.email, emailSubject, emailText);
      }
    }
    saisonCourante.eliminatedMembers = eliminatedMembers;
    await saisonCourante.save();
    res.json({ eliminatedMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const eliminateChoristeForReason = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { reason } = req.body;

    const chorister = await Member.findById(memberId);

    if (!chorister || chorister.role !== 'choriste') {
      return res.status(404).json({ error: 'Chorister not found or not a chorister' });
    }

    chorister.statut = 'éliminé';

    await chorister.save();


    const emailSubject = 'Vous avez été éliminé !';
    const emailText = `Cher ${chorister.nom}, vous avez été éliminé pour une raison disciplinaire. Merci pour votre participation.`;
    await sendEmail(chorister.email, emailSubject, emailText);

    res.status(200).json({ success: true, message: 'Choriste éliminé pour une raison disciplinaire' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error eliminating choriste for disciplinary reason' });
  }
};




module.exports = {
  fetchHistory,
  getUser,
  updateNotificationField,
  fetchAbsences,fetchHistoriqueStatus,fetchNominatedMembers,fetchEliminatedMembers,eliminateChoristeForReason
  
};
