const Concert = require('../models/concertModel');
const Membre = require('../models/membreModel');
const Oeuvre = require('../models/oeuvreModel');
const exceljs = require('exceljs');

async function createConcert(req, res) {
    try {
        const date = req.body.date;
        const lieu = req.body.lieu;
        const afficheFileName = req.body.afficheFile.filename;
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
            date,
            lieu,
            affiche: afficheFileName,
            programme: processedProgramme,
            listeMembres: req.body.listeMembres || [], 
        });

        const newConcert = await concert.save();

        res.json({
            date,
            lieu,
            affiche: afficheFileName,
            programme: processedProgramme,
            listeMembres: req.body.listeMembres,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du concert.', error: error.message });
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

module.exports = { createConcert };
