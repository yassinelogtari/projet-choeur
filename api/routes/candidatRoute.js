const router = require("express").Router();
const candidatController = require("../controllers/candidatController");
const dateMiddleware=require("../middlewares/dateRangeMiddleware")
const middlewareDate=require("../middlewares/auth")
const multer=require('multer')
const storage=multer.memoryStorage()
const upload=multer({storage:storage})

router.post("/verif",candidatController.addEmailCandidat)
router.get("/:id/verify/:token/", candidatController.getToken)
router.post("/form/date",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,candidatController.dateFormRange)
router.put("/form/date",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,candidatController.updateDateRange)
router.post("/form/:id",dateMiddleware,candidatController.rempForm)
router.get("/", candidatController.fetshCandidats);
router.get("/listeCandidatParPupitre/:tessiture",candidatController.candidatsParTessiture)
router.post("/accepterCandidat",upload.single('charte'),middlewareDate.loggedMiddleware,middlewareDate.AdminManager,candidatController.accepterCandidatParAudition)
router.get('/confirm/:id', candidatController.confirmParticipationEtDevenirChoriste);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Candidat
 *   description: Candidat management
 * components:
 *   schemas:
 *     Candidat:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         email:
 *           type: string
 *         sexe:
 *           type: string
 *           enum: ['Homme', 'Femme']
 *         CIN:
 *           type: string
 *         taille:
 *           type: number
 *         telephone:
 *           type: string
 *         nationalite:
 *           type: string
 *         dateNaissance:
 *           type: string
 *         activite:
 *           type: boolean
 *         connaisanceMusical:
 *           type: boolean
 *         situationPerso:
 *           type: string
 *         confirm:
 *           type: boolean
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - sexe
 *         - CIN
 *         - taille
 *         - telephone
 *         - nationalite
 *         - dateNaissance
 *         - activite
 *         - connaisanceMusical
 *         - situationPerso
 */

/**
 * @swagger
 * /api/candidats/verif:
 *   post:
 *     summary: Add email for candidat verification
 *     description: Add email for candidat verification
 *     tags: [Candidat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       201:
 *         description: Email added successfully for candidat verification
 *       409:
 *         description: Candidat with given email already exists
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/candidats/{id}/verify/{token}:
 *   get:
 *     summary: Verify candidat email
 *     description: Verify candidat email using a token
 *     tags: [Candidat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidat email verified successfully
 */

/**
 * @swagger
 * /api/candidats/form/date:
 *   post:
 *     summary: Set date form range
 *     description: Set date form range for candidats
 *     tags: [Candidat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidat'
 *     responses:
 *       200:
 *         description: Date form range set successfully
 */

/**
 * @swagger
 * /api/candidats/form/date:
 *   put:
 *     summary: Update date form range
 *     description: Update date form range for candidats
 *     tags: [Candidat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidat'
 *     responses:
 *       200:
 *         description: Date form range updated successfully
 */

/**
 * @swagger
 * /api/candidats/form/{id}:
 *   post:
 *     summary: Complete form for candidat
 *     description: Complete form for candidat using ID
 *     tags: [Candidat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidat'
 *     responses:
 *       200:
 *         description: Form completed successfully
 */

/**
 * @swagger
 * /api/candidats:
 *   get:
 *     summary: Get all candidats
 *     description: Retrieve a list of all candidats with optional filtration
 *     tags: [Candidat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for paginated results
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return per page
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         description: Filter by candidate's last name (nom)
 *       - in: query
 *         name: prenom
 *         schema:
 *           type: string
 *         description: Filter by candidate's first name (prenom)
 *     responses:
 *       200:
 *         description: List of candidats retrieved successfully
 */


/**
 * @swagger
 * /api/candidats/listeCandidatParPupitre/{tessiture}:
 *   get:
 *     summary: Get candidats by pupitre
 *     description: Retrieve a list of candidats by pupitre
 *     tags: [Candidat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tessiture
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of candidats by pupitre retrieved successfully
 */

/**
 * @swagger
 * /api/candidats/accepterCandidat:
 *   post:
 *     summary: Accept candidat by audition
 *     description: Accept candidat by audition and upload charte
 *     tags: [Candidat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Candidat'
 *     responses:
 *       200:
 *         description: Candidat accepted by audition successfully
 */

/**
 * @swagger
 * /api/candidats/confirm/{id}:
 *   get:
 *     summary: Confirm candidat participation and become a chorister
 *     description: Confirm candidat participation and become a chorister
 *     tags: [Candidat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidat participation confirmed successfully
 */

module.exports = router;
