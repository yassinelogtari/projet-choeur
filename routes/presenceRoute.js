const router = require("express").Router();

const presenceController = require("../controllers/presenceController");
const authMiddleware = require("../middlewares/auth");

router.put("/cancert", authMiddleware.loggedMiddleware,presenceController.markPresenceToCancert);
router.put("/repetition", authMiddleware.loggedMiddleware,presenceController.markPresenceToRepetition);
router.put("/manually/cancert", presenceController.markPresenceToCancertManualy);
router.put("/manually/repetition", presenceController.markPresenceToRepetitionManualy);

module.exports = router;
