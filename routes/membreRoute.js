const router = require("express").Router()
const membreController = require("../controllers/membreController")
router.patch("/modifierTessiture/:id",membreController.modifierTessiture)
router.post("/register",membreController.register)
router.post("/login",membreController.login )
router.get("/getMembreById/:id",membreController.getMemberById )
router.get("/getAllMembers",membreController.getAllMembers )
router.delete("/deleteMember/:id",membreController.deleteMember )

module.exports=router;