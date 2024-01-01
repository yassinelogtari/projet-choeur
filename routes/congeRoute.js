const express=require("express")
const router=express.Router()
const congeController=require("../controllers/congeController")
const auth=require("../middlewares/auth")
router.post("/:id",auth.loggedMiddleware,auth.isChoriste,congeController.insertConge);
router.post('/valider/:id', congeController.validerConge); 

module.exports=router