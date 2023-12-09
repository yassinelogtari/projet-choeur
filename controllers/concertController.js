const Concert = require('../models/concertModel');
const Oeuvre = require('../models/oeuvreModel');
const exceljs = require('exceljs');
const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);

const convertExcelToJson = (path) => {
  const work = exceljs.readFile(path);
  const sheetname = work.SheetNames[0];
  const musicalList = exceljs.utils.sheet_to_json(work.Sheets[sheetname]);
  return musicalList;
};

const createConcert = async (req, res) => {
    try {
      const { date, lieu, affiche, excelFile, themeprogramme, programme } = req.body;
  
      let concertProgramme = [];
      let atLeastOneOeuvreAdded = false;
  
      if (excelFile && !programme) {
        const workbook = new exceljs.Workbook();
        const fileBuffer = await readFileAsync(excelFile.path);
        await workbook.xlsx.load(fileBuffer);
  
        const worksheet = workbook.getWorksheet(1);
  
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
          const titre = worksheet.getCell(`A${rowNumber}`).value;
          const theme = worksheet.getCell(`B${rowNumber}`).value;
  
          try {
            const oeuvre = await Oeuvre.findOne({ titre });

            if (oeuvre && theme === themeprogramme) {
              concertProgramme.push({ oeuvre: oeuvre._id });
              atLeastOneOeuvreAdded = true;
            } else if (!oeuvre) {
              console.log(`L'œuvre "${titre}" n'a pas été trouvée.`);
            }
          } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, msg: err.message });
          }
        }
  
        if (!atLeastOneOeuvreAdded) {
          return res.status(400).json({ success: false, msg: `Aucune œuvre avec le thème "${themeprogramme}" n'a été trouvée.` });
        }
  
      } else if (programme && !excelFile) {
        for (const item of programme) {
          const oeuvreId = item.oeuvre;
          concertProgramme.push({ oeuvre: oeuvreId });
          atLeastOneOeuvreAdded = true;
        }
      } else {
        return res.status(400).json({ success: false, msg: "Fournissez soit un fichier Excel, soit un programme manuel." });
      }
  
      const concert = new Concert({ date, lieu, affiche, themeprogramme, programme: concertProgramme });
      await concert.save();
  
      res.status(201).json({ success: true, concert });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };
  
  
  
  

const getConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.status(200).json({ success: true, concerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};
const getConcertById = async (req, res) => {
    try {
      const concert = await Concert.findById(req.params.id);
      if (!concert) {
        return res.status(404).json({ success: false, msg: "Concert non trouvé." });
      }
      res.status(200).json({ success: true, concert });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };
  
  const updateConcertById = async (req, res) => {
    try {
      const { date, lieu, affiche, programme } = req.body;
      const concert = await Concert.findByIdAndUpdate(
        req.params.id,
        { date, lieu, affiche, programme },
        { new: true }
      );
      if (!concert) {
        return res.status(404).json({ success: false, msg: "Concert non trouvé." });
      }
      res.status(200).json({ success: true, concert });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };
  
  const deleteConcertById = async (req, res) => {
    try {
      const concert = await Concert.findByIdAndDelete(req.params.id);
      if (!concert) {
        return res.status(404).json({ success: false, msg: "Concert non trouvé." });
      }
      res.status(200).json({ success: true, msg: "Concert supprimé avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };
  
  module.exports = {
    createConcert,
    getConcerts,
    getConcertById,
    updateConcertById,
    deleteConcertById,
  };

