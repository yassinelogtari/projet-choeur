const express = require("express");
const router = express.Router();
const disponibilityToCancertController = require("../controllers/disponibilityToCancertController");
const authMiddleware = require("../middlewares/auth");



router.put("/add", authMiddleware.loggedMiddleware, authMiddleware.isChoriste, disponibilityToCancertController.addDisponibility);
router.get("/disponibleMembers/:idC",authMiddleware.loggedMiddleware, authMiddleware.isAdmin,disponibilityToCancertController.FetchDisponibleMembers);


module.exports = router;
