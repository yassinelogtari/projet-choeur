const router = require("express").Router();

const saisonController = require("../controllers/saisonController");
const middlewareSaison = require("../middlewares/auth");

router.post(
  "/archiveSeason/:seasonId",
  /* middlewareSaison.loggedMiddleware,
  middlewareSaison.isAdmin,*/
  saisonController.archiveSeason
);
router.post(
  "/createSaison",
  /*middlewareSaison.loggedMiddleware,
  middlewareSaison.isAdmin,*/
  saisonController.createSaison
);
router.get(
  "/getSaison/:id",
  /*middlewareSaison.loggedMiddleware,
  middlewareSaison.isAdmin,*/
  saisonController.getSaisonByid
);
router.get(
  "/getSaisonActuelle",
  /*middlewareSaison.loggedMiddleware,
  middlewareSaison.isAdmin,*/
  saisonController.getSaisonCourante
);
router.get(
  "/SaisonArchivee",
  /*middlewareSaison.loggedMiddleware,
  middlewareSaison.isAdmin,*/
  saisonController.getSaisonsArchivees
);
router.post(
  "/updatestatus",
  middlewareSaison.loggedMiddleware,
  middlewareSaison.isAdmin,
  saisonController.updateStatus
);
router.post(
  "/designerChefsdePupitre",
  /* middlewareSaison.loggedMiddleware,
  middlewareSaison.isManager,*/
  saisonController.designerChefsDePupitre
);
router.post(
  "/modifierseuil",
  middlewareSaison.loggedMiddleware,
  middlewareSaison.isAdmin,
  saisonController.updateSeuilForCurrentSeason
);
router.post(
  "/quitter/:id",
  middlewareSaison.loggedMiddleware,
  middlewareSaison.isChoriste,
  saisonController.quitterChoeur
);

router.patch(
  "/updateSaison/:id",
  /*middlewareSaison.loggedMiddleware,
  middlewareSaison.isAdmin,*/
  saisonController.updateSaison
);

/**
 * @swagger
 * tags:
 *   name: Saison
 *   description: Saison management
 * components:
 *   schemas:
 *     Saison:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         dateDebut:
 *           type: string
 *           format: date
 *         dateFin:
 *           type: string
 *           format: date
 *         membres:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *         repetitions:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *         oeuvres:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *         concerts:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *         seuilnomination:
 *           type: number
 *         nominatedMembers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *                 format: ObjectId
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               total_absences:
 *                 type: number
 *         seuilelimination:
 *           type: number
 *         eliminatedMembers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *                 format: ObjectId
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               total_absences:
 *                 type: number
 *               eliminationReason:
 *                 type: string
 *         saisonCourante:
 *           type: boolean
 *         archivee:
 *           type: boolean
 *       required:
 *         - nom
 *         - dateDebut
 *         - dateFin
 */

/**
 * @swagger
 * /api/saison/archiveSeason/{seasonId}:
 *   post:
 *     summary: Archive a season by ID
 *     description: Archive a season in the database by its ID
 *     tags: [Saison]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Season archived successfully
 */

/**
 * @swagger
 * /api/saison/createSaison:
 *   post:
 *     summary: Create a new season
 *     description: Create a new season in the database
 *     tags: [Saison]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Saison'
 *     responses:
 *       200:
 *         description: Season created successfully
 */

/**
 * @swagger
 * /api/saison/getSaison/{id}:
 *   get:
 *     summary: Get a season by ID
 *     description: Retrieve details of a season by its ID
 *     tags: [Saison]
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
 *         description: Season details retrieved successfully
 */

/**
 * @swagger
 * /api/saison/updatestatus:
 *   post:
 *     summary: Update status of the current season
 *     description: Update status of the current season in the database
 *     tags: [Saison]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Saison'
 *     responses:
 *       200:
 *         description: Season status updated successfully
 */

/**
 * @swagger
 * /api/saison/designerChefsdePupitre:
 *   post:
 *     summary: Designate chefs de pupitre for the current season
 *     description: Designate chefs de pupitre for the current season in the database
 *     tags: [Saison]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Saison'
 *     responses:
 *       200:
 *         description: Chefs de pupitre designated successfully
 */

/**
 * @swagger
 * /api/saison/modifierseuil:
 *   post:
 *     summary: Update the threshold for the current season
 *     description: Update the threshold for the current season in the database
 *     tags: [Saison]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Saison'
 *     responses:
 *       200:
 *         description: Threshold updated successfully
 */

/**
 * @swagger
 * /api/saison/quitter/{id}:
 *   post:
 *     summary: Quit the choir for the current season
 *     description: Quit the choir for the current season in the database
 *     tags: [Saison]
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
 *         description: Member quitted the choir successfully
 */

module.exports = router;
