const router = require("express").Router();

const saisonController=require("../controllers/saisonController")
const middlewareSaison=require("../middlewares/auth")

router.post('/archiveSeason/:seasonId',middlewareSaison.loggedMiddleware,middlewareSaison.isAdmin,saisonController.archiveSeason);
router.post("/createSaison",middlewareSaison.loggedMiddleware,middlewareSaison.isAdmin,saisonController.createSaison)
router.get("/getSaison/:id",middlewareSaison.loggedMiddleware,middlewareSaison.isAdmin,saisonController.getSaisonByid)
router.post("/updatestatus",saisonController.updateStatus)
router.post("/designerChefsdePupitre",saisonController.designerChefsDePupitre)
router.post("/modifierseuil",saisonController.updateSeuilForCurrentSeason)
router.post("/quitter/:id",saisonController.quitterChoeur)

module.exports = router;