const Membre = require("../models/membreModel");
const { userSocketMap } = require("../utils/socket");
const sendNotificationMiddleware = require("../middlewares/sendNotificationMiddleware")

const modifierTessiture = async (req, res) => {
  try {
    const membre = await Membre.findOne({ _id: req.params.id });
    if (!membre) {
      return res.status(404).json({ message: "Membre non trouvé" });
    }
    if (membre.role === "choriste" || membre.role === "chef du pupitre") {
      const updatedMembre = await Membre.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      updatedMembre.password = undefined;
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
              notificationMessage: `${updatedMembre.prenom} ${updatedMembre.nom} a changé de tessiture pour devenir ${updatedMembre.pupitre}`,
            };

            await sendNotificationMiddleware(req, res, () => {});
          }
        });
      }

      updatedMembre.password = undefined;
      return res.status(200).json({
        model: updatedMembre,
        message: "Tessiture modifiée avec succés",
      });
    } else {
      return res.status(403).json({
        message:
          "Tessiture modifiée uniquement pour les choristes ou les chefs du pupitre ",
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const designerChefsDePupitre = async (req, res) => {
  try {
    const { pupitre, chef1Id, chef2Id } = req.body;

    await Membre.findByIdAndUpdate(chef1Id, { role: 'chef du pupitre' });

    await Membre.findByIdAndUpdate(chef2Id, { role: 'chef du pupitre' });

    res.status(200).json({ success: true, message: 'Chefs de pupitre désignés  avec succès' });
  } catch (error) {
    console.error('Erreur lors de la désignation des chefs de pupitre :', error);
    res.status(500).json({ error: 'Erreur interne du serveur lors de la désignation des chefs de pupitre' });
  }
};



module.exports = {
  modifierTessiture,designerChefsDePupitre,
};
