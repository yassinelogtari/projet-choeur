const Concert = require("../models/concertModel");
const Membre = require("../models/membreModel");
const Oeuvre = require("../models/oeuvreModel");
const Saison = require("../models/saisonModel");
//const exceljs = require("exceljs");
const addQrCodeToRepetition = require("../middlewares/createQrCodeMiddleware");   

const excelToJson = require("convert-excel-to-json");
const {
  Types: { ObjectId },
} = require("mongoose");

async function createConcert(req, res) {
  try {
    console.log("req", req.body);
    const {
      titre,
      date,
      lieu,
      afficheFile,
      excelFile,
      programme: programmeManuel,
      listeMembres,
    } = req.body;

    const afficheFilePath = afficheFile.path;

    let programme = [];

    // Check if manual programme is provided and parse it
    if (typeof programmeManuel === "string") {
      try {
        const programmeManuelParsed = JSON.parse(programmeManuel);
        if (Array.isArray(programmeManuelParsed)) {
          programme = programmeManuelParsed;
        }
      } catch (error) {
        console.log("Error parsing manual programme:", error);
      }
    } else if (Array.isArray(programmeManuel)) {
      programme = programmeManuel;
    }

    // Check if excel file is uploaded
    if (excelFile && excelFile.path) {
      const excelData = excelToJson({
        sourceFile: excelFile.path,
      });

      console.log("Excel data:", excelData);

      // Assuming your Excel sheet has columns named 'oeuvre' and 'theme'
      // Adjust the sheet name and column names based on your Excel structure
      const extractedProgramme = excelData["Feuille 1"].map((row) => ({
        oeuvre: new ObjectId(row["oeuvre"]), // Convert 'oeuvre' to ObjectId
        theme: row["theme"], // Extract the theme from Excel
      }));

      console.log("Extracted programme:", extractedProgramme);

      // Merge manually added programme with extracted programme
      programme = [...programme, ...extractedProgramme];
    }

    console.log("programme backend", programme);

    const concert = new Concert({
      titre,
      date,
      lieu,
      affiche: afficheFilePath,
      programme,
      listeMembres: listeMembres || [],
    });

    const nouvelleConcert = concert;
    const currentSaison = await Saison.findOne({ saisonCourante: true });
    if (currentSaison) {
      currentSaison.concerts.push(nouvelleConcert);
      await currentSaison.save();
    }
    const newConcert = await concert.save();

    req.cancertId = newConcert._id;
    await addQrCodeToRepetition.addQrCodeToCancert(req, res, () => {});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la création du concert.",
      error: error.message,
    });
  }
}

// async function createConcert(req, res) {
//   try {
//     console.log("req", req.body);
//     const titre = req.body.titre;
//     const date = req.body.date;
//     const lieu = req.body.lieu;

//     const afficheFilePath = req.body.afficheFile.path;

//     const excelFilePath = req.body.excelFile ? req.body.excelFile.path : null;

//     let programmeData = [];

//     // if (excelFilePath) {
//     //   programmeData = await parseExcel(excelFilePath);
//     // }
//     console.log("programmeData", programmeData);

//     const programmeManuel = req.body.programme || [];
//     console.log("programmeManuel", programmeManuel);

//     const mergedProgramme = [...programmeManuel]; // Ensure both arrays are merged properly
//     console.log("mergedProgramme", mergedProgramme);

//     const processedProgramme = mergedProgramme.map((item) => ({
//       oeuvre: item.oeuvre, // Make sure the structure of each item is correct
//       theme: item.theme,
//     }));
//     console.log("processedProgramme", processedProgramme);

//     const concert = new Concert({
//       titre,
//       date,
//       lieu,
//       affiche: afficheFilePath,
//       programme: processedProgramme,
//       listeMembres: req.body.listeMembres || [],
//     });

//     const nouvelleConcert = concert;
//     const currentSaison = await Saison.findOne({ saisonCourante: true });
//     if (currentSaison) {
//       currentSaison.concerts.push(nouvelleConcert);
//       await currentSaison.save();
//     }
//     const newConcert = await concert.save();

