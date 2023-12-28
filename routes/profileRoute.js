const router = require("express").Router();

const profileController = require("../controllers/profileController");
const { fetchAbsences} = require('../controllers/profileController');
router.get("/liste-des-nomines",profileController.fetchNominatedMembers)
router.get("/liste-des-elimines",profileController.fetchEliminatedMembers)
router.get("/history/:id", profileController.fetchHistory);
router.get("/getUser/:id", profileController.getUser);
router.put("/notification/:id", profileController.updateNotificationField);
router.get('/absences/:id', async (req, res) => {
    const memberId = req.params.id;
  
    try {
      const absencesResponse = await fetchAbsences(memberId);
      res.json(absencesResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
router.get("/historique-status/:id",profileController.fetchHistoriqueStatus)

module.exports = router;
