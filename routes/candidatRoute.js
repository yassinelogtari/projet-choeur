const router = require("express").Router();
const candidatController = require("../controllers/candidatController");


router.post("/verif",candidatController.addCondidat)
router.get("/:id/verify/:token/", candidatController.getToken)
router.get("/", candidatController.fetshCandidats);

module.exports = router;
