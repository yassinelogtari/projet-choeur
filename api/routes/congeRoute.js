const express = require("express");
const router = express.Router();
const congeController = require("../controllers/congeController");
const auth = require("../middlewares/auth");
router.post(
  "/" /*,auth.loggedMiddleware,auth.isChoriste*/,
  congeController.insertConge
);
router.post(
  "/valider/:id",
  auth.loggedMiddleware,
  auth.isAdmin,
  congeController.validerConge
);

/**
 * @swagger
 * tags:
 *   name: Conge
 *   description: Conge management
 */

/**
 * @swagger
 * /api/conge/:
 *   post:
 *     summary: Declare a congé
 *     description: Declare a congé for a choriste
 *     tags: [Conge]
 *     security:
 *       - bearerAuth: []
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             dateDebut: "2024-01-20"
 *             dateFin: "2024-01-25"
 *             raison: "Vacances"
 *     responses:
 *       201:
 *         description: Congé saved successfully
 *       400:
 *         description: Error saving congé or invalid request
 *       404:
 *         description: Membre not found or insufficient permission
 */

/**
 * @swagger
 * /api/conge/valider/{id}:
 *   post:
 *     summary: Validate a congé
 *     description: Validate a congé for admin users
 *     tags: [Conge]
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
 *         description: Congé validated successfully
 *       404:
 *         description: Congé not found
 *       500:
 *         description: Error validating congé
 */

module.exports = router;
