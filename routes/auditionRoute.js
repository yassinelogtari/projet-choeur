const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/auditionController");

router.post("/generate", auditionController.generateSchedule);
router.post("/generate/additional", auditionController.generateAdditionalSchedule);

router.get("/", auditionController.fetshAuditions);
router.post("/addinfo", auditionController.addAuditionInfo);

module.exports = router;
