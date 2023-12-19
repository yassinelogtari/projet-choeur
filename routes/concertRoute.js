const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createConcert } = require('../controllers/concertController'); 
const concertController=require('../controllers/concertController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const allowedMimes = [
            'image/png',
            'image/jpg',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            console.log('Seuls les fichiers jpg, png, et Excel sont acceptés');
            callback(new Error('Seuls les fichiers jpg, png, et Excel sont acceptés'), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
    },
});

router.post('/upload', upload.fields([{ name: 'affiche', maxCount: 1 }, { name: 'excelFilePath', maxCount: 1 }]), async (req, res) => {
    try {
        // Vérifier si le fichier affiche existe dans la requête
        if (!req.files || !req.files['affiche']) {
            return res.status(400).json({ message: 'Le fichier affiche est requis.' });
        }

        // Récupérer le fichier affiche
        const afficheFile = req.files['affiche'][0];

        // Récupérer le fichier excel s'il existe
        const excelFile = req.files['excelFilePath'] ? req.files['excelFilePath'][0] : null;

        await createConcert({
            body: {
                date: req.body.date,
                lieu: req.body.lieu,
                programme : req.body.programme,
                afficheFile,
                excelFile,
                listeMembres: req.body.listeMembres,
            },
        }, res);
    } catch (error) {
        console.error('Erreur lors du téléchargement des fichiers:', error);
        res.status(500).json({ message: 'Erreur lors du téléchargement des fichiers.', error: error.message });
    }
});


router.get('/:concertId/participants',concertController.getListeParticipantsParPupitre)


module.exports = router;
