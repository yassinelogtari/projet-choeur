const router = require("express").Router()
const membreController = require("../controllers/membreController")
router.patch("/modifierTessiture/:id",membreController.modifierTessiture)
router.post("/register",membreController.register)
router.post("/login",membreController.login )

module.exports=router