const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/auditionController");
const multer=require('multer')
const storage=multer.memoryStorage()
const upload=multer({storage:storage})

router.post("/generate", auditionController.generateSchedule);
router.post("/generate/additional", auditionController.generateAdditionalSchedule);

router.get("/", auditionController.fetshAuditions);
router.post("/addinfo", auditionController.addAuditionInfo);
router.get("/listeCanadidatParPupitre/:tessiture",auditionController.candidatsParTessiture)
router.post("/accepterCandidat",upload.single('charte'),auditionController.accepterCandidatParAudition)
router.put('/updateaudition', auditionController.updateAudition); 
router.delete('/deleteaudition/:auditionId', auditionController.deleteAudition);

module.exports = router;
