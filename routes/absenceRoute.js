const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absenceController");


router.get("/repetition/", absenceController.fetchAllRepetitionAbsence);

router.get("/repetition/pupitre", absenceController.fetchAllRepetitionAbsenceByPupitre);

router.get("/repetition/choriste", absenceController.fetchAllAbsentMembersByChoriste);


module.exports = router;
