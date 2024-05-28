const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetitionController");
const middlewareRepetition = require("../middlewares/auth");

router.post(
  "/create",
  /*middlewareRepetition.loggedMiddleware,
  middlewareRepetition.isAdmin,*/
  repetitionController.createRepetition
);
router.delete(
  "/annuler/:id",
  /*middlewareRepetition.loggedMiddleware,
  middlewareRepetition.isAdmin,*/
  repetitionController.deleteRepetition
);
router.get(
  "/getRepetition/:id",
  // middlewareRepetition.loggedMiddleware,
  // middlewareRepetition.isAdmin,
  repetitionController.getRepetitionById
);
router.get(

  "/getAllRepetition"/*,
  middlewareRepetition.loggedMiddleware,
  middlewareRepetition.isAdmin*/,
  /*middlewareRepetition.loggedMiddleware,
  middlewareRepetition.isAdmin,*/
  repetitionController.getAllRepetition
);
router.patch(
  "/update/:id",
  /*middlewareRepetition.loggedMiddleware,
  middlewareRepetition.isAdmin,*/
  repetitionController.updateRepetition
);
router.get(
  "/:repetitionId/presence",

  // middlewareRepetition.loggedMiddleware,
  // middlewareRepetition.isChefPupitre,
 repetitionController.listPresenceByPupitre

);
router.post(
  "/addAbsence",middlewareRepetition.loggedMiddleware,repetitionController.absenceRepetition
);

/**
 * @swagger
 * tags:
 *   name: Repetition
 *   description: Repetition management
 * components:
 *   schemas:
 *     Repetition:
 *       type: object
 *       properties:
 *         concert:
 *           type: string
 *           format: ObjectId
 *         lieu:
 *           type: string
 *         DateRep:
 *           type: string
 *           format: date
 *         HeureDeb:
 *           type: string
 *           format: time
 *         HeureFin:
 *           type: string
 *           format: time
 *         membres:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               member:
 *                 type: string
 *                 format: ObjectId
 *               presence:
 *                 type: boolean
 *               raison:
 *                 type: boolean
 *         QrCode:
 *           type: string
 *       required:
 *         - lieu
 *         - DateRep
 *         - HeureDeb
 *         - HeureFin
 *         - membres
 */

/**
 * @swagger
 * /api/repetition/create:
 *   post:
 *     summary: Create a new repetition
 *     description: Create a new repetition in the database
 *     tags: [Repetition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repetition'
 *     responses:
 *       200:
 *         description: Repetition created successfully
 */

/**
 * @swagger
 * /api/repetition/annuler/{id}:
 *   delete:
 *     summary: Cancel a repetition by ID
 *     description: Cancel a repetition from the database by its ID
 *     tags: [Repetition]
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
 *         description: Repetition canceled successfully
 */

/**
 * @swagger
 * /api/repetition/getRepetition/{id}:
 *   get:
 *     summary: Get a repetition by ID
 *     description: Retrieve details of a repetition by its ID
 *     tags: [Repetition]
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
 *         description: Repetition details retrieved successfully
 */

/**
 * @swagger
 * /api/repetition/getAllRepetition:
 *   get:
 *     summary: Get all repetitions
 *     description: Retrieve a list of all repetitions
 *     tags: [Repetition]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of repetitions retrieved successfully
 */

/**
 * @swagger
 * /api/repetition/update/{id}:
 *   patch:
 *     summary: Update a repetition by ID
 *     description: Update details of a repetition in the database by its ID
 *     tags: [Repetition]
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
 *             $ref: '#/components/schemas/Repetition'
 *     responses:
 *       200:
 *         description: Repetition updated successfully
 */

/**
 * @swagger
 * /api/repetition/{repetitionId}/presence:
 *   get:
 *     summary: Get presence of members in a repetition by ID
 *     description: Retrieve a list of members' presence in a repetition by its ID with optional filtering by pupitre
 *     tags: [Repetition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: repetitionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: pupitre
 *         schema:
 *           type: string
 *         description: Filter presence by pupitre
 *     responses:
 *       200:
 *         description: List of members' presence retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 presenceList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nom:
 *                         type: string
 *                       prenom:
 *                         type: string
 */

module.exports = router;
