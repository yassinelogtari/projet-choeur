const router = require("express").Router();
const candidatController = require("../controllers/candidatController");
const dateMiddlewarefunc=require("../middlewares/dateRangeMiddleware")



router.post("/verif",candidatController.addEmailCandidat)
router.get("/:id/verify/:token/", candidatController.getToken)
router.post("/form/date",candidatController.dateFormRange)
router.put("/form/date",candidatController.updateDateRange)
router.post("/form/:id",dateMiddlewarefunc,candidatController.rempForm)

router.get("/",  candidatController.fetshCandidats);
router.get('/confirm/:email', candidatController.confirmParticipation);
module.exports = router;
