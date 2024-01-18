const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absenceController");
const authMiddleware = require("../middlewares/auth");

router.get("/repetition/",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, absenceController.fetchAllRepetitionAbsence);

router.get("/repetition/pupitre",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, absenceController.fetchAllRepetitionAbsenceByPupitre);

router.get("/repetition/choriste",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, absenceController.fetchAllAbsentMembersByChoriste);


/**
 * @swagger
 * /api/absence/repetition:
 *   get:
 *     summary: Fetch all repetition absences
 *     description: Retrieve a list of all absences for repetition
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/specificDate'
 *       - $ref: '#/components/parameters/startDate'
 *       - $ref: '#/components/parameters/endDate'
 *       - $ref: '#/components/parameters/programme'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Absence'
 */

/**
 * @swagger
 * /api/absence/repetition/pupitre:
 *   get:
 *     summary: Fetch all repetition absences by pupitre
 *     description: Retrieve a list of all absences for repetition grouped by pupitre
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/specificDate'
 *       - $ref: '#/components/parameters/startDate'
 *       - $ref: '#/components/parameters/endDate'
 *       - $ref: '#/components/parameters/programme'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Absence'
 */

/**
 * @swagger
 * /api/absence/repetition/choriste:
 *   get:
 *     summary: Fetch all absences by choriste
 *     description: Retrieve a list of all absences for repetition grouped by choriste
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/specificDate'
 *       - $ref: '#/components/parameters/startDate'
 *       - $ref: '#/components/parameters/endDate'
 *       - $ref: '#/components/parameters/programme'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Absence'
 */

module.exports = router;
