const router = require("express").Router();

const oeuvreController=require("../controllers/oeuvreController")


router.post("/addoeuvre",oeuvreController.addOeuvre);
router.get("/getAll",oeuvreController.fetchOeuvre);
router.get("/getOne/:id",oeuvreController.getByidOeuvre);
router.delete("/:id",oeuvreController.deleteOuvre);
router.patch("/update/:id",oeuvreController.updateOeuvre)



module.exports = router;