const express = require("express");
const router = express.Router();
const Member = require("../models/membreModel");
const Concert = require("../models/concertModel");
const Oeuvre = require("../models/oeuvreModel");
const Repetition = require("../models/repetitionModel");
const Saison = require("../models/saisonModel");
const sendEmail = require("../utils/sendEmail");
const Membre = require("../models/membreModel");

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
      _id: { $in: saisonCourante.concerts },
      "listeMembres.membre": memberId,
    });

    const repetitions = await Repetition.find({
      _id: { $in: saisonCourante.repetitions },
      "membres.member": memberId,
    });

    const absences = {
      concerts: [],
      repetitions: [],
    };

    for (const concert of concerts) {
      if (concert.listeMembres) {
        const isAbsent = concert.listeMembres.some(
          (item) =>
            item.membre && item.membre.toString() === memberId && !item.presence
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
          (item) =>
            item.member && item.member.toString() === memberId && !item.presence
        );

        if (isAbsent) {
          absences.repetitions.push({
            repetitionId: repetition._id,
            date: repetition.date,
          });
        }
      }
    }
    const totalAbsences =
      absences.concerts.length + absences.repetitions.length;
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
      return res.status(404).json({ message: "Membre non trouvé" });
    }

    return res.status(200).json({ historiqueStatut: membre.historiqueStatut });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'historique du statut du membre :",
      error
    );
    return res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

// const fetchNominatedMembers = async (req, res) => {

//   try {
//     const saisonCourante = await Saison.findOne({ saisonCourante: true });

//     if (!saisonCourante) {
//       return res.status(404).json({ error: "Current season not found" });
//     }
//     const seuilNominations = saisonCourante.seuilnomination;
//     const membresSaisonCourante = saisonCourante.membres.map(memberId => memberId.toString());

//     const members = await Member.find({
//       _id: { $in: membresSaisonCourante },
//       role: 'choriste'
//     });

//     if (!members || members.length === 0) {
//       return res.status(404).json({ error: "Members not found" });
//     }

//     const nominatedMembers = [];

//     for (const member of members) {
//       const absencesResponse = await fetchAbsences(member._id.toString());

//       if (absencesResponse && absencesResponse.total_absences < seuilNominations) {
//         nominatedMembers.push({
//           memberId: member._id,
//           nom: member.nom,
//           prenom: member.prenom,
//           total_absences: absencesResponse.total_absences,
//         });
//         const emailSubject = 'Vous avez été nominé !';
//         const emailText = `Cher ${member.nom}, vous avez été nominé pour votre excellente présence. Félicitations !`;
//         await sendEmail(member.email, emailSubject, emailText);
//       }
//     }
//     saisonCourante.nominatedMembers = nominatedMembers;
//     await saisonCourante.save();
//     res.json({ nominatedMembers });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const fetchEliminatedMembers = async (req, res) => {
//   try {
//     const saisonCourante = await Saison.findOne({ saisonCourante: true });

//     if (!saisonCourante) {
//       return res.status(404).json({ error: "Current season not found" });
//     }

//     const seuilEliminations = saisonCourante.seuilelimination;

//     const membresSaisonCourante = saisonCourante.membres.map(memberId => memberId.toString());

//     const members = await Member.find({
//       _id: { $in: membresSaisonCourante },
//       role: 'choriste'
//     });

//     if (!members || members.length === 0) {
//       return res.status(404).json({ error: "Choristers not found" });
//     }

//     const eliminatedMembers = [];

//     for (const member of members) {
//       const absencesResponse = await fetchAbsences(member._id.toString());

//       if (absencesResponse && absencesResponse.total_absences >= seuilEliminations) {
//         eliminatedMembers.push({
//           memberId: member._id,
//           nom: member.nom,
//           prenom: member.prenom,
//           total_absences: absencesResponse.total_absences,
//         });

