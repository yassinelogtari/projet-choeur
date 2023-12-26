const router = require("express").Router();

const presenceController = require("../controllers/presenceController");
const authMiddleware = require("../middlewares/auth");

router.put("/cancert", authMiddleware.loggedMiddleware,presenceController.markPresenceToCancert);
router.put("/repetition", authMiddleware.loggedMiddleware,presenceController.markPresenceToRepetition);

module.exports = router;
