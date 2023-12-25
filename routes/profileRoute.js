const router = require("express").Router();

const profileController = require("../controllers/profileController");

router.get("/history/:id", profileController.fetchHistory);
router.get("/:nom", profileController.getUser);
router.put("/notification/:id", profileController.updateNotificationField);
router.get("/absences/:id", profileController.fetchAbsences);
router.get("/historique-status/:id",profileController.fetchHistoriqueStatus)

module.exports = router;
