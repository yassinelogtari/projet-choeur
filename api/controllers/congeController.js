const Conge = require("../models/congeModel");
const Membre = require("../models/membreModel");
const { userSocketMap } = require("../utils/socket");
const {
  sendNotificationMiddleware,
} = require("../middlewares/sendNotificationMiddleware");
const {
  sendNotificationMiddlewareConge,
} = require("../middlewares/sendNotificationMiddleware");

const addQrCodeToConcert = require("../middlewares/createQrCodeMiddleware");

const insertConge = async (req, res) => {
  try {
    const memberId = req.auth.membreId;
    const { dateDebut, dateFin, raison } = req.body;
    const membre = await Membre.findById(memberId);
    if (!membre) {
      return res.status(404).json({ message: "Membre non trouvé" });
    } else {
      if (membre.role == "choriste") {
        const congeExist = await Conge.findOne({
          membre: memberId,
          $or: [
            {
              dateDebut: { $lte: dateFin },
              dateFin: { $gte: dateDebut },
            },
          ],
        });
        if (congeExist) {
          return res
            .status(400)
            .json({ message: "Congé déjà déclaré pour cette période" });
        } else {
          const conge = new Conge({
            membre: memberId,
            dateDebut,
            dateFin,
            raison,
          });
          await conge.save();
          const administrateurs = await Membre.find({ role: "admin" });
          administrateurs.forEach(async (admin) => {
            const adminSocketId = userSocketMap[admin._id];
            if (adminSocketId) {
              req.notificationData = {
                userId: admin._id,
                notificationMessage: `${membre.prenom} ${
                  membre.nom
                } a déclaré un congé du ${conge.dateDebut.toLocaleDateString()} au ${conge.dateFin.toLocaleDateString()} en raison de ${
                  conge.raison
                }.`,
              };
              await sendNotificationMiddleware(req, res, () => {});
            }
          });
          return res
            .status(201)
            .json({ message: "Congé sauvegardé avec succées", conge: conge });
        }
      } else {
        res.status(404).json({
          message: "Vous n'avez pas la permission de déclarer un congé",
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const validerConge = async (req, res) => {
  try {
    const { id: congeId } = req.params;

    const conge = await Conge.findByIdAndUpdate(
      congeId,
      { valide: true },
      { new: true }
    );

    if (!conge) {
      return res.status(404).json({ message: "Congé non trouvé" });
    }

    const { membre, dateDebut, dateFin } = conge;

    const currentDate = new Date();
    if (currentDate <= dateDebut && currentDate <= dateFin) {
      const updatedMembre = await Membre.findOneAndUpdate(
        { _id: membre, statut: { $ne: "En congé" } },
        { statut: "En congé" },
        { new: true }
      );

      if (currentDate > dateFin) {
        const originalMembre = await Membre.findById(membre);
        await Membre.findByIdAndUpdate(membre, {
          statut: originalMembre.statut,
        });
      }

      if (updatedMembre) {
        const membreSocketId = userSocketMap[updatedMembre._id];

        req.notificationData = {
          userId: updatedMembre._id,
          notificationMessage: `Votre statut a été changé en "En congé".`,
        };
        sendNotificationMiddlewareConge(req, res, () => {});

        updatedMembre.statut = "En congé";
        const chefPupitreByUpdatedMemberUsers = await Membre.find({
          role: "chef du pupitre",
          pupitre: updatedMembre.pupitre,
        });

        chefPupitreByUpdatedMemberUsers.forEach(async (chefPupitreUser) => {
          const chefPupitreSocketId = userSocketMap[chefPupitreUser._id];

          if (chefPupitreSocketId) {
            req.notificationData = {
              userId: chefPupitreUser._id,
              notificationMessage: `${updatedMembre.prenom} ${updatedMembre.nom} a changé son statut a "En congé".`,
            };

            sendNotificationMiddleware(req, res, () => {});
          }
        });
      }
    }

    return res.status(200).json({ message: "Congé validé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllConge = async (req, res) => {
  try {
    const congesNonValides = await Conge.find({ valide: false }).populate(
      "membre"
    );
    res.status(200).json({ success: true, conges: congesNonValides });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des congés non valides.",
    });
  }
};

const deleteConge = async (req, res) => {
  try {
    const { id: congeId } = req.params;

    const deletedConge = await Conge.findByIdAndDelete(congeId);

    if (!deletedConge) {
      return res.status(404).json({ message: "Congé non trouvé" });
    }

    res.status(200).json({ message: "Congé supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du congé : ", error);
    res.status(500).json({ error: "Erreur lors de la suppression du congé" });
  }
};

module.exports = {
  insertConge,
  validerConge,
  getAllConge,
  deleteConge,
};
