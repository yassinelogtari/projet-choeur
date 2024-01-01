const jwt = require("jsonwebtoken")
const Membre = require("../models/membreModel");
const loggedMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN");
    const membreId = decodedToken.membreId;
    try {
      const membre = await Membre.findOne({ _id: membreId })
      if (!membre) {
        return res.status(404).json({
          message: "Membre non trouvé",
        })
      }
      req.auth = {
        membreId: membreId,
        role: membre.role,
      };
      next();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    return res.status(401).json({ error: "Erreur de token" });
  }
};
const isAdmin=(req,res,next)=>{
    try{
      if(req.auth.role==="admin"){
        next()
      }else{
        res.status(403).json({error:"Vous ne pouvez pas accéder à cette route"})
      }
  
    }
    catch(e){
      res.status(401).json({error:error.message})
    }
  }
const isChoriste=(req,res,next)=>{
    try{
      if(req.auth.role==="choriste"){
        next()
      }else{
        res.status(403).json({error:"Vous ne pouvez pas accéder à cette route"})
      }
  
    }
    catch(e){
      res.status(401).json({error:error.message})
    }
  }
  const isManager=(req,res,next)=>{
    try{
      if(req.auth.role==="manager"){
        next()
      }else{
        res.status(403).json({error:"Vous ne pouvez pas accéder à cette route"})
      }
  
    }
    catch(e){
      res.status(401).json({error:error.message})
    }
  }
  const isChefPupitre=(req,res,next)=>{
    try{
      if(req.auth.role==="chef du pupitre"){
        next()
      }else{
        res.status(403).json({error:"Vous ne pouvez pas accéder à cette route"})
      }
  
    }
    catch(e){
      res.status(401).json({error:error.message})
    }
  }
  const isChefChoeur=(req,res,next)=>{
    try{
      if(req.auth.role==="chef de choeur"){
        next()
      }else{
        res.status(403).json({error:"Vous ne pouvez pas accéder à cette route"})
      }
  
    }
    catch(e){
      res.status(401).json({error:error.message})
    }
  }
  const AdminManager=(req,res,next)=>{
    try{
      if(req.auth.role==="manager" || req.auth.role==="admin"){
        next()
      }else{
        res.status(403).json({error:"Vous ne pouvez pas accéder à cette route"})
      }
  
    }
    catch(e){
      res.status(401).json({error:error.message})
    }
  }

module.exports={
    loggedMiddleware,
    isAdmin,
    isChoriste,
    isManager,
    isChefPupitre,
    isChefChoeur,
    AdminManager,
    
}