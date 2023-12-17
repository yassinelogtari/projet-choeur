const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/auditionController");
const multer=require('multer')
const storage=multer.memoryStorage()
const upload=multer({storage:storage})

router.post("/generate", auditionController.generateSchedule);
router.get("/", auditionController.fetshAuditions);
router.post("/addinfo", auditionController.addAuditionInfo);
router.get("/listeCandidatParPupitre/:tessiture",auditionController.candidatsParTessiture)
router.post("/accepterCandidat",upload.single('charte'),auditionController.accepterCandidatParAudition)
module.exports = router;
