const express = require("express");
const router = express.Router();
const Repetition = require("../models/repetitionModel");
const Membre = require("../models/membreModel");
const addQrCodeToRepetition = require("../middlewares/createQrCodeMiddleware");

const genererListeMembres=async(pupitre,pourcentage)=>{
  const membresPupitre=await Membre.find({pupitre,role:{$in:['choriste']},statut:{$ne:'En congé'}})
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
    const {lieu,DateRep,HeureDeb,HeureFin,pourcentages,chefsPupitres}=req.body

    const chefsSoprano=await Membre.findOne({_id:chefsPupitres.soprano,role:"chef du pupitre"})
    const chefsAlto=await Membre.findOne({_id:chefsPupitres.alto,role:"chef du pupitre"})
    const chefsTenor=await Membre.findOne({_id:chefsPupitres.tenor,role:"chef du pupitre"})
    const chefsBasse=await Membre.findOne({_id:chefsPupitres.basse,role:"chef du pupitre"})

    if(!chefsSoprano || !chefsAlto ||!chefsTenor || !chefsBasse){
      return res.status(400).json({message:"Certains membres spécifiés ne sont pas des chefs du pupitre"})
    }
    else{
    const membresSoprano=await genererListeMembres("soprano",pourcentages.soprano)
    const membresAlto=await genererListeMembres("alto",pourcentages.alto)
    const membresTenor=await genererListeMembres("ténor",pourcentages.tenor)
    const membresBasse=await genererListeMembres("basse",pourcentages.basse)
    if (pourcentages.soprano > 0 && membresSoprano.length != 0 ) membresSoprano.push({ member: chefsPupitres.soprano, role: "chef du pupitre" });
    if (pourcentages.alto > 0 && membresAlto.length != 0) membresAlto.push({ member: chefsPupitres.alto, role: "chef du pupitre" });
    if (pourcentages.tenor > 0 && membresTenor.length != 0) membresTenor.push({ member: chefsPupitres.tenor, role: "chef du pupitre" });
    if (pourcentages.basse > 0 && membresBasse.length != 0) membresBasse.push({ member: chefsPupitres.basse, role: "chef du pupitre" });
    const repetition=new Repetition({
      lieu,
      DateRep,
      HeureDeb,
      HeureFin,
      membres:[...membresSoprano,...membresAlto,...membresTenor,...membresBasse]
    })
    await repetition.save()
    req.repetitionId = repetition._id;
    await addQrCodeToRepetition.addQrCodeToRepetition(req, res, () => {});
  }
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
    const repetition=await Repetition.findOne({_id:req.params.id}).populate("membres.member").exec()
    if(repetition){
      res.status(200).json({
        message:"Répétition trouvée",
        model:repetition
        
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
const getAllRepetition=async(req,res)=>{
  try{
    const repetitions=await Repetition.find().populate("membres.member").exec()
    res.status(200).json({
      message:"Données extraites avec succés",
      model:repetitions,
      
    })

  }
  catch(error){
    res.status(400).json({error:error.message})
  }
}
const updateRepetition=async(req,res)=>{
  try{
    const repetition=await Repetition.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    if(!repetition){
      return res.status(404).json({message:"Répétition non trouvée"})
    }
    else{
      res.status(200).json({
        message:"Répétition modifiée avec succés",
        model:repetition,
        
      })
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

    const membresPupitre = repetition.membres.filter((membre) => membre.member.role === 'choriste' && membre.member.pupitre === pupitre);

  
    const presenceList = membresPupitre.map((membre) => {
      return {
        nom: membre.member.nom,
        prenom: membre.member.prenom,
        presence: membre.presence,
      };
    });

    res.json({ presenceList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error:error });
  }
};

module.exports = {createRepetition,listPresenceByPupitre,deleteRepetition,getRepetitionById,getAllRepetition,updateRepetition};
