const express=require("express")
const router=express.Router()

const Condidat=require("../controllers/candidat")

router.post("/verif",Condidat.addCondidat)
router.get("/:id/verify/:token/", Condidat.getToken)

module.exports=router