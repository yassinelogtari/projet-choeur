const router = require("express").Router();

const authMiddleware = require("../middlewares/auth");

const profileController = require("../controllers/profileController");
const { fetchAbsences} = require('../controllers/profileController');
router.get("/liste-des-nomines",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,profileController.fetchNominatedMembers)
router.get("/liste-des-elimines",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,profileController.fetchEliminatedMembers)
router.get("/history/:id",authMiddleware.loggedMiddleware,authMiddleware.isChoriste,  profileController.fetchHistory);
router.get("/getUser/:id", profileController.getUser);
router.put("/notification/:id", profileController.updateNotificationField);
router.get('/absences/:id',authMiddleware.loggedMiddleware,authMiddleware.isAdmin, async (req, res) => {
    const memberId = req.params.id;
  
    try {
      const absencesResponse = await fetchAbsences(memberId);
      res.json(absencesResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
router.get("/historique-status/:id",authMiddleware.loggedMiddleware,authMiddleware.isChoriste,profileController.fetchHistoriqueStatus)
router.post('/eliminateChoristepour-un-raison/:memberId',authMiddleware.loggedMiddleware,authMiddleware.isAdmin,profileController.eliminateChoristeForReason);

/**
 * @swagger
 * /api/profile/liste-des-nomines:
 *   get:
 *     summary: Fetch nominated members
 *     description: Fetch members nominated for their excellent presence
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nominated members fetched successfully
 *       404:
 *         description: Members not found or current season not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/profile/liste-des-elimines:
 *   get:
 *     summary: Fetch eliminated members
 *     description: Fetch members eliminated due to excessive absences
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Eliminated members fetched successfully
 *       404:
 *         description: Choristers not found or current season not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/profile/history/{id}:
 *   get:
 *     summary: Fetch member's history
 *     description: Fetch member's history including concerts and repetitions attended
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the member
 *       - in: query
 *         name: oeuvre
 *         schema:
 *           type: string
 *         description: Optional filter by oeuvre name
 *     responses:
 *       200:
 *         description: Member's history fetched successfully
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/profile/getUser/{id}:
 *   get:
 *     summary: Fetch user details
 *     description: Fetch details of a specific user
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       201:
 *         description: Member not found in the DB
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/profile/notification/{id}:
 *   put:
 *     summary: Update notification field
 *     description: Update notification preferences for a user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/profile/absences/{id}:
 *   get:
 *     summary: Fetch member's absences
 *     description: Fetch member's concert and repetition absences
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the member
 *     responses:
 *       200:
 *         description: Absences fetched successfully
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/profile/historique-status/{id}:
 *   get:
 *     summary: Fetch member's historical status
 *     description: Fetch member's historical status
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the member
 *     responses:
 *       200:
 *         description: Historical status fetched successfully
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EliminateChoristeForReasonRequest:
 *       type: object
 *       properties:
 *         reason:
 *           type: string
 *           description: The reason for eliminating the chorister
 */

/**
 * @swagger
 * /api/profile/eliminateChoristepour-un-raison/{memberId}:
 *   post:
 *     summary: Eliminate chorister for a reason
 *     description: Eliminate chorister for disciplinary reason
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the member
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EliminateChoristeForReasonRequest'
 *     responses:
 *       200:
 *         description: Chorister eliminated for disciplinary reason
 *       404:
 *         description: Chorister not found or not a chorister
 *       500:
 *         description: Error eliminating chorister for disciplinary reason
 */


module.exports = router;
