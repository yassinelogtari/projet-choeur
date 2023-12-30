const router = require("express").Router()
const placementController = require("../controllers/placementController")

router.post("/placerMembre",placementController.addPlacement)
router.get("/getPlacementById/:id",placementController.getPlacementById)
router.patch("/updatePlacement/:id",placementController.updatePlacement)
module.exports=router;