const router = require("express").Router();

const SaisonArch=require("../controllers/saisonController")



router.get("/archive/:date",SaisonArch.fetchArchiverSaison)



module.exports = router;