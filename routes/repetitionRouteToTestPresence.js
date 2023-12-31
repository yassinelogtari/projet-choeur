const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetitionController");
const middlewareRepetition=require("../middlewares/auth")

router.post("/create", repetitionController.createRepetition);
router.delete("/annuler/:id",repetitionController.deleteRepetition)
router.get("/getRepetition/:id",repetitionController.getRepetitionById)
router.get("/getAllRepetition",repetitionController.getAllRepetition)
router.patch("/update/:id",repetitionController.updateRepetition)
router.get('/:repetitionId/presence',middlewareRepetition.loggedMiddleware,middlewareRepetition.isChefPupitre,repetitionController.listPresenceByPupitre);
module.exports = router;
