
const Candidats = require("../models/candidatModel");
const Auditions=require("../models/auditionModel")


const Saison=require('../models/saisonModel')

const Membre=require('../models/membreModel')

const archiveSeason = async (req, res) => {
  try {
    const seasonId = req.params.seasonId;
    const season = await Saison.findById(seasonId);

    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    season.archivee = true;
    season.saisonCourante = false;

    await season.save();

    res.status(200).json({ message: 'Season archived successfully', data: season });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const createSaison = async (req, res) => {
  try {
    const { nom, dateDebut, dateFin } = req.body;
    const saisonPrecedente = await Saison.findOne({ saisonCourante: true });
    if (saisonPrecedente) {
      const membresSaisonPrecedente = await Membre.find({ _id: { $in: saisonPrecedente.membres } });

      for (const membrePrecedent of membresSaisonPrecedente) {
        membrePrecedent.historiqueStatut.push({
          saison: saisonPrecedente._id,
          status: membrePrecedent.statut,
        });

        await membrePrecedent.save();
      }
    }
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
    console.error('Erreur lors de la création de la saison:', error);
    return res.status(500).json({ erreur: 'Erreur lors de la création de la saison' });
  }
};

const getSaisonByid = async (req, res) => {
  try {
    const saisonId = req.params.id;
    const saison = await Saison.findById(saisonId)
      .populate('membres repetitions oeuvres concerts')

    if (!saison) {
      return res.status(404).json({ erreur: 'Saison non trouvée' });
    }
    return res.status(200).json({ saison });
  } catch (error) {
    console.error('Erreur lors de la récupération de la saison:', error);
    return res.status(500).json({ erreur: 'Erreur lors de la récupération de la saison' });
  }
};
const updateStatus = async (req, res) => {
  try {
    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      console.error("No current season found");
      return res.status(404).json({ error: "No current season found" });
    }

    const membres = await Membre.find({ _id: { $in: saisonCourante.membres } });

    for (const membre of membres) {

      const isMemberInSaison2018 = saisonCourante.membres.some(saisonMembre => saisonMembre.equals(membre._id));
      
      if (isMemberInSaison2018) {
        membre.statut = "Vétéran";
      } 
        const totalSeasons = membre.historiqueStatut.length;

        if (totalSeasons === 0) {
          membre.statut = "Junior";
        }else if (totalSeasons === 1) {
          membre.statut = "Choriste"; 
        } else if (totalSeasons === 2) {
          membre.statut = "Sénior"; 
        }
      

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
                    notificationMessage: `${updatedMembre.prenom} ${updatedMembre.nom} a changé son statut a ${updatedMembre.status}.`,
                };

                sendNotificationMiddleware(req, res, () => { });
            }
        });
    } 
    }

    console.log("Status updated successfully");
    return res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const designerChefsDePupitre = async (req, res) => {
  try {
    const { pupitre, membre1Id, membre2Id } = req.body;

    const currentSeason = await Saison.findOne({ saisonCourante: true });

    if (!currentSeason) {
      return res.status(400).json({ error: 'No current season found.' });
    }

    const membersExistInCurrentSeason = currentSeason.membres.some(
      memberId => memberId.toString() === membre1Id || memberId.toString() === membre2Id
    );

    if (!membersExistInCurrentSeason) {
      return res.status(400).json({ error: 'Specified members do not exist in the current season.' });
    }

    const existingPupitreLeaders = await Membre.find({ pupitre, role: 'chef du pupitre' });

    if (existingPupitreLeaders.length >= 2) {
      return res.status(400).json({ error: `There are already two members designated as 'chef du pupitre' for the pupitre ${pupitre}.` });
    }

    const membersToUpdate = await Membre.find({ _id: { $in: [membre1Id, membre2Id] } });

    for (const member of membersToUpdate) {
      member.role = 'chef du pupitre';
      await member.save();
    }

    res.status(200).json({ message: 'Roles updated successfully.' });
  } catch (error) {
    console.error('Error updating roles to "chef de pupitre":', error);
    res.status(500).json({ error: 'Internal server error' });
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
      return res.status(400).json({ error: "Le membre ne fait pas partie de la saison courante" });
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

              sendNotificationMiddleware(req, res, () => { });
          }
      });
  } 

    console.log("Membre a quitté avec succès");
    return res.status(200).json({ message: 'Membre a quitté avec succès' });
  } catch (error) {
    console.error("Erreur lors de la sortie du membre :", error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};


module.exports={archiveSeason,createSaison,getSaisonByid,updateStatus,designerChefsDePupitre,quitterChoeur}