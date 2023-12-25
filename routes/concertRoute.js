const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const concertController=require('../controllers/concertController')
const { createConcert, deleteConcert, getConcerts, getConcertById,updateConcert } = require('../controllers/concertController'); 


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
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedMimes.includes(file.mimetype)|| (ext === '.jpg' || ext === '.png')) {
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

router.post('/add-concert', upload.fields([{ name: 'affiche', maxCount: 1 }, { name: 'excelFilePath', maxCount: 1 }]), async (req, res) => {
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
                saisonId:req.body.saisonId,
                titre: req.body.titre,
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

router.patch('/:concertId', upload.fields([{ name: 'affiche', maxCount: 1 }, { name: 'excelFilePath', maxCount: 1 }]), async (req, res) => {
    try {
        const afficheFiles = req.files['affiche'];
        const afficheFile = afficheFiles ? afficheFiles[0] : null;
        const excelFiles = req.files['excelFilePath'];
        const excelFile = excelFiles ? excelFiles[0] : null;
        
        const body = {
            titre: req.body.titre,
            date: req.body.date,
            lieu: req.body.lieu,
            programme: req.body.programme,
            afficheFile,
            excelFile,
            listeMembres: req.body.listeMembres,
        };
  
        await updateConcert({
            params: {
                concertId: req.params.concertId,
            },
            body,
        }, res);
    } catch (error) {
        console.error('Erreur lors du traitement du formulaire:', error);
        res.status(500).json({ message: 'Erreur lors du traitement du formulaire.', error: error.message });
    }
});

  
router.delete("/:concertId", deleteConcert);

router.get("/get-concerts",getConcerts);

router.get("/:concertId", getConcertById);

router.get('/:concertId/participants',concertController.getListeParticipantsParPupitre)


module.exports = router;
