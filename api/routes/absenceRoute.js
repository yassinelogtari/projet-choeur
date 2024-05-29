const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absenceController");
const authMiddleware = require("../middlewares/auth");

router.get(
  "/repetition/",
  absenceController.fetchAllRepetitionAbsence
);

router.get(
  "/repetition/pupitre",
  absenceController.fetchAllRepetitionAbsenceByPupitre
);

router.get(
  "/repetition/choriste",
  authMiddleware.loggedMiddleware,
  authMiddleware.isAdmin,
  absenceController.fetchAllAbsentMembersByChoriste
);

// /**
//  * @swagger
//  * /api/absence/repetition:
//  *   get:
//  *     summary: Fetch all repetition absences
//  *     description: Retrieve a list of all absences for repetition with optional filtering
//  *     description: Retrieve a list of all absences for repetition
//  *     tags: [Absence]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: specificDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Filter by a specific date
//  *       - in: query
//  *         name: startDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Filter by start date
//  *       - in: query
//  *         name: endDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Filter by end date
//  *       - in: query
//  *         name: programme
//  *         schema:
//  *           type: string
//  *         description: Filter by programme
//  *     responses:
//  *       200:
//  *         description: List of absences retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   repetition:
//  *                     type: object
//  *                     properties:
//  *                       _id:
//  *                         type: string
//  *                       lieu:
//  *                         type: string
//  *                       date:
//  *                         type: string
//  *                         format: date
//  *                       heureDeb:
//  *                         type: string
//  *                       heureFin:
//  *                         type: string
//  *                       qrCode:
//  *                         type: string
//  *                   absentMembers:
//  *                     type: array
//  *                     items:
//  *                       type: object
//  *                       properties:
//  *                         _id:
//  *                           type: string
//  *                         nom:
//  *                           type: string
//  *                         prenom:
//  *                           type: string
//  *       - $ref: '#/components/parameters/specificDate'
//  *       - $ref: '#/components/parameters/startDate'
//  *       - $ref: '#/components/parameters/endDate'
//  *       - $ref: '#/components/parameters/programme'
//  *     responses:
//  *       200:
//  *         $ref: '#/components/schemas/Absence'
//  */

// /**
//  * @swagger
//  * /api/absence/repetition/pupitre:
//  *   get:
//  *     summary: Fetch all repetition absences by pupitre
//  *     description: Retrieve a list of all absences for repetition grouped by pupitre with optional filtering
//  *     tags: [Absence]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of absences retrieved successfully by pupitre
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   repetition:
//  *                     type: object
//  *                     properties:
//  *                       _id:
//  *                         type: string
//  *                       lieu:
//  *                         type: string
//  *                       date:
//  *                         type: string
//  *                         format: date
//  *                       heureDeb:
//  *                         type: string
//  *                       heureFin:
//  *                         type: string
//  *                   absentMembersByPupitre:
//  *                     type: object
//  *                     properties:
//  *                       soprano:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             _id:
//  *                               type: string
//  *                             nom:
//  *                               type: string
//  *                             prenom:
//  *                               type: string
//  *                       alto:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             _id:
//  *                               type: string
//  *                             nom:
//  *                               type: string
//  *                             prenom:
//  *                               type: string
//  *                       ténor:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             _id:
//  *                               type: string
//  *                             nom:
//  *                               type: string
//  *                             prenom:
//  *                               type: string
//  *                       basse:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             _id:
//  *                               type: string
//  *                             nom:
//  *                               type: string
//  *                             prenom:
//  *                               type: string
//  */

// /*     description: Retrieve a list of all absences for repetition grouped by pupitre
//  *     tags: [Absence]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - $ref: '#/components/parameters/specificDate'
//  *       - $ref: '#/components/parameters/startDate'
//  *       - $ref: '#/components/parameters/endDate'
//  *       - $ref: '#/components/parameters/programme'
//  *     responses:
//  *       200:
//  *         $ref: '#/components/schemas/Absence'
//  */

// /**
//  * @swagger
//  * /api/absence/repetition/choriste:
//  *   get:
//  *     summary: Fetch all absences by choriste
//  *     description: Retrieve a list of all absences for repetition grouped by choriste with optional filtering
//  *     tags: [Absence]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of absences retrieved successfully by choriste
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   repetition:
//  *                     type: object
//  *                     properties:
//  *                       _id:
//  *                         type: string
//  *                       lieu:
//  *                         type: string
//  *                       date:
//  *                         type: string
//  *                         format: date
//  *                       heureDeb:
//  *                         type: string
//  *                       heureFin:
//  *                         type: string
//  *                   absentMembersByChoriste:
//  *                     type: array
//  *                     items:
//  *                       type: object
//  *                       properties:
//  *                         _id:
//  *                           type: string
//  *                         nom:
//  *                           type: string
//  *                         prenom:
//  *                           type: string
//  *     description: Retrieve a list of all absences for repetition grouped by choriste
//  *     tags: [Absence]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - $ref: '#/components/parameters/specificDate'
//  *       - $ref: '#/components/parameters/startDate'
//  *       - $ref: '#/components/parameters/endDate'
//  *       - $ref: '#/components/parameters/programme'
//  *     responses:
//  *       200:
//  *         $ref: '#/components/schemas/Absence'
//  */

module.exports = router;
