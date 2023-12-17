const express=require("express")
const router=express.Router()
const congeController=require("../controllers/congeController")
router.post("/:id",congeController.insertConge);
router.put('/valider/:id', congeController.validerConge); 
router.get('/notifier', async (req, res) => {
    try {
        const listePersonnesANotifier = await congeController.personnesANotifierSansConge();
        return res.status(200).json({ personnesANotifier: listePersonnesANotifier });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports=router