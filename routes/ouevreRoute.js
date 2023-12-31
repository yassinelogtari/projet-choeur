const router = require("express").Router();

const oeuvreController=require("../controllers/oeuvreController")
const middlewareOuvre=require("../middlewares/auth")

router.post("/addoeuvre",middlewareOuvre.loggedMiddleware,middlewareOuvre.isAdmin,oeuvreController.addOeuvre);
router.get("/getAll",middlewareOuvre.loggedMiddleware,middlewareOuvre.isAdmin,oeuvreController.fetchOeuvre);
router.get("/getOne/:id",middlewareOuvre.loggedMiddleware,middlewareOuvre.isAdmin,oeuvreController.getByidOeuvre);
router.delete("/:id",middlewareOuvre.loggedMiddleware,middlewareOuvre.isAdmin,oeuvreController.deleteOuvre);
router.patch("/update/:id",middlewareOuvre.loggedMiddleware,middlewareOuvre.isAdmin,oeuvreController.updateOeuvre)



module.exports = router;