const router = require("express").Router();
const candidatController = require("../controllers/candidatController");
const dateMiddlewarefunc=require("../middlewares/dateRangeMiddleware")
const multer=require('multer')
const storage=multer.memoryStorage()
const upload=multer({storage:storage})


router.post("/verif",candidatController.addEmailCandidat)
router.get("/:id/verify/:token/", candidatController.getToken)
router.post("/form/date",candidatController.dateFormRange)
router.put("/form/date",candidatController.updateDateRange)
router.post("/form/:id",dateMiddlewarefunc,candidatController.rempForm)

router.get("/",  candidatController.fetshCandidats);
router.post("/accepterCandidat/:id",upload.single('charte'),candidatController.accepterCandidat)
module.exports = router;
