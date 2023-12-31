const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absenceController");
const authMiddleware = require("../middlewares/auth");

router.get("/repetition/",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, absenceController.fetchAllRepetitionAbsence);

router.get("/repetition/pupitre",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, absenceController.fetchAllRepetitionAbsenceByPupitre);

router.get("/repetition/choriste",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, absenceController.fetchAllAbsentMembersByChoriste);


module.exports = router;