//         const emailSubject = 'Vous avez été éliminé !';
//         const emailText = `Cher ${member.nom}, vous avez été éliminé en raison d'un dépassement du seuil d'absences. Merci pour votre participation.`;
//         await sendEmail(member.email, emailSubject, emailText);
//         await Member.deleteOne({ _id: member._id });
//       }
//     }
//     saisonCourante.eliminatedMembers = eliminatedMembers;
//     await saisonCourante.save();
//     res.json({ eliminatedMembers });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
const eliminateChoristeForReason = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { reason } = req.body;

    const chorister = await Member.findById(memberId);

    if (!chorister || chorister.role !== "choriste") {
      return res
        .status(404)
        .json({ error: "Chorister not found or not a chorister" });
    }

    await chorister.save();
    chorister.eliminationReason = reason;

    await chorister.save();

    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return res.status(404).json({ error: "Current season not found" });
    }

    const eliminatedMember = {
      memberId: chorister._id,
      nom: chorister.nom,
      prenom: chorister.prenom,
      total_absences: chorister.total_absences,
      eliminationReason: reason,
    };

    saisonCourante.eliminatedMembers.push(eliminatedMember);
    await saisonCourante.save();

    const emailSubject = "Vous avez été éliminé !";
    const emailText = `Cher ${chorister.nom}, vous avez été éliminé pour une raison disciplinaire. Merci pour votre participation.`;
    await sendEmail(chorister.email, emailSubject, emailText);

    res.status(200).json({
      success: true,
      message: "Choriste éliminé pour une raison disciplinaire",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error eliminating choriste for disciplinary reason",
    });
  }
};

