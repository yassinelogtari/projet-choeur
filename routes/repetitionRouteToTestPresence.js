const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetitionController");

router.post("/create", repetitionController.createRepetition);
router.get('/:repetitionId/presence', repetitionController.listPresenceByPupitre);
router.delete("/annuler/:id",repetitionController.deleteRepetition)
router.get("/getRepetition/:id",repetitionController.getRepetitionById)
router.get("/getAllRepetition",repetitionController.getAllRepetition)
router.patch("/update/:id",repetitionController.updateRepetition)
module.exports = router;