//     req.cancertId = newConcert._id;
//     await addQrCodeToRepetition.addQrCodeToCancert(req, res, () => {});
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Erreur lors de la création du concert.",
//       error: error.message,
//     });
//   }
// }

// async function parseExcel(excelFilePath) {
//   const workbook = new exceljs.Workbook();
//   await workbook.xlsx.readFile(excelFilePath);

//   const worksheet = workbook.getWorksheet(1);

//   const programmeData = [];
//   worksheet.eachRow((row, rowNumber) => {
//     if (rowNumber > 1) {
//       programmeData.push({
//         theme: row.getCell(1).text,
//         titre: row.getCell(2).text,
//         compositeurs: row.getCell(3).text,
//         arrangeurs: row.getCell(4).text,
//         pupitre: row.getCell(5).text,
//         anneeComposition: row.getCell(6).text,
//         genre: row.getCell(7).text,
//         paroles: row.getCell(8).text,
//         partition: row.getCell(9).text,
//         presencechoeur: row.getCell(10).text,
//       });
//     }
//   });

//   return programmeData;
// }

// async function processProgramme(programmeData) {
//   const processedProgramme = [];

//   for (const entry of programmeData) {
//     const existingOeuvre = await Oeuvre.findOne({ titre: entry.titre });

//     if (existingOeuvre) {
//       processedProgramme.push({
//         oeuvre: existingOeuvre._id,
//         theme: entry.theme,
//       });
//     } else {
//       const newOeuvre = new Oeuvre({
//         titre: entry.titre,
//         compositeurs: entry.compositeurs,
//         arrangeurs: entry.arrangeurs,
//         pupitre: entry.pupitre,
//         anneeComposition: entry.anneeComposition,
//         genre: entry.genre,
//         paroles: entry.paroles,
//         partition: entry.partition,
//         presencechoeur: entry.presencechoeur,
//       });

//       const savedOeuvre = await newOeuvre.save();

//       processedProgramme.push({
//         oeuvre: savedOeuvre._id,
//         theme: entry.theme,
//         compositeurs: entry.compositeurs,
//         arrangeurs: entry.arrangeurs,
//         pupitre: entry.pupitre,
//         anneeComposition: entry.anneeComposition,
//         genre: entry.genre,
//         paroles: entry.paroles,
//         partition: entry.partition,
//         presencechoeur: entry.presencechoeur,
//       });
//     }
//   }

//   return processedProgramme;
// }

