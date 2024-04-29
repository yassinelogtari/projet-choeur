const Candidats = require("../models/candidatModel");
const Auditions = require("../models/auditionModel");

const Saison = require("../models/saisonModel");

const Membre = require("../models/membreModel");
const Member = require('../models/membreModel'); 
const Season = require("../models/saisonModel");
const { userSocketMap } = require("../utils/socket");
const {sendNotificationMiddleware} = require("../middlewares/sendNotificationMiddleware")


const archiveSeason = async (req, res) => {
  try {
    const seasonId = req.params.seasonId;
    const season = await Saison.findById(seasonId);

    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }
    season.archivee = true;
    season.saisonCourante = false;

    await season.save();

    res
      .status(200)
      .json({ message: "Season archived successfully", data: season });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const createSaison = async (req, res) => {
  try {
    const { nom, dateDebut, dateFin } = req.body;
    const saisonPrecedente = await Saison.findOne({ saisonCourante: true });
    // if (saisonPrecedente) {
    //   const membresSaisonPrecedente = await Membre.find({
    //     _id: { $in: saisonPrecedente.membres },
    //   });

    //   for (const membrePrecedent of membresSaisonPrecedente) {
    //     membrePrecedent.historiqueStatut.push({
    //       saison: saisonPrecedente._id,
    //       status: membrePrecedent.statut,
    //     });

    //     await membrePrecedent.save();
    //   }
    // }
    await Saison.updateMany({}, { saisonCourante: false });

    const nouvelleSaison = new Saison({
      nom,
      dateDebut,
      dateFin,
      saisonCourante: true,
    });

    const saisonEnregistree = await nouvelleSaison.save();
    return res.status(201).json({ saison: saisonEnregistree });
  } catch (error) {
    console.error("Erreur lors de la création de la saison:", error);
    return res
      .status(500)
      .json({ erreur: "Erreur lors de la création de la saison" });
  }
};

const getSaisonCourante = async (req, res) => {
  try {
    const saisonCourante = await Saison.findOne({
      saisonCourante: true,
    }).populate("membres repetitions oeuvres concerts candidats auditions");
    if (!saisonCourante) {
      return res.status(404).json({ erreur: "Aucune saison courante trouvée" });
    }

    return res.status(200).json({ saison: saisonCourante });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la saison courante:",
      error
    );
    return res
      .status(500)
      .json({ erreur: "Erreur lors de la récupération de la saison courante" });
  }
};

const getSaisonsArchivees = async (req, res) => {
  try {
    const saisonsArchivees = await Saison.find({ archivee: true }).populate(
      "membres repetitions oeuvres concerts candidats auditions"
    );

    if (!saisonsArchivees || saisonsArchivees.length === 0) {
      return res.status(404).json({ erreur: "Aucune saison archivée trouvée" });
    }

    return res.status(200).json({ saisonsArchivees });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des saisons archivées:",
      error
    );
    return res
      .status(500)
      .json({ erreur: "Erreur lors de la récupération des saisons archivées" });
  }
};

const updateSaison = (req, res) => {
  Saison.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((saison) => {
      if (!saison) {
        res.status(404)({
          message: "saison not found ",
        });
      }
      res.status(200).json({
        model: saison,
        message: "saison updated",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "problème d'extraction ",
      });
    });
};

const getSaisonByid = async (req, res) => {
  try {
    const saisonId = req.params.id;
    const saison = await Saison.findById(saisonId)
      .populate("membres")
      .populate({
        path: "repetitions",

        populate: [
          { path: "membres.member", model: "Membre" },
          { path: "concert", model: "Concert" },
        ],
      })
      .populate({
        path: "concerts",
        populate: [
          { path: "listeMembres.membre", model: "Membre" },
          { path: "programme.oeuvre", model: "Oeuvre" },
        ],
      })
      .populate("oeuvres")
      .populate({
        path: "auditions",
        populate: [{ path: "candidats", model: "candidat" }],
      })
      .populate("candidats");

    if (!saison) {
      return res.status(404).json({ erreur: "Saison non trouvée" });
    }
    return res.status(200).json({ saison });
  } catch (error) {
    console.error("Erreur lors de la récupération de la saison:", error);
    return res
      .status(500)
      .json({ erreur: "Erreur lors de la récupération de la saison" });
  }
};
// const updateStatus = async (req, res) => {
//   try {
//     const saisonCourante = await Saison.findOne({ saisonCourante: true });

//     if (!saisonCourante) {
//       console.error("No current season found");
//       return res.status(404).json({ error: "No current season found" });
//     }

