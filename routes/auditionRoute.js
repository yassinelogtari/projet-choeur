const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/auditionController");

router.post("/generate", auditionController.generateSchedule);
router.post("/generate/additional", auditionController.generateAdditionalSchedule);
router.get("/", auditionController.fetshAuditions);
router.post("/addinfo", auditionController.addAuditionInfo);
router.put('/updateaudition', auditionController.updateAudition); 
router.delete('/deleteaudition/:auditionId', auditionController.deleteAudition);

module.exports = router;
