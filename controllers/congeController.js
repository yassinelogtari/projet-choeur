const Conge=require("../models/congeModel")
const Membre=require("../models/membreModel")
const insertConge=async(req,res)=>{
    try{
        const memberId=req.params.id
        const {dateDebut,dateFin,raison}=req.body
        const membre=await Membre.findById(memberId)
        if(!membre){
            return res.status(404).json({message:'Membre non trouvé'})
        }
        if(membre.role=="choriste"){
            const congeExist=await Conge.findOne({
                membre:memberId,
                $or:[
                    {
                            dateDebut:{$lte:dateFin},
                            dateFin:{$gte:dateDebut},
                    },
                ]
            })
            if(congeExist){
                return res.status(400).json({message:"Congé déjà déclaré pour cette période"})
            }
            const conge=new Conge({
                membre:memberId,
                dateDebut,
                dateFin,
                raison
            })
            await conge.save()
            return res.status(201).json({message:"Congé sauvegardé avec succées"})

        }
        else{
            res.status(404).json({message:"Vous n'avez pas la permission de déclarer un congé"}) 
        }
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}
    
module.exports={
    insertConge
}