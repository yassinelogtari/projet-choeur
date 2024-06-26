const Membre = require("../models/membreModel");
const { userSocketMap } = require("../utils/socket");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generatePassword = require("generate-password");
const {
  sendNotificationMiddleware,
} = require("../middlewares/sendNotificationMiddleware");
const sendEmail = require("../utils/sendEmail");
const Saison = require("../models/saisonModel");

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
const register = async (req, res) => {
  try {
    const passAleatoire = generatePassword.generate({
      length: 12,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
    });
    const hashedPassword = await bcrypt.hash(passAleatoire, 10);
    const membre = new Membre({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: hashedPassword,
      sexe: null,
      dateNaissance: null,
      nationalite: null,
      CIN: null,
      taille: null,
      situationPerso: null,
      connaissanceMusic: null,
      activite: null,
      telephone: null,
      role: req.body.role,
      statut: null,
      pupitre: null,
    });
    if (
      membre.nom === "" ||
      membre.prenom === "" ||
      membre.email === "" ||
      membre.role === ""
    ) {
      return res
        .status(400)
        .json({ message: "Vous devez remplir tous les champs" });
    }
    if (membre.role === "chef du pupitre") {
      if (req.body.pupitre === "") {
        return res.status(400).json({
          message: "Vous devez spécifier le pupitre pour le chef du pupitre",
        });
      } else {
        membre.pupitre = req.body.pupitre;
      }
    }
    const response = await membre.save();
    const corpsEmail = `Bonjour ${membre.prenom} ${membre.nom},<br>
    Pour accéder à votre compte,voici vos coordonnées.<br>
    Email: ${membre.email} <br>
    Mot de passe: ${passAleatoire} <br> 
    Cordialement`;
    await sendEmail(membre.email, "Informations d'inscriptions", corpsEmail);

    const newMembre = response.toObject();
    const currentSaison = await Saison.findOne({ saisonCourante: true });
    if (currentSaison) {
      currentSaison.membres.push(newMembre._id);
      await currentSaison.save();
    }
    delete newMembre.password;

    res.status(201).json({
      message: "Membre cré avec succés ",
      membre: newMembre,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const membre = await Membre.findOne({ email: req.body.email });

    if (!membre) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrectes" });
    }
    const valid = await bcrypt.compare(req.body.password, membre.password);
    if (!valid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrectes" });
    }
    if (membre.isBanned) {
      return res.status(403).json({
        message:
          "Vous êtes banni. Contactez l'administrateur pour plus d'informations.",
      });
    }
    const token = jwt.sign(
      { membreId: membre._id, role: membre.role },
      "RANDOM_TOKEN",
      {
        expiresIn: "1y",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







const getMemberById = async (req, res) => {
  try {
    const membre = await Membre.findOne({ _id: req.params.id });
    if (!membre) {
      return res.status(404).json({ message: "Membre non trouvé" });
    } else {
      membre.password = undefined;
      res.status(200).json({
        message: "Membre trouvé",
        model: membre,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllMembers = async (req, res) => {
  try {
    const membres = await Membre.find();
    membres.forEach((membre) => {
      membre.password = undefined;
    });
    res.status(200).json({
      message: "Données extraites avec succès",
      model: membres,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMembersByPupitre = async (req, res) => {
  try {
    const saisonCourante = await Saison.findOne({
      saisonCourante: true,
    }).populate("membres repetitions oeuvres concerts candidats auditions");

    if (!saisonCourante) {
      return res.status(404).json({ erreur: "Aucune saison courante trouvée" });
    }
    console.log("pupitre choisi : ", req.body.pupitre);
    // Filtrer les membres de la saison courante en fonction de la tessiture vocale et du rôle de choriste
    const PupitreMembers = saisonCourante.membres.filter((membre) => {
      return membre.pupitre === req.body.pupitre && membre.role === "choriste";
    });

    if (PupitreMembers.length === 0) {
      return res
        .status(404)
        .json({ erreur: "Aucun membre trouvé pour ce pupitre" });
    }

    return res.status(200).json({ membres: PupitreMembers });
  } catch (error) {
    console.error("Erreur lors de la récupération des choristes:", error);
    return res
      .status(500)
      .json({ erreur: "Erreur lors de la récupération des choristes " });
  }
};

const deleteMember = async (req, res) => {
  try {
    const membre = await Membre.findByIdAndDelete({ _id: req.params.id });
    if (!membre) {
      return res.status(404).json({ message: "Membre non trouvé" });
    } else {
      res.status(200).json({
        message: "Membre supprimé avec succés",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateMember = async (req, res) => {
  try {
    const oldmembre = await Membre.findOne({ _id: req.params.id });
    const membre = await Membre.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!membre) {
      return res.status(404).json({ message: "Membre non trouvé" });
    } else {
      membre.password = undefined;
      console.log(oldmembre.pupitre);
      console.log(membre.pupitre);
      console.log(oldmembre.statut);
      console.log(membre.statut);

      if (
        membre &&
        oldmembre.pupitre != membre.pupitre &&
        oldmembre.statut != membre.statut
      ) {
        const chefPupitreByUpdatedMemberUsers = await Membre.find({
          role: "chef du pupitre",
          pupitre: membre.pupitre,
        });

        chefPupitreByUpdatedMemberUsers.forEach(async (chefPupitreUser) => {
          const chefPupitreSocketId = userSocketMap[chefPupitreUser._id];

          if (chefPupitreSocketId) {
            req.notificationData = {
              userId: chefPupitreUser._id,
              notificationMessage: `${membre.prenom} ${membre.nom} a changé de tessiture pour devenir ${membre.pupitre} et son statut a ${membre.statut} `,
            };

            await sendNotificationMiddleware(req, res, () => {});
          }
        });
      } else if (membre && oldmembre.pupitre != membre.pupitre) {
        const chefPupitreByUpdatedMemberUsers = await Membre.find({
          role: "chef du pupitre",
          pupitre: membre.pupitre,
        });

        chefPupitreByUpdatedMemberUsers.forEach(async (chefPupitreUser) => {
          const chefPupitreSocketId = userSocketMap[chefPupitreUser._id];

          if (chefPupitreSocketId) {
            req.notificationData = {
              userId: chefPupitreUser._id,
              notificationMessage: `${membre.prenom} ${membre.nom} a changé de tessiture pour devenir ${membre.pupitre}`,
            };

            await sendNotificationMiddleware(req, res, () => {});
          }
        });
      } else if (membre && oldmembre.statut != membre.statut) {
        const chefPupitreByUpdatedMemberUsers = await Membre.find({
          role: "chef du pupitre",
          pupitre: membre.pupitre,
        });

        chefPupitreByUpdatedMemberUsers.forEach(async (chefPupitreUser) => {
          const chefPupitreSocketId = userSocketMap[chefPupitreUser._id];

          if (chefPupitreSocketId) {
            req.notificationData = {
              userId: chefPupitreUser._id,
              notificationMessage: `${membre.prenom} ${membre.nom} a changé son statut a ${membre.statut}`,
            };

            await sendNotificationMiddleware(req, res, () => {});
          }
        });
      }
      res.status(200).json({
        message: "Membre modifié avec succés",
        model: membre,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



module.exports = {
  modifierTessiture,
  register,
  login,
  getMemberById,
  getAllMembers,
  deleteMember,
  updateMember,
  getMembersByPupitre,
  
};