//     const membres = await Membre.find({ _id: { $in: saisonCourante.membres } });

//     for (const membre of membres) {
//       const isMemberInSaison2018 = saisonCourante.membres.some((saisonMembre) =>
//         saisonMembre.equals(membre._id)
//       );

//       if (isMemberInSaison2018) {
//         membre.statut = "Vétéran";
//       }
//       const totalSeasons = membre.historiqueStatut.length;

//       if (totalSeasons === 0) {
//         membre.statut = "Junior";
//       } else if (totalSeasons === 1) {
//         membre.statut = "Choriste";
//       } else if (totalSeasons === 2) {
//         membre.statut = "Sénior";
//       }

//       const updatedMembre = await membre.save();
//       if (updatedMembre) {
//         const membreSocketId = userSocketMap[updatedMembre._id];
//         if (membreSocketId) {
//           req.notificationData = {
//             userId: updatedMembre._id,
//             notificationMessage: `Votre statut a été changé en ${updatedMembre.statut}.`,
//           };
//           sendNotificationMiddleware(req, res, () => {});
//         }
//         const chefPupitreByUpdatedMemberUsers = await Membre.find({
//           role: "chef du pupitre",
//           pupitre: updatedMembre.pupitre,
//         });

//         chefPupitreByUpdatedMemberUsers.forEach(async (chefPupitreUser) => {
//           const chefPupitreSocketId = userSocketMap[chefPupitreUser._id];

//           if (chefPupitreSocketId) {
//             req.notificationData = {
//               userId: chefPupitreUser._id,
//               notificationMessage: `${updatedMembre.prenom} ${updatedMembre.nom} a changé son statut a ${updatedMembre.statut}.`,
//             };

//             sendNotificationMiddleware(req, res, () => {});
//           }
//         });
//       }
//     }

//     console.log("Status updated successfully");
//     return res.status(200).json({ message: "Status updated successfully" });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

