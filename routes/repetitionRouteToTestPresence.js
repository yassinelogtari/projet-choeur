const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetitionController");
const middlewareRepetition=require("../middlewares/auth")

router.post("/create", middlewareRepetition.loggedMiddleware,middlewareRepetition.isAdmin,repetitionController.createRepetition);
router.delete("/annuler/:id",middlewareRepetition.loggedMiddleware,middlewareRepetition.isAdmin,repetitionController.deleteRepetition)
router.get("/getRepetition/:id",middlewareRepetition.loggedMiddleware,middlewareRepetition.isAdmin,repetitionController.getRepetitionById)
router.get("/getAllRepetition",middlewareRepetition.loggedMiddleware,middlewareRepetition.isAdmin,repetitionController.getAllRepetition)
router.patch("/update/:id",middlewareRepetition.loggedMiddleware,middlewareRepetition.isAdmin,repetitionController.updateRepetition)
router.get('/:repetitionId/presence',middlewareRepetition.loggedMiddleware,middlewareRepetition.isChefPupitre,repetitionController.listPresenceByPupitre);
module.exports = router;