const nominateMemberById = async (req, res) => {
  const memberId = req.params.memberId;

  try {
    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return res.status(404).json({ error: "Current season not found" });
    }

    const seuilNominations = saisonCourante.seuilnomination;
    const member = await Member.findOne({
      _id: memberId,
      role: "choriste",
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const absencesResponse = await fetchAbsences(member._id.toString());

    if (
      !absencesResponse ||
      absencesResponse.total_absences >= seuilNominations
    ) {
      return res
        .status(400)
        .json({ error: "Member does not meet nomination criteria" });
    }

    // Initialise nominatedMembers if it does not exist
    if (!saisonCourante.nominatedMembers) {
      saisonCourante.nominatedMembers = [];
    }

    // Check if member is already nominated
    const isAlreadyNominated = saisonCourante.nominatedMembers.some(
      (nominee) => nominee.memberId.toString() === memberId
    );

    if (isAlreadyNominated) {
      return res.status(409).json({ error: "Member is already nominated" });
    }

    // Add the member to nominatedMembers
    saisonCourante.nominatedMembers.push({
      memberId: member._id,
      nom: member.nom,
      prenom: member.prenom,
      total_absences: absencesResponse.total_absences,
    });

    // Save the updated saisonCourante
    await saisonCourante.save();

    // Send an email notification
    const emailSubject = "Vous avez été nominé !";
    const emailText = `Cher ${member.nom}, vous avez été nominé pour votre excellente présence. Félicitations !`;
    await sendEmail(member.email, emailSubject, emailText);

    res.json({
      message: "Member successfully nominated",
      nominatedMember: member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const eliminateMemberById = async (req, res) => {
  const memberId = req.params.memberId;

  try {
    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return res.status(404).json({ error: "Current season not found" });
    }

    const seuilNominations = saisonCourante.seuilelimination;
    const member = await Member.findOne({
      _id: memberId,
      role: "choriste",
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const absencesResponse = await fetchAbsences(member._id.toString());

    if (
      !absencesResponse ||
      absencesResponse.total_absences >= seuilNominations
    ) {
      return res
        .status(400)
        .json({ error: "Member does not meet nomination criteria" });
    }

    if (!saisonCourante.nominatedMembers) {
      saisonCourante.nominatedMembers = [];
    }

    const isAlreadyEliminated = saisonCourante.eliminatedMembers.some(
      (eliminee) => eliminee.memberId.toString() === memberId
    );

    if (isAlreadyEliminated) {
      return res.status(409).json({ error: "Member is already eliminated" });
    }

    saisonCourante.eliminatedMembers.push({
      memberId: member._id,
      nom: member.nom,
      prenom: member.prenom,
      total_absences: absencesResponse.total_absences,
    });

    await saisonCourante.save();

    const emailSubject = "Vous avez été éliminé !";
    const emailText = `Cher ${member.nom}, vous avez été éliminé . Merci pour votre participation.`;
    await sendEmail(member.email, emailSubject, emailText);

    res.json({
      message: "Member successfully eliminated",
      eliminatedMember: member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const listNominatedMembers = async (req, res) => {
  try {
    const saisonCourante = await Saison.findOne({
      saisonCourante: true,
    }).populate("nominatedMembers.memberId", "nom prenom");

    if (!saisonCourante) {
      return res.status(404).json({ error: "Current season not found" });
    }

    if (
      !saisonCourante.nominatedMembers ||
      saisonCourante.nominatedMembers.length === 0
    ) {
      return res.status(404).json({ message: "No nominated members found" });
    }

    res.json({ nominatedMembers: saisonCourante.nominatedMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const listEliminatedMembers = async (req, res) => {
  try {
    const saisonCourante = await Saison.findOne({
      saisonCourante: true,
    }).populate("eliminatedMembers.memberId", "nom prenom");

    if (!saisonCourante) {
      return res.status(404).json({ error: "Current season not found" });
    }

    if (
      !saisonCourante.eliminatedMembers ||
      saisonCourante.eliminatedMembers.length === 0
    ) {
      return res.status(404).json({ message: "No eliminated members found" });
    }

    res.json({ eliminatedMembers: saisonCourante.eliminatedMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const consulterProfil = async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await Member.findById(memberId);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }

    const saison = await Saison.findOne();
    const listeElimines = saison.eliminatedMembers.map((elimine) =>
      elimine.memberId.toString()
    );
    const listeNomines = saison.nominatedMembers.map((nomine) =>
      nomine.memberId.toString()
    );

    const isEliminated = listeElimines.includes(memberId);
    const isNominated = listeNomines.includes(memberId);

    const historiqueStatut = member.historiqueStatut;

    const responseData = {
      member: member.toObject(),
      historiqueStatut: historiqueStatut,
      isEliminated: isEliminated,
      isNominated: isNominated,
      listeNomines: listeNomines,
      listeElimines: listeElimines,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
const fetchAllAbsences = async () => {
  try {
    const saisonCourante = await Saison.findOne({ saisonCourante: true });
    if (!saisonCourante) {
      console.log("No current season found");
      return { error: "Current season not found" };
    }

    const concerts = await Concert.find({
      _id: { $in: saisonCourante.concerts },
    });
    const repetitions = await Repetition.find({
      _id: { $in: saisonCourante.repetitions },
    });

    console.log("Concerts found: ", concerts.length);
    console.log("Repetitions found: ", repetitions.length);

    let absencesByMember = {};

    // Récupération des membres choristes uniquement
    const choristes = await Membre.find({ role: "choriste" });

    // Création de l'objet absencesByMember avec les membres choristes
    choristes.forEach((member) => {
      absencesByMember[member._id.toString()] = {
        nom: member.nom,
        prenom: member.prenom,
        concerts: [],
        repetitions: [],
        total_absences: 0,
      };
    });

    // Traitement des absences pour les concerts
    for (const concert of concerts) {
      if (concert.listeMembres && Array.isArray(concert.listeMembres)) {
        concert.listeMembres.forEach((member) => {
          if (
            member &&
            member.membre &&
            member.presence === false &&
            absencesByMember[member.membre.toString()]
          ) {
            absencesByMember[member.membre.toString()].concerts.push({
              concertId: concert._id,
              date: concert.date,
              lieu: concert.lieu,
            });
            absencesByMember[member.membre.toString()].total_absences++;
          }
        });
      }
    }

    // Traitement des absences pour les répétitions
    for (const repetition of repetitions) {
      if (repetition.membres && Array.isArray(repetition.membres)) {
        repetition.membres.forEach((member) => {
          if (
            member &&
            member.membre &&
            member.presence === false &&
            absencesByMember[member.membre.toString()]
          ) {
            absencesByMember[member.membre.toString()].repetitions.push({
              repetitionId: repetition._id,
              date: repetition.date,
            });
            absencesByMember[member.membre.toString()].total_absences++;
          }
        });
      }
    }

    console.log(
      "Absences by member calculated: ",
      Object.keys(absencesByMember).length
    );

    return { absencesByMember };
  } catch (error) {
    console.error("Error in fetchAllAbsences:", error);
    throw new Error("Internal Server Error");
  }
};

module.exports = { fetchAllAbsences };

const consulterStatutMembre = async (req, res) => {
  try {
    const membre = await Member.findById(req.params.id);
    if (!membre) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.status(200).json({
      memberId: membre._id,
      nom: membre.nom,
      prenom: membre.prenom,
      niveauExperience: membre.niveauExperience,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchHistory,
  getUser,
  updateNotificationField,
  fetchAbsences,
  fetchHistoriqueStatus /*,fetchNominatedMembers,fetchEliminatedMembers*/,
  eliminateChoristeForReason,
  nominateMemberById,
  eliminateMemberById,
  listNominatedMembers,
  listEliminatedMembers,
  consulterProfil,
  fetchAllAbsences,
  consulterStatutMembre,
};
