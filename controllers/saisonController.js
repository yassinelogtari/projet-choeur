
const Candidats = require("../models/candidatModel");
const Auditions=require("../models/auditionModel")

const Membre = require('../models/membreModel'); 
const Repetition = require('../models/repetitionModel');
const Oeuvre = require('../models/oeuvreModel');
const Concert=require('../models/concertModel')
const Saison=require('../models/saisonModel')


const fetchArchiverSaison=async(req,res)=>{
    try {
        const saisonDate = new Date(req.params.date);
        const year = saisonDate.getFullYear();
    
        const yearDebut = new Date(`${year}-01-01T00:00:00Z`);
        const yearEnd = new Date(`${year}-12-31T23:59:59Z`);
    
        const candidatsInYear = await Candidats.find({
          createdAt: { $gte: yearDebut, $lte: yearEnd }
        });
        const auditionInYear = await Auditions.find({
            createdAt: { $gte: yearDebut, $lte: yearEnd }
          });

        const result = {
            candidats: candidatsInYear,
            auditions: auditionInYear
          };
        res.json(result);
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
      }
}

const createSaison =(async (req, res) => {
  try {
    const { nom, dateDebut, dateFin, membres,repetitions,oeuvres,concerts } = req.body
    const nouvelleSaison = new Saison({
      nom,
      dateDebut,
      dateFin,
      membres,
      repetitions,
      oeuvres,
      concerts
    });
    const saisonEnregistree = await nouvelleSaison.save();
    return res.status(201).json({ saison: saisonEnregistree });
  } catch (error) {

    console.error('Erreur lors de la création de la saison:', error);
    return res.status(500).json({ erreur: 'Erreur lors de la création de la saison' });
  }
})

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

const updateSaison = async (req, res) => {
  try {
    const saisonId = req.params.id;
    const { nom, dateDebut, dateFin, membres, repetitions, oeuvres, concerts } = req.body;

    const saisonMiseAJour = await Saison.findByIdAndUpdate(
      saisonId,
      {
        nom,
        dateDebut,
        dateFin,
        membres,
        repetitions,
        oeuvres,
        concerts,
      },
      { new: true, runValidators: true }
    ).populate('membres repetitions oeuvres concerts');

    if (!saisonMiseAJour) {
      return res.status(404).json({ erreur: 'Saison non trouvée' });
    }

    return res.status(200).json({ saison: saisonMiseAJour });
  } catch (error) {
   
    console.error('Erreur lors de la mise à jour de la saison:', error);
    return res.status(500).json({ erreur: 'Erreur lors de la mise à jour de la saison' });
  }
};

module.exports = { updateSaison };


module.exports={fetchArchiverSaison,createSaison,getSaisonByid,updateSaison}