const router = require("express").Router();

const saisonController=require("../controllers/saisonController")

router.post('/archiveSeason/:seasonId', saisonController.archiveSeason);
router.post("/createSaison",saisonController.createSaison)
router.get("/getSaison/:id",saisonController.getSaisonByid)
router.post("/updatestatus",saisonController.updateStatus)
router.post("/designerChefsdePupitre",saisonController.designerChefsDePupitre)
module.exports = router;