const designerChefsDePupitre = async (req, res) => {
  try {
    const { pupitre, membre1Id, membre2Id } = req.body;

    const currentSeason = await Saison.findOne({ saisonCourante: true });

    if (!currentSeason) {
      return res.status(400).json({ error: "No current season found." });
    }

    const membersExistInCurrentSeason = currentSeason.membres.some(
      (memberId) =>
        memberId.toString() === membre1Id || memberId.toString() === membre2Id
    );

    if (!membersExistInCurrentSeason) {
      return res.status(400).json({
        error: "Specified members do not exist in the current season.",
      });
    }

    const existingPupitreLeaders = await Membre.find({
      pupitre,
      role: "chef du pupitre",
    });

    if (existingPupitreLeaders.length >= 2) {
      return res.status(400).json({
        error: `There are already two members designated as 'chef du pupitre' for the pupitre ${pupitre}.`,
      });
    }

    const membersToUpdate = await Membre.find({
      _id: { $in: [membre1Id, membre2Id] },
    });

    for (const member of membersToUpdate) {
      member.role = "chef du pupitre";
      await member.save();
    }

    res.status(200).json({ message: "Roles updated successfully." });
  } catch (error) {
    console.error('Error updating roles to "chef de pupitre":', error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const quitterChoeur = async (req, res) => {
  const memberId = req.params.id;

  try {
    const membre = await Membre.findById(memberId);
    if (!membre) {
      return res.status(404).json({ error: "Membre not found" });
    }

    const saisonCourante = await Saison.findOne({ saisonCourante: true });
    if (!saisonCourante || !saisonCourante.membres.includes(memberId)) {
      return res
        .status(400)
        .json({ error: "Le membre ne fait pas partie de la saison courante" });
    }

    membre.statut = "Inactif";
    const updatedMembre = await membre.save();

    if (updatedMembre) {
      const chefPupitreByUpdatedMemberUsers = await Membre.find({
        role: "chef du pupitre",
        pupitre: updatedMembre.pupitre,
      });

      chefPupitreByUpdatedMemberUsers.forEach(async (chefPupitreUser) => {
        const chefPupitreSocketId = userSocketMap[chefPupitreUser._id];

        if (chefPupitreSocketId) {
          req.notificationData = {
            userId: chefPupitreUser._id,
            notificationMessage: `${updatedMembre.prenom} ${updatedMembre.nom} a changé son statut a Inactif.`,
          };

          sendNotificationMiddleware(req, res, () => {});
        }
      });
    }

    console.log("Membre a quitté avec succès");
    return res.status(200).json({ message: "Membre a quitté avec succès" });
  } catch (error) {
    console.error("Erreur lors de la sortie du membre :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
const updateSeuilForCurrentSeason = async (req, res) => {
  try {
    const { seuilType, newSeuilValue } = req.body;

    if (
      !seuilType ||
      (seuilType !== "nomination" && seuilType !== "elimination")
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Type de seuil non valide" });
    }

    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return res
        .status(404)
        .json({ success: false, message: "Saison courante introuvable" });
    }

    if (seuilType === "nomination") {
      saisonCourante.seuilnomination = newSeuilValue;
    } else {
      saisonCourante.seuilelimination = newSeuilValue;
    }

    await saisonCourante.save();

    console.log(
      `Seuil de ${seuilType} mis à jour pour la saison courante : ${newSeuilValue}`
    );

    return res.status(200).json({
      success: true,
      message: `Seuil de ${seuilType} mis à jour pour la saison courante`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du seuil pour la saison courante",
    });
  }
};
const consulterHistoriqueStatutMembre = async (req, res) => {
  try {
    const memberId = req.params.id;
    const membre = await Membre.findById(memberId);

    if (!membre) {
      return res.status(404).json({ success: false, error: "Member not found" });
    }

    const dateIntegrationMember = new Date(membre.createdAt);
    const currentSeason = await Season.findOne().sort({ dateDebut: -1 });
    const historicalStatus = [];

    for (
      let year = dateIntegrationMember.getFullYear();
      year <= currentSeason.dateDebut.getFullYear();
      year++
    ) {
      let statut = "Inactif";
      const yearsSinceIntegration = year - dateIntegrationMember.getFullYear();

      if (yearsSinceIntegration === 0) {
        statut = "Choriste Junior";
      } else if (yearsSinceIntegration === 1) {
        statut = "Choriste";
      } else if (yearsSinceIntegration >= 2) {
        statut = "Senior";
      }

      if (dateIntegrationMember.getFullYear() === 2018 && yearsSinceIntegration >= 0) {
        statut = "Vétéran";
      }

      historicalStatus.push({
        saison: year,
        statut: statut,
      });
    }

    const oldStatut = membre.statut;
    membre.statut = historicalStatus[historicalStatus.length - 1].statut;
    membre.historiqueStatut = historicalStatus;

    await membre.save();

    if (oldStatut !== membre.statut) {
      console.log(`Status changed from ${oldStatut} to ${membre.statut} for member ${membre.prenom} ${membre.nom}`);

      req.notificationData = {
        userId: membre._id,
        notificationMessage: `Votre statut a été changé en ${membre.statut}.`,
      };
      await sendNotification(req);
      const chefsPupitre = await Membre.find({
        role: "chef du pupitre",
        pupitre: membre.pupitre,
      });
      chefsPupitre.forEach((chefPupitre) => {
        console.log(`Checking notification for chef de pupitre: ${chefPupitre.prenom} ${chefPupitre.nom}`);
        const chefPupitreSocketId = userSocketMap[chefPupitre._id];
        if (chefPupitreSocketId) {
          console.log(`Sending notification to chef de pupitre with Socket ID: ${chefPupitreSocketId}`);
          req.notificationData = {
            userId: chefPupitre._id,
            notificationMessage: `${membre.prenom} ${membre.nom} a changé son statut à ${membre.statut}.`,
          };
          sendNotificationMiddleware(req, res, () => {
            console.log(`Notification successfully sent to ${chefPupitre.prenom} ${chefPupitre.nom} about status change.`);
          }, (err) => {
            if (err) {
              console.error(`Failed to send notification to ${chefPupitre.prenom} ${chefPupitre.nom}: ${err.message}`);
            }
          });
        } else {
          console.log(`No socket ID found for chef de pupitre: ${chefPupitre.prenom} ${chefPupitre.nom}`);
        }
      });
      
    }

    res.status(200).json({
      success: true,
      message: `Historique - Statut de : ${membre.nom} ${membre.prenom}`,
      data: historicalStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Erreur lors de l'enregistrement de l'historique",
    });
  }
};

async function sendNotification(req) {
  try {
    
    console.log(`Notification successfully sent to user ID ${req.notificationData.userId} about status change: ${req.notificationData.notificationMessage}`);
  } catch (err) {
    console.error(`Failed to send notification to user ID ${req.notificationData.userId}: ${err.message}`);
  }
}







module.exports = {
  archiveSeason,
  createSaison,
  getSaisonByid,
  getSaisonsArchivees,
  getSaisonCourante,
  updateSaison,
  /*updateStatus*/
  designerChefsDePupitre,
  quitterChoeur,
  updateSeuilForCurrentSeason,consulterHistoriqueStatutMembre

};
