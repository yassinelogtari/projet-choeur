const router = require("express").Router();

const Saison=require("../controllers/saisonController")




router.get("/archive/:date",Saison.fetchArchiverSaison)
router.post("/createSaison",Saison.createSaison)
router.get("/getSaison/:id",Saison.getSaisonByid)
router.put("/updateSaison/:id",Saison.updateSaison)
module.exports = router;