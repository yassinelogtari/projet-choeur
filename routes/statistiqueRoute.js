const router = require("express").Router();

const StatisticsController=require("../controllers/statistiqueController")




router.get("/concert",StatisticsController.fetchStatisticsByConcert)
router.get("/oeuvre",StatisticsController.fetchStatisticsByOeuvre)
router.get("/choriste",StatisticsController.fetchStatisticsByChoriste)

module.exports = router;