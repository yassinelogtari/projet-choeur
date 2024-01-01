const router = require("express").Router()
const placementController = require("../controllers/placementController")
const middlewareDate=require("../middlewares/auth")
router.post("/placerMembre",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,placementController.addPlacement)
router.get("/getPlacementById/:id",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,placementController.getPlacementById)
router.patch("/updatePlacement/:id",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,placementController.updatePlacement)
module.exports=router;