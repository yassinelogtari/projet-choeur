const Concert = require("../models/concertModel");
const Membre = require("../models/membreModel");
const Oeuvre = require("../models/oeuvreModel");
const Saison=require("../models/saisonModel")
const exceljs = require("exceljs");
const addQrCodeToRepetition = require("../middlewares/createQrCodeMiddleware");

async function createConcert(req, res) {

  try {
    const titre = req.body.titre;
    const date = req.body.date;
    const lieu = req.body.lieu;
    const saisonId = req.body.saisonId;
   // const afficheFileName = req.body.afficheFile.filename;
    const afficheFilePath = req.body.afficheFile.path;
    // ...
    const excelFilePath = req.body.excelFile ? req.body.excelFile.path : null;

    let programmeData = [];

    if (excelFilePath) {
      programmeData = await parseExcel(excelFilePath);
    }

    const programmeManuel = req.body.programme || [];

    const mergedProgramme = [...programmeData, ...programmeManuel];

    const processedProgramme = await processProgramme(mergedProgramme);

    const concert = new Concert({
      titre,
      date,
      lieu,
      //affiche: afficheFileName,
      affiche: afficheFilePath,
      programme: processedProgramme,
      listeMembres: req.body.listeMembres || [],
    });
  
    const nouvelleConcert= concert;
    const currentSaison = await Saison.findOne({ saisonCourante: true });
    if (currentSaison) {
      currentSaison.concerts.push(nouvelleConcert);
      await currentSaison.save();
    }
    const newConcert = await concert.save();
    
    
    
    req.cancertId = newConcert._id;
    await addQrCodeToRepetition.addQrCodeToCancert(req, res, () => {});
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({
        message: "Erreur lors de la création du concert.",
        error: error.message,
      });
  }
}

async function parseExcel(excelFilePath) {
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(excelFilePath);

  const worksheet = workbook.getWorksheet(1);

  const programmeData = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      programmeData.push({
        theme: row.getCell(1).text,
        titre: row.getCell(2).text,
        compositeurs: row.getCell(3).text,
        arrangeurs: row.getCell(4).text,
        pupitre: row.getCell(5).text,
        anneeComposition: row.getCell(6).text,
        genre: row.getCell(7).text,
        paroles: row.getCell(8).text,
        partition: row.getCell(9).text,
        presencechoeur: row.getCell(10).text,
      });
    }
  });

  return programmeData;
}

async function processProgramme(programmeData) {
  const processedProgramme = [];

  for (const entry of programmeData) {
    const existingOeuvre = await Oeuvre.findOne({ titre: entry.titre });

    if (existingOeuvre) {
      processedProgramme.push({
        oeuvre: existingOeuvre._id,
        theme: entry.theme,
      });
    } else {
      const newOeuvre = new Oeuvre({
        titre: entry.titre,
        compositeurs: entry.compositeurs,
        arrangeurs: entry.arrangeurs,
        pupitre: entry.pupitre,
        anneeComposition: entry.anneeComposition,
        genre: entry.genre,
        paroles: entry.paroles,
        partition: entry.partition,
        presencechoeur: entry.presencechoeur,
      });

      const savedOeuvre = await newOeuvre.save();

      processedProgramme.push({
        oeuvre: savedOeuvre._id,
        theme: entry.theme,
        compositeurs: entry.compositeurs,
        arrangeurs: entry.arrangeurs,
        pupitre: entry.pupitre,
        anneeComposition: entry.anneeComposition,
        genre: entry.genre,
        paroles: entry.paroles,
        partition: entry.partition,
        presencechoeur: entry.presencechoeur,
      });
    }
  }

  return processedProgramme;
}



async function getListeParticipantsParPupitre(req, res) {
  const concertId = req.params.concertId;
  
  try {
     
      const concert = await Concert.findById(concertId).populate('listeMembres.membre');

      if (!concert) {
          throw new Error('Concert not found');
      }

      const participantsParPupitre = {
          soprano: { présents: [], absents: [] },
          alto: { présents: [], absents: [] },
          ténor: { présents: [], absents: [] },
          basse: { présents: [], absents: [] },
      };

      concert.listeMembres.forEach((participant) => {
          const { membre, presence } = participant;
          const { pupitre } = membre;

          if (presence) {
            const { _id, nom, prenom } = membre;
            participantsParPupitre[pupitre].présents.push({ _id, nom, prenom });
        } else {
            const { _id, nom, prenom } = membre;
            participantsParPupitre[pupitre].absents.push({ _id, nom, prenom });
        }
      });

      const tauxAbsenceParPupitre = {};
      const tauxPresenceParPupitre = {};

      for (const pupitre in participantsParPupitre) {
          const totalParticipants = participantsParPupitre[pupitre].présents.length + participantsParPupitre[pupitre].absents.length;
          const tauxAbsence = totalParticipants > 0 ? (participantsParPupitre[pupitre].absents.length / totalParticipants) * 100 : 0;
          tauxAbsenceParPupitre[pupitre] = tauxAbsence.toFixed(2) + '%';

          const tauxPresence = totalParticipants > 0 ? (participantsParPupitre[pupitre].présents.length / totalParticipants) * 100 : 0;
          tauxPresenceParPupitre[pupitre] = tauxPresence.toFixed(2) + '%';
      }

      res.json({ participantsParPupitre, tauxAbsenceParPupitre ,tauxPresenceParPupitre});
  } catch (error) {
      console.error(error);
  }
}

  async function deleteConcert(req, res) {
    try {
      const concertId = req.params.concertId;
  
      const deletedConcert = await Concert.findByIdAndDelete(concertId);
  
      if (!deletedConcert) {
        return res.status(404).json({ message: "Concert not found" });
      }
  
      res.json({ message: "Concert deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting concert",
        error: error.message,
      });
    }
  }
  
  async function getConcerts(req, res) {
    try {
      const concerts = await Concert.find();
      res.json(concerts);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving concerts",
        error: error.message,
      });
    }
  }
  
  async function getConcertById(req, res) {
    try {
      const concertId = req.params.concertId;
      const concert = await Concert.findById(concertId);
  
      if (!concert) {
        return res.status(404).json({ message: "Concert not found" });
      }
  
      res.json(concert);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving concert",
        error: error.message,
      });
    }
}
async function updateConcert(req, res) {
    try {
      const concertId = req.params.concertId;
      const updates = req.body;
  
      if (updates.afficheFile) {
        
        updates.affiche = updates.afficheFile.filename;
      }
  
      const updatedConcert = await Concert.findByIdAndUpdate(
        concertId,
        { $set: updates }, 
        { new: true }
      );
  
      if (!updatedConcert) {
        return res.status(404).json({ message: 'Concert not found' });
      }
  
      res.json(updatedConcert);
    } catch (error) {
      res.status(500).json({
        message: 'Error updating concert',
        error: error.message,
      });
    }
  }
  

module.exports = { 
    createConcert,  
    getListeParticipantsParPupitre,
    deleteConcert,
    getConcerts,
    getConcertById,updateConcert };