async function getListeParticipantsParPupitre(req, res) {
  const concertId = req.params.concertId;

  try {
    const concert = await Concert.findById(concertId).populate(
      "listeMembres.membre"
    );

    if (!concert) {
      throw new Error("Concert not found");
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
      const totalParticipants =
        participantsParPupitre[pupitre].présents.length +
        participantsParPupitre[pupitre].absents.length;
      const tauxAbsence =
        totalParticipants > 0
          ? (participantsParPupitre[pupitre].absents.length /
              totalParticipants) *
            100
          : 0;
      tauxAbsenceParPupitre[pupitre] = tauxAbsence.toFixed(2) + "%";

      const tauxPresence =
        totalParticipants > 0
          ? (participantsParPupitre[pupitre].présents.length /
              totalParticipants) *
            100
          : 0;
      tauxPresenceParPupitre[pupitre] = tauxPresence.toFixed(2) + "%";
    }

    res.json({
      participantsParPupitre,
      tauxAbsenceParPupitre,
      tauxPresenceParPupitre,
    });
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
    const concerts = await Concert.find()
      .populate("programme.oeuvre", "titre") // Populate the programme field with the titre property of Oeuvre
      .populate("listeMembres.membre", "nom") // Populate the listeMembres field with the nom property of Membre
      .exec();
    console.log(concerts);

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
  const concertId = req.params.concertId;
  const { date, lieu } = req.body;

  try {
    const concert = await Concert.findById(concertId);

    if (!concert) {
      return res.status(404).json({ message: "Concert not found" });
    }

    // Update the concert's date and lieu
    concert.date = date;
    concert.lieu = lieu;

    // Save the updated concert
    const updatedConcert = await concert.save();

    res.status(200).json({
      message: "Concert updated successfully",
      concert: updatedConcert,
    });
  } catch (error) {
    console.error("Error updating concert:", error);
    res.status(500).json({
      message: "Internal server error updating concert",
      error: error.message,
    });
  }
}

const calculerTauxPresenceMembres = async (req, res) => {
  try {
    const seuil = req.query.seuil || 0;

    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return res
        .status(404)
        .json({ message: "Aucune saison courante trouvée" });
    }

    await saisonCourante.populate("concerts");
    const concerts = saisonCourante.concerts;

    
    if (!concerts || concerts.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun concert trouvé pour la saison courante" });
    }


    const tauxPresenceMembres = {};

    concerts.forEach((concert) => {
      concert.listeMembres.forEach((membreConcert) => {
        const { membre, presence } = membreConcert;
        const memberId = membre._id.toString();

        if (!tauxPresenceMembres[memberId]) {
          tauxPresenceMembres[memberId] = {
            membre: membre,
            tauxPresence: 0,
            concertsParticipes: 0,
          };
        }

        if (presence) {
          tauxPresenceMembres[memberId].tauxPresence += 1;
        }
        tauxPresenceMembres[memberId].concertsParticipes += 1;
      });
    });

    const membresFiltres = Object.values(tauxPresenceMembres).filter(
      (membre) => {
        const tauxPresencePourcentage =
          (membre.tauxPresence / membre.concertsParticipes) * 100;
        return tauxPresencePourcentage >= seuil;
      }
    );

    membresFiltres.forEach((membre) => {
      membre.tauxPresence =
        (membre.tauxPresence / membre.concertsParticipes) * 100;
    });

    res.json({ membresFiltres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const validerConcert = async (req, res) => {
  try {
    const { concertId } = req.params;

    const seuil = req.query.seuil || 0;

    
    const saisonCourante = await Saison.findOne({ saisonCourante: true });

    if (!saisonCourante) {
      return res.status(404).json({ message: "Aucune saison courante trouvée" });
    }

    
    const concert = await Concert.findById(concertId).populate("listeMembres.membre");

    if (!concert) {
      return res.status(404).json({ message: "Concert non trouvé" });
    }

    
    await saisonCourante.populate('concerts');
    const concerts = saisonCourante.concerts;

    
    if (!concerts || concerts.length === 0) {
      return res.status(404).json({ message: "Aucun concert trouvé pour la saison courante" });
    }

    const tauxPresenceMembres = {};

    concerts.forEach((concert) => {
      concert.listeMembres.forEach((membreConcert) => {
        const { membre, presence } = membreConcert;
        const memberId = membre._id.toString();

        if (!tauxPresenceMembres[memberId]) {
          tauxPresenceMembres[memberId] = {
            membre: membre,
            tauxPresence: 0,
            concertsParticipes: 0,
          };
        }

        if (presence) {
          tauxPresenceMembres[memberId].tauxPresence += 1;
        }
        tauxPresenceMembres[memberId].concertsParticipes += 1;
      });
    });

    const membresFiltres = Object.values(tauxPresenceMembres).filter(
      (membre) => {
        const tauxPresencePourcentage =
          (membre.tauxPresence / membre.concertsParticipes) * 100;
        return tauxPresencePourcentage >= seuil;
      }
    );
    membresFiltres.forEach((membre) => {
      membre.tauxPresence =
        (membre.tauxPresence / membre.concertsParticipes) * 100;
    });

    for (const membre of membresFiltres) {
      const memberId = membre.membre._id.toString();
      const membreConcert = concert.listeMembres.find(
        (item) => item.membre._id.toString() === memberId
      );

      if (membreConcert) {
        membreConcert.valider = true; 
      } else {
        console.error("Membre non trouvé pour l'ID du membre :", memberId);
      }
    }

    await concert.save();

    res.json({ membresFiltres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


module.exports = {
  createConcert,
  getListeParticipantsParPupitre,
  deleteConcert,
  getConcerts,
  getConcertById,
  updateConcert,
  calculerTauxPresenceMembres,
  validerConcert
};
