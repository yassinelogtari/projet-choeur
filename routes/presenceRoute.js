const router = require("express").Router();

const presenceController = require("../controllers/presenceController");
const authMiddleware = require("../middlewares/auth");

router.put("/cancert", authMiddleware.loggedMiddleware,authMiddleware.isChoriste,presenceController.markPresenceToCancert);
router.put("/repetition", authMiddleware.loggedMiddleware,authMiddleware.isChoriste,presenceController.markPresenceToRepetition);
router.put("/manually/cancert", authMiddleware.loggedMiddleware,authMiddleware.isChefPupitre,presenceController.markPresenceToCancertManualy);
router.put("/manually/repetition", authMiddleware.loggedMiddleware,authMiddleware.isChefPupitre,presenceController.markPresenceToRepetitionManualy);


/**
 * @swagger
 * /api/absence/cancert:
 *   put:
 *     summary: Mark presence to a concert
 *     description: Mark presence for a member to a specific concert
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Absence'
 *     responses:
 *       200:
 *         description: Presence marked successfully
 *       400:
 *         description: Bad request, check the request body
 *       404:
 *         description: Concert or member not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/absence/repetition:
 *   put:
 *     summary: Mark presence to a repetition
 *     description: Mark presence for a member to a specific repetition
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Absence'
 *     responses:
 *       200:
 *         description: Presence marked successfully
 *       400:
 *         description: Bad request, check the request body
 *       404:
 *         description: Repetition or member not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/absence/manually/cancert:
 *   put:
 *     summary: Manually mark presence to a concert
 *     description: Manually mark presence for a member to a specific concert
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Absence'
 *     responses:
 *       200:
 *         description: Presence marked successfully
 *       400:
 *         description: Bad request, check the request body
 *       404:
 *         description: Concert or member not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/absence/manually/repetition:
 *   put:
 *     summary: Manually mark presence to a repetition
 *     description: Manually mark presence for a member to a specific repetition
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Absence'
 *     responses:
 *       200:
 *         description: Presence marked successfully
 *       400:
 *         description: Bad request, check the request body
 *       404:
 *         description: Repetition or member not found
 *       500:
 *         description: Internal Server Error
 */

module.exports = router;
