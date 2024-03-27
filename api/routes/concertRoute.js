const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const concertController = require("../controllers/concertController");
const middlewareConcert = require("../middlewares/auth");
const {
  createConcert,
  deleteConcert,
  getConcerts,
  getConcertById,
  updateConcert,
} = require("../controllers/concertController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
<<<<<<< HEAD
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

router.post('/add-concert',upload.fields([{ name: 'affiche', maxCount: 1 }, { name: 'excelFilePath', maxCount: 1 }]), async (req, res) => {
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
=======
  storage: storage,
  fileFilter: function (req, file, callback) {
    const allowedMimes = [
      "image/png",
      "image/jpg",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      allowedMimes.includes(file.mimetype) ||
      ext === ".jpg" ||
      ext === ".png"
    ) {
      callback(null, true);
    } else {
      console.log("Seuls les fichiers jpg, png, et Excel sont acceptés");
      callback(
        new Error("Seuls les fichiers jpg, png, et Excel sont acceptés"),
        false
      );
>>>>>>> b33bedca7d4f8be64da255dc15ebe0b856674448
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },
});

router.post(
  "/add-concert",
  middlewareConcert.loggedMiddleware,
  middlewareConcert.isAdmin,
  upload.fields([
    { name: "affiche", maxCount: 1 },
    { name: "excelFilePath", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Vérifier si le fichier affiche existe dans la requête
      if (!req.files || !req.files["affiche"]) {
        return res
          .status(400)
          .json({ message: "Le fichier affiche est requis." });
      }

      // Récupérer le fichier affiche
      const afficheFile = req.files["affiche"][0];

      // Récupérer le fichier excel s'il existe
      const excelFile = req.files["excelFilePath"]
        ? req.files["excelFilePath"][0]
        : null;

      await createConcert(
        {
          body: {
            titre: req.body.titre,
            date: req.body.date,
            lieu: req.body.lieu,
            programme: req.body.programme,
            afficheFile,
            excelFile,
            listeMembres: req.body.listeMembres,
          },
        },
        res
      );
    } catch (error) {
      console.error("Erreur lors du téléchargement des fichiers:", error);
      res.status(500).json({
        message: "Erreur lors du téléchargement des fichiers.",
        error: error.message,
      });
    }
  }
);

router.patch(
  "/:concertId",
  middlewareConcert.loggedMiddleware,
  middlewareConcert.isAdmin,
  upload.fields([
    { name: "affiche", maxCount: 1 },
    { name: "excelFilePath", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const afficheFiles = req.files["affiche"];
      const afficheFile = afficheFiles ? afficheFiles[0] : null;
      const excelFiles = req.files["excelFilePath"];
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

      await updateConcert(
        {
          params: {
            concertId: req.params.concertId,
          },
          body,
        },
        res
      );
    } catch (error) {
      console.error("Erreur lors du traitement du formulaire:", error);
      res.status(500).json({
        message: "Erreur lors du traitement du formulaire.",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/:concertId",
  middlewareConcert.loggedMiddleware,
  middlewareConcert.isAdmin,
  deleteConcert
);

router.get(
  "/get-concerts",
  middlewareConcert.loggedMiddleware,
  middlewareConcert.isAdmin,
  getConcerts
);

router.get(
  "/:concertId",
  middlewareConcert.loggedMiddleware,
  middlewareConcert.isAdmin,
  getConcertById
);

router.get(
  "/:concertId/participants",
  middlewareConcert.loggedMiddleware,
  middlewareConcert.isAdmin,
  concertController.getListeParticipantsParPupitre
);

/**
 * @swagger
 * tags:
 *   name: Concert
 *   description: Concert management
 * components:
 *   schemas:
 *     Concert:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         lieu:
 *           type: string
 *         affiche:
 *           type: string
 *         programme:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               oeuvre:
 *                 type: string
 *                 format: ObjectId
 *               theme:
 *                 type: string
 *         listeMembres:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               membre:
 *                 type: string
 *                 format: ObjectId
 *               presence:
 *                 type: boolean
 *               disponibility:
 *                 type: object
 *                 properties:
 *                   isAvailable:
 *                     type: boolean
 *                   reason:
 *                     type: string
 *         QrCode:
 *           type: string
 *       required:
 *         - titre
 *         - date
 *         - lieu
 *         - programme
 *         - listeMembres
 */

/**
 * @swagger
 * /api/concerts/add-concert:
 *   post:
 *     summary: Add a new concert
 *     description: Add a new concert to the database
 *     tags: [Concert]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Concert'
 *     responses:
 *       200:
 *         description: Concert added successfully
 */

/**
 * @swagger
 * /api/concerts/{concertId}:
 *   patch:
 *     summary: Update a concert by ID
 *     description: Update details of a concert in the database by its ID
 *     tags: [Concert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: concertId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Concert'
 *     responses:
 *       200:
 *         description: Concert updated successfully
 */

/**
 * @swagger
 * /api/concerts/{concertId}:
 *   delete:
 *     summary: Delete a concert by ID
 *     description: Delete a concert from the database by its ID
 *     tags: [Concert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: concertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Concert deleted successfully
 */

/**
 * @swagger
 * /api/concerts/get-concerts:
 *   get:
 *     summary: Get all concerts
 *     description: Retrieve a list of all concerts
 *     tags: [Concert]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of concerts retrieved successfully
 */

/**
 * @swagger
 * /api/concerts/{concertId}:
 *   get:
 *     summary: Get a concert by ID
 *     description: Retrieve details of a concert by its ID
 *     tags: [Concert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: concertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Concert details retrieved successfully
 */

/**
 * @swagger
 * /api/concerts/{concertId}/participants:
 *   get:
 *     summary: Get participants of a concert by ID
 *     description: Retrieve a list of participants of a concert by its ID
 *     tags: [Concert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: concertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of participants retrieved successfully
 */

module.exports = router;
