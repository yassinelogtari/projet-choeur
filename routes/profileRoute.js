const router = require("express").Router();

const authMiddleware = require("../middlewares/auth");

const profileController = require("../controllers/profileController");
const { fetchAbsences} = require('../controllers/profileController');
router.get("/liste-des-nomines",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,profileController.fetchNominatedMembers)
router.get("/liste-des-elimines",authMiddleware.loggedMiddleware,authMiddleware.isAdmin,profileController.fetchEliminatedMembers)
router.get("/history/:id",authMiddleware.loggedMiddleware,authMiddleware.isChoriste,  profileController.fetchHistory);
router.get("/getUser/:id", profileController.getUser);
router.put("/notification/:id", profileController.updateNotificationField);
router.get('/absences/:id',authMiddleware.loggedMiddleware,authMiddleware.isAdmin, async (req, res) => {
    const memberId = req.params.id;
  
    try {
      const absencesResponse = await fetchAbsences(memberId);
      res.json(absencesResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
router.get("/historique-status/:id",authMiddleware.loggedMiddleware,authMiddleware.isChoriste,profileController.fetchHistoriqueStatus)
router.post('/eliminateChoristepour-un-raison/:memberId',authMiddleware.loggedMiddleware,authMiddleware.isAdmin,profileController.eliminateChoristeForReason);

module.exports = router;
