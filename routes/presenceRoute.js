const router = require("express").Router();

const presenceController = require("../controllers/presenceController");
const authMiddleware = require("../middlewares/auth");

router.put("/cancert", authMiddleware.loggedMiddleware,authMiddleware.isChoriste,presenceController.markPresenceToCancert);
router.put("/repetition", authMiddleware.loggedMiddleware,authMiddleware.isChoriste,presenceController.markPresenceToRepetition);
router.put("/manually/cancert", authMiddleware.loggedMiddleware,authMiddleware.isChefPupitre,presenceController.markPresenceToCancertManualy);
router.put("/manually/repetition", authMiddleware.loggedMiddleware,authMiddleware.isChefPupitre,presenceController.markPresenceToRepetitionManualy);

module.exports = router;
