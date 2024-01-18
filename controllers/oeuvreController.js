const Oeuvre = require("../models/oeuvreModel")
const Saison=require("../models/saisonModel")

const addOeuvre = async (req, res) => {
  const {
    titre,pupitre,arrangeurs,compositeurs,anneeComposition,genre,paroles,partition,presenceChoeur} = req.body
  try {
    const existingOeuvre = await Oeuvre.findOne({ titre });

    if (existingOeuvre) {
      return res.status(400).send({ message: "An oeuvre with the same title already exists." });
    }
    const nouvelleOeuvre = new Oeuvre({
      titre,pupitre,arrangeurs,compositeurs,anneeComposition,genre,paroles,partition,presenceChoeur,
    });
  
    const currentSaison = await Saison.findOne({ saisonCourante: true });
    if (currentSaison) {
      currentSaison.oeuvres.push(nouvelleOeuvre);
      await currentSaison.save();
    }
    const nouvelleOeuvreEnregistree = await nouvelleOeuvre.save();

    res.status(201).send({ message: "Oeuvre added successfully", data: nouvelleOeuvreEnregistree });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addOeuvre,
};


const fetchOeuvre=async(req,res)=>{
    try {
        const oeuvres = await Oeuvre.find();
        res.status(200).send({ data: oeuvres });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: error });
      }
    };

const getByidOeuvre=async(req,res)=>{
    try {
        const { id } = req.params;
    
        const oeuvre = await Oeuvre.findById(id);
    
        if (!oeuvre) {
          return res.status(404).send({ message: "Oeuvre not found" });
        }
    
        res.status(200).send({ data: oeuvre });
      } catch (error) {
        res.status(500).send({ error: error });
      }
    };

const deleteOuvre=async(req,res)=> {
    try {
        const { id } = req.params;
    
        const deletedOeuvre = await Oeuvre.findByIdAndDelete(id);
    
        if (!deletedOeuvre) {
          return res.status(404).send({ message: "Oeuvre not found" });
        }
    
        res.status(200).send({ message: "Oeuvre deleted successfully", data: deletedOeuvre });
      } catch (error) {

        res.status(500).send({ error: 'Internal Server Error' });
      }
}

const updateOeuvre=async(req,res)=>{
    try {
        const { id } = req.params;
    
        if (!req.body) {
          return res.status(400).send({ message: "Request body is empty" });
        }
    
        const updatedOeuvre = await Oeuvre.findByIdAndUpdate(id, req.body, { new: true });
    
        if (!updatedOeuvre) {
          return res.status(404).send({ message: "Oeuvre not found" });
        }
    
        res.status(200).send({ message: "Oeuvre updated successfully", data: updatedOeuvre });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
      }
}

module.exports={
    addOeuvre,
    fetchOeuvre,
    getByidOeuvre,
    deleteOuvre,
    updateOeuvre
}