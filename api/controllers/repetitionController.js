const express = require("express");
const router = express.Router();
const Repetition = require("../models/repetitionModel");
const Membre = require("../models/membreModel");
const Saison=require("../models/saisonModel")
const addQrCodeToRepetition = require("../middlewares/createQrCodeMiddleware");
const {sendNotificationMiddleware} = require("../middlewares/sendNotificationMiddleware")
const { userSocketMap } = require("../utils/socket");

const genererListeMembres=async(pupitre,pourcentage)=>{
  const membresPupitre=await Membre.find({pupitre,statut:{$ne:'En congé'}}).or([{ role: 'choriste' }, { role: 'chef du pupitre' }]);
  if (pourcentage > 0 && pourcentage <= 100 && membresPupitre.length > 0) {
  const nombreMembres=Math.ceil((pourcentage/100)*membresPupitre.length)
  const listeAleatoire=[]
  while(listeAleatoire.length<nombreMembres){
    const randomMembre=membresPupitre[Math.floor(Math.random()*membresPupitre.length)]
    if(!listeAleatoire.some((m)=>m.member.equals(randomMembre._id))){
      listeAleatoire.push({member:randomMembre._id})
    }
  }
  return listeAleatoire
}
else{
  return []
}
}
const createRepetition = async (req, res) => {
  try {
    
    const {concert,lieu,DateRep,HeureDeb,HeureFin,pourcentages}=req.body

    /*const chefsSoprano=await Membre.findOne({_id:chefsPupitres.soprano,role:"chef du pupitre"})
    const chefsAlto=await Membre.findOne({_id:chefsPupitres.alto,role:"chef du pupitre"})
    const chefsTenor=await Membre.findOne({_id:chefsPupitres.tenor,role:"chef du pupitre"})
    const chefsBasse=await Membre.findOne({_id:chefsPupitres.basse,role:"chef du pupitre"})

    if(!chefsSoprano || !chefsAlto ||!chefsTenor || !chefsBasse){
      return res.status(400).json({message:"Certains membres spécifiés ne sont pas des chefs du pupitre"})
    }
    else{*/
    const membresSoprano=await genererListeMembres("soprano",pourcentages.soprano)
    const membresAlto=await genererListeMembres("alto",pourcentages.alto)
    const membresTenor=await genererListeMembres("ténor",pourcentages.tenor)
    const membresBasse=await genererListeMembres("basse",pourcentages.basse)
    /*if (pourcentages.soprano > 0 && membresSoprano.length != 0 ) membresSoprano.push({ member: chefsPupitres.soprano, role: "chef du pupitre" });
    if (pourcentages.alto > 0 && membresAlto.length != 0) membresAlto.push({ member: chefsPupitres.alto, role: "chef du pupitre" });
    if (pourcentages.tenor > 0 && membresTenor.length != 0) membresTenor.push({ member: chefsPupitres.tenor, role: "chef du pupitre" });
    if (pourcentages.basse > 0 && membresBasse.length != 0) membresBasse.push({ member: chefsPupitres.basse, role: "chef du pupitre" });*/
    const repetition=new Repetition({
      concert,
      lieu,
      DateRep,
      HeureDeb,
      HeureFin,
      membres:[...membresSoprano,...membresAlto,...membresTenor,...membresBasse]
    })
    
    
    const nouvelleRepition= repetition;

    const currentSaison = await Saison.findOne({ saisonCourante: true });
    if (currentSaison) {
      currentSaison.repetitions.push(nouvelleRepition);
      await currentSaison.save();
    }
    await repetition.save()
    
    req.repetitionId = repetition._id;
    await addQrCodeToRepetition.addQrCodeToRepetition(req, res, () => {});
  
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
const deleteRepetition=async(req,res)=>{
  try{
    const repetition=await Repetition.findByIdAndDelete({_id:req.params.id})
    if(repetition){
      return res.status(200).json({message:"Répétition annulée avec succées"})
    }
    else{
      return res.status(200).json({message:"Répétition n'existe pas"})
    }

  }
  catch(error){
    res.status(400).json({error:error.message})
  }
};
const getRepetitionById=async(req,res)=>{
  try{
    const repetition=await Repetition.findOne({_id:req.params.id}).populate({path:"concert",select:"titre"}).populate({path:"membres.member",select:"nom prenom email pupitre role"}).exec()
    if(repetition){

      const choristes={
        soprano:[],
        ténor:[],
        alto:[],
        basse:[],
      }
      
      repetition.membres.forEach((membre)=>{

        if(membre.member.pupitre==="soprano"){
          choristes["soprano"].push(membre.member)
        }
        else if(membre.member.pupitre==="ténor"){
          choristes["ténor"].push(membre.member)
        }
        else if(membre.member.pupitre==="alto"){
          choristes["alto"].push(membre.member)
        }
        else{
          choristes["basse"].push(membre.member)
        }
      })
      res.status(200).json({
        message:"Répétition trouvée",
        _id:repetition._id,
        concert:repetition.concert,
        lieu:repetition.lieu,
        DateRep:repetition.DateRep,
        HeureDeb:repetition.HeureDeb,
        HeureFin:repetition.HeureFin,
        QrCode:repetition.QrCode,
        membres:choristes,
      })
    }
    else{
      res.status(404).json({message:"Répétition non trouvée"})
    }
    
  }
  catch(error){
    res.status(400).json({error:error.message})
  }
}
const getAllRepetition = async (req, res) => {
  try {
    const repetitions = await Repetition.find()
      .populate({ path: "concert", select: "titre" })
      .populate({ path: "membres.member", select: "nom prenom email pupitre role" })
      .exec();

    const formattedRepetitions = repetitions.map((repetition) => {
      const choristes = {
        soprano: [],
        ténor: [],
        alto: [],
        basse: [],
      };

      repetition.membres.forEach((membre) => {

        if (membre.member.pupitre === "soprano") {
          choristes["soprano"].push(membre.member);
        } else if (membre.member.pupitre === "ténor") {
          choristes["ténor"].push(membre.member)
        } else if (membre.member.pupitre === "alto") {
          choristes["alto"].push(membre.member)
        } else {
          choristes["basse"].push(membre.member)
        }
      });

      return {
        _id:repetition._id,
        concert: repetition.concert,
        lieu: repetition.lieu,
        DateRep: repetition.DateRep,
        HeureDeb: repetition.HeureDeb,
        HeureFin: repetition.HeureFin,
        QrCode: repetition.QrCode,
        membres: choristes,
      };
    });

    res.status(200).json({
      message: "Données extraites avec succès",
      model: formattedRepetitions,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRepetition=async(req,res)=>{
  try{
    const repetition=await Repetition.findOneAndUpdate({_id:req.params.id},req.body,{new:true}).populate("concert")
    if(!repetition){
      return res.status(404).json({message:"Répétition non trouvée"})
    }
    else{
      res.status(200).json({
        message:"Répétition modifiée avec succés",
        model:repetition,
        
      })
     
    }
    try {
      const memberIds = repetition.membres.map((member) => member.member);
  
      const members = await Membre.find({ _id: { $in: memberIds } });
      console.log(members)
      members.forEach(async (member) => {
        const memberSocketId = userSocketMap[member._id];

        if (memberSocketId) {
          req.notificationData = {
            userId: member._id,
            notificationMessage: `The repetition on ${repetition.DateRep.toLocaleDateString()} has been updated. It will start at ${repetition.HeureDeb.toLocaleTimeString()} and end at ${repetition.HeureFin.toLocaleTimeString()} at ${repetition.lieu}`
          };
          console.log(req.notificationData)
          await sendNotificationMiddleware(req, res, () => {});
        }
      });
    } catch (error) {
      console.error("Error sending notifications to members:", error);
    }
  }
  catch(error){
    res.status(400).json({error:error.message})
  }
}

const listPresenceByPupitre = async (req, res) => {
  try {
    const { repetitionId } = req.params;
    const { pupitre } = req.query;

    const repetition = await Repetition.findById(repetitionId).populate('membres.member');
    
    const membresPupitre = repetition.membres.filter((membre) => membre.member && membre.member.role === 'choriste' && membre.member.pupitre === pupitre);


  
    const presenceList = membresPupitre.map((membre) => {
      return {
        nom: membre.member.nom,
        prenom: membre.member.prenom,
      };
    });

    res.json({ presenceList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error:error });
  }
};
const absenceRepetition = async (req, res) => {
  const { repetitionId, raison } = req.body;
  const memberId = req.auth.membreId;

  try {
  
    const repetition = await Repetition.findById(repetitionId);

    if (!repetition) {
      return res.status(404).json({ error: 'Répétition non trouvé' });
    }

    const memberIndex = repetition.membres.findIndex(
      (m) => m.member.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Membre non trouvé dans cette répétition' });
    }
    if (repetition.membres[memberIndex].presence == false) {
      return res.status(400).json({ error: 'Vous avez déjà marqué votre absence pour cette répétition.' });
  }

    repetition.membres[memberIndex].absence = { raison };
    repetition.membres[memberIndex].presence = false; 
    
    await repetition.save();

    res.json({ message: 'Votre absence a été bien enregistré' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {createRepetition,listPresenceByPupitre,deleteRepetition,getRepetitionById,getAllRepetition,updateRepetition,absenceRepetition};
