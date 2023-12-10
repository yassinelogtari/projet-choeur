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
router.post("/accepterCandidat",upload.single('charte'),auditionController.accepterCandidatParAudition)
module.exports = router;
