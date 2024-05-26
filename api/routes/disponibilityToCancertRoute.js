const express = require("express");
const router = express.Router();
const disponibilityToCancertController = require("../controllers/disponibilityToCancertController");
const authMiddleware = require("../middlewares/auth");



router.put("/add",/*authMiddleware.loggedMiddleware, authMiddleware.isChoriste*/ disponibilityToCancertController.addDisponibility);
router.get("/disponibleMembers/:idC",authMiddleware.loggedMiddleware, authMiddleware.isAdmin,disponibilityToCancertController.FetchDisponibleMembers);



/**
 * @swagger
 * components:
 *   schemas:
 *     DisponibilityToConcert:
 *       type: object
 *       properties:
 *         memberId:
 *           type: string
 *           description: The ID of the member
 *         concertId:
 *           type: string
 *           description: The ID of the concert
 *         availability:
 *           type: boolean
 *           description: The availability status (true for available, false for not available)
 */

/**
 * @swagger
 * /api/disponibility/cancert/add:
 *   put:
 *     summary: Add disponibility to a concert
 *     description: Add disponibility information for a member to a specific concert
 *     tags: [DispoToConcert]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisponibilityToConcert'
 *     responses:
 *       200:
 *         description: Disponibility added successfully
 *       400:
 *         description: Bad request, check the request body
 *       404:
 *         description: Concert or member not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/disponibility/cancert/disponibleMembers/{idC}:
 *   get:
 *     summary: Fetch available members for a concert
 *     description: Retrieve a list of members who are available for a specific concert
 *     tags: [DispoToConcert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idC
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the concert
 *       - in: query
 *         name: pupitre
 *         schema:
 *           type: string
 *         description: Filter available members by pupitre
 *     responses:
 *       200:
 *         description: List of available members retrieved successfully
 *       404:
 *         description: Concert not found
 *       500:
 *         description: Internal Server Error
 */


module.exports = router;
