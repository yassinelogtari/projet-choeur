const router = require("express").Router();
const candidatController = require("../controllers/candidatController");

router.get("/", candidatController.fetshCandidats);

module.exports = router;
