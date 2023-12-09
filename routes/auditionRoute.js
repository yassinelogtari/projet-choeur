const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/auditionController");

router.post("/generate", auditionController.generateSchedule);

router.get("/", auditionController.fetshAuditions);
router.post("/addinfo", auditionController.addAuditionInfo);

module.exports = router;
