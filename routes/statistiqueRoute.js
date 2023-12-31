const router = require("express").Router();

const StatisticsController=require("../controllers/statistiqueController")
const authMiddleware = require("../middlewares/auth");



router.get("/concert",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,StatisticsController.fetchStatisticsByConcert)
router.get("/oeuvre",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,StatisticsController.fetchStatisticsByOeuvre)
router.get("/choriste",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,StatisticsController.fetchStatisticsByChoriste)

module.exports = router;