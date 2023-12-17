const router = require("express").Router();

const presenceController = require("../controllers/presenceController");

router.put("/cancert", presenceController.markPresenceToCancert);
router.put("/repetition", presenceController.markPresenceToRepetition);

module.exports = router;
