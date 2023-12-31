const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/auditionController");
const authMiddleware = require("../middlewares/auth");

router.post("/generate",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, auditionController.generateSchedule);
router.post("/generate/additional",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, auditionController.generateAdditionalSchedule);
router.get("/",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, auditionController.fetshAuditions);
router.post("/addinfo", auditionController.addAuditionInfo);
router.patch('/update-audition/:auditionId', auditionController.updateAudition);
router.delete('/deleteaudition/:auditionId', auditionController.deleteAudition);

module.exports = router;
