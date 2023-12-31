const router = require("express").Router();
const candidatController = require("../controllers/candidatController");
const dateMiddleware=require("../middlewares/dateRangeMiddleware")
const middlewareDate=require("../middlewares/auth")
const multer=require('multer')
const storage=multer.memoryStorage()
const upload=multer({storage:storage})

router.post("/verif",candidatController.addEmailCandidat)
router.get("/:id/verify/:token/", candidatController.getToken)
router.post("/form/date",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,candidatController.dateFormRange)
router.put("/form/date",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,candidatController.updateDateRange)
router.post("/form/:id",dateMiddleware,candidatController.rempForm)
router.get("/",  candidatController.fetshCandidats);
router.get("/listeCandidatParPupitre/:tessiture",candidatController.candidatsParTessiture)
router.post("/accepterCandidat",upload.single('charte'),candidatController.accepterCandidatParAudition)
router.get('/confirm/:id', candidatController.confirmParticipationEtDevenirChoriste);

module.exports = router;
