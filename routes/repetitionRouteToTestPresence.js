const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetitionController");

router.post("/create", repetitionController.createRepetition);

module.exports = router;
