const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetitionController");

router.post("/create", repetitionController.createRepetition);
router.get('/:repetitionId/presence', repetitionController.listPresenceByPupitre);


module.exports = router;
