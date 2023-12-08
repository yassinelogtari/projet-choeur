const express=require("express")
const router=express.Router()
const congeController=require("../controllers/congeController")
router.post("/:id",congeController.insertConge)
module.exports=router