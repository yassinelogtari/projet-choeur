const router = require("express").Router();
const candidatController = require("../controllers/candidatController");


router.post("/verif",candidatController.addCandidat)
router.get("/:id/verify/:token/", candidatController.getToken)
router.post("/form/:id",candidatController.rempForm)

router.get("/", candidatController.fetshCandidats);

module.exports = router;
