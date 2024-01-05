const router = require("express").Router();

const saisonController=require("../controllers/saisonController")
const middlewareSaison=require("../middlewares/auth")

router.post('/archiveSeason/:seasonId',middlewareSaison.loggedMiddleware,middlewareSaison.isAdmin,saisonController.archiveSeason);
router.post("/createSaison",middlewareSaison.loggedMiddleware,middlewareSaison.isAdmin,saisonController.createSaison)
router.get("/getSaison/:id",middlewareSaison.loggedMiddleware,middlewareSaison.isAdmin,saisonController.getSaisonByid)
router.post("/updatestatus",middlewareSaison.loggedMiddleware,middlewareSaison.isAdmin,saisonController.updateStatus)
router.post("/designerChefsdePupitre",middlewareSaison.loggedMiddleware,middlewareSaison.isManager,saisonController.designerChefsDePupitre)
router.post("/modifierseuil",middlewareSaison.loggedMiddleware,middlewareSaison.isAdmin,saisonController.updateSeuilForCurrentSeason)
router.post("/quitter/:id",middlewareSaison.loggedMiddleware,middlewareSaison.isChoriste,saisonController.quitterChoeur)

module.exports = router;