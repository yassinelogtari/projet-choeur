const router = require("express").Router()
const membreController = require("../controllers/membreController")
router.patch("/modifierTessiture/:id",membreController.modifierTessiture)

router.post("/designerChefsDePupitre",membreController.designerChefsDePupitre)
module.exports=router