const Conge=require("../models/congeModel")
const Membre=require("../models/membreModel")
const { userSocketMap } = require("../utils/socket");
const sendNotificationMiddleware = require("../middlewares/sendNotificationMiddleware")

const addQrCodeToConcert = require("../middlewares/createQrCodeMiddleware");
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
                raison,
                valide: false,
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
const validerConge = async (req, res) => {
    try {
        const { id: congeId } = req.params;

        const conge = await Conge.findByIdAndUpdate(congeId, { valide: true }, { new: true });

        if (!conge) {
            return res.status(404).json({ message: 'Congé non trouvé' });
        }

        const updatedMembre = await Membre.findByIdAndUpdate(conge.membre, { statut: "En congé" });

        if (updatedMembre) {
            const chefPupitreByUpdatedMemberUsers = await Membre.find({
              role: "chef du pupitre",
              pupitre: updatedMembre.pupitre,
            });
    
            chefPupitreByUpdatedMemberUsers.forEach(async (chefPupitreUser) => {
              const chefPupitreSocketId = userSocketMap[chefPupitreUser._id];
             
              if (chefPupitreSocketId) {
                req.notificationData = {
                  userId: chefPupitreUser._id,
                  notificationMessage: `${updatedMembre.prenom} ${updatedMembre.nom} a changé son statut "En congé".`,
                };
    
                await sendNotificationMiddleware(req, res, () => {});
              }
            });
          }

        return res.status(200).json({ message: 'Congé validé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const personnesANotifierSansConge = async () => {
    try {

        const membresSansConge = await Membre.find({  statut: { $ne: 'En congé' } }, 'nom prenom');
        

        return membresSansConge;
    } catch (error) {
        throw error;
    }
};





    
module.exports={
    insertConge,
    validerConge,
    personnesANotifierSansConge
}