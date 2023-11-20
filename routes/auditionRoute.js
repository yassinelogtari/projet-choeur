const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/auditionController");

router.post("/generate", auditionController.generateSchedule);

router.get("/", auditionController.fetshAuditions);
router.put("/:_idA/:_idC", auditionController.addAuditionToCandidat);

module.exports = router;
