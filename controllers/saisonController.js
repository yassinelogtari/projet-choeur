
const Candidats = require("../models/candidatModel");
const Auditions=require("../models/auditionModel")


const fetchArchiverSaison=async(req,res)=>{
    try {
        const saisonDate = new Date(req.params.date);
        const year = saisonDate.getFullYear();
    
        const yearDebut = new Date(`${year}-01-01T00:00:00Z`);
        const yearEnd = new Date(`${year}-12-31T23:59:59Z`);
    
        const candidatsInYear = await Candidats.find({
          createdAt: { $gte: yearDebut, $lte: yearEnd }
        });
        const auditionInYear = await Auditions.find({
            createdAt: { $gte: yearDebut, $lte: yearEnd }
          });

        const result = {
            candidats: candidatsInYear,
            auditions: auditionInYear
          };
        res.json(result);
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
      }
}

module.exports={fetchArchiverSaison}