const express = require("express");
const router = express.Router();
const disponibilityToCancertController = require("../controllers/disponibilityToCancertController");
router.put("/add", disponibilityToCancertController.addDisponibility);
router.get(
  "/disponibleMembers/:idC",
  disponibilityToCancertController.FetchDisponibleMembers
);
module.exports = router;
