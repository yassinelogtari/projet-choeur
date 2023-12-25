
const Candidats = require("../models/candidatModel");
const Auditions=require("../models/auditionModel")


const Saison=require('../models/saisonModel')



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

module.exports={archiveSeason,createSaison,getSaisonByid}