const Membre = require("../models/membreModel")
const modifierTessiture=async(req,res)=>{
    try{
        const membre=await Membre.findOne({_id:req.params.id})
        if(!membre){
            return res.status(404).json({message:"Membre non trouvé"})
        }
        if(membre.role==="choriste"||membre.role==="chef du pupitre"){
            const updatedMembre = await Membre.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            )
            updatedMembre.password = undefined;
            return res.status(200).json({
                model:updatedMembre,
                message:"Tessiture modifiée avec succés",
            })
        }
        else{
            return res.status(403).json({
                message:"Tessiture modifiée uniquement pour les choristes ou les chefs du pupitre "
            })
        }
    }
    catch(error){
        return res.status(400).json({error:error.message})
    }
}
module.exports={
    modifierTessiture,
}