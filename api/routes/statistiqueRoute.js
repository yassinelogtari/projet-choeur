const router = require("express").Router();

const StatisticsController=require("../controllers/statistiqueController")
const authMiddleware = require("../middlewares/auth");



router.get("/concert",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,StatisticsController.fetchStatisticsByConcert)
router.get("/oeuvre",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,StatisticsController.fetchStatisticsByOeuvre)
router.get("/choriste",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,StatisticsController.fetchStatisticsByChoriste)


/**
 * @swagger
 * /api/statistics/concert:
 *   get:
 *     summary: Fetch concert statistics
 *     description: Fetch statistics related to each concert, including member presence, absence, mastering oeuvres, and repetition statistics.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Concert statistics fetched successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/statistics/oeuvre:
 *   get:
 *     summary: Fetch oeuvre statistics
 *     description: Fetch statistics related to each oeuvre, including member presence, absence, mastering count, and repetition statistics.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Oeuvre statistics fetched successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/statistics/choriste:
 *   get:
 *     summary: Fetch choriste statistics
 *     description: Fetch statistics related to each choriste, including presence, absence, mastering oeuvres, and repetition statistics.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Choriste statistics fetched successfully
 *       500:
 *         description: Internal Server Error
 */

module.exports = router;