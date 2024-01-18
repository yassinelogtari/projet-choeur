const Membre = require("../models/membreModel");
const Repetition = require("../models/repetitionModel");

// 1. Général (General)
const fetchAllRepetitionAbsence = async (req, res) => {
  try {
    let filter = {};

    
    if (req.query.specificDate) {
      filter.DateRep = new Date(req.query.specificDate);
    }

   
    if (req.query.startDate) {
      filter.DateRep = { $gte: new Date(req.query.startDate) };
    }

    
    if (req.query.endDate) {
      filter.DateRep = { ...filter.DateRep, $lte: new Date(req.query.endDate) };
    }

    
    if (req.query.programme) {
      filter.programme = req.query.programme;
    }

    const repetitions = await Repetition.find(filter).populate({
      path: "membres.member",
      model: "Membre",
    });

    const result = repetitions.map((repetition) => {
      const absentMembers = repetition.membres
        .filter((member) => member.presence === false)
        .map((member) => ({
          _id: member.member._id.toString(),
          nom: member.member.nom,
          prenom: member.member.prenom,
        }));

      const absentMembersObj = {
        repetition: {
          _id: repetition._id.toString(),
          lieu: repetition.lieu,
          date: repetition.DateRep,
          heureDeb: repetition.HeureDeb,
          heureFin: repetition.HeureFin,
          QrCode: repetition.QrCode,
        },
        absentMembers,
      };

      return absentMembersObj;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  
  // 2. Par Pupitre (By Pupitre)
  const fetchAllRepetitionAbsenceByPupitre = async (req, res) => {
    try {
      let filter = {};
  
      // Apply filters if provided in the query parameters
      if (req.query.specificDate) {
        filter.DateRep = new Date(req.query.specificDate);
      }
  
      if (req.query.startDate) {
        filter.DateRep = { $gte: new Date(req.query.startDate) };
      }
  
      if (req.query.endDate) {
        filter.DateRep = { ...filter.DateRep, $lte: new Date(req.query.endDate) };
      }
  
      if (req.query.programme) {
        filter.programme = req.query.programme;
      }
  
      const repetitions = await Repetition.find(filter).populate({
        path: "membres.member",
        model: "Membre",
      });
  
      const result = repetitions.map((repetition) => {
        const absentMembersByPupitre = {
          soprano: [],
          alto: [],
          ténor: [],
          basse: [],
        };
  
        repetition.membres
          .filter((member) => member.presence === false)
          .forEach((member) => {
            const pupitre = member.member.pupitre;
  
            absentMembersByPupitre[pupitre].push({
              _id: member.member._id.toString(),
              nom: member.member.nom,
              prenom: member.member.prenom,
            });
          });
  
        const absentMembersObj = {
          repetition: {
            _id: repetition._id.toString(),
            lieu: repetition.lieu,
            date: repetition.DateRep,
            heureDeb: repetition.HeureDeb,
            heureFin: repetition.HeureFin,
          },
          absentMembersByPupitre,
        };
  
        return absentMembersObj;
      });
  
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
  // 3. Par Choriste (By Choriste)
  const fetchAllAbsentMembersByChoriste = async (req, res) => {
    try {
      let filter = {};
  
     
      if (req.query.specificDate) {
        filter.DateRep = new Date(req.query.specificDate);
      }
  
      if (req.query.startDate) {
        filter.DateRep = { $gte: new Date(req.query.startDate) };
      }
  
      if (req.query.endDate) {
        filter.DateRep = { ...filter.DateRep, $lte: new Date(req.query.endDate) };
      }
  
      if (req.query.programme) {
        filter.programme = req.query.programme;
      }
  
      
      const members = await Membre.find();
  
      
      const repetitions = await Repetition.find(filter);
  
      
      const absentMembers = members
        .filter((member) =>
          repetitions.some(
            (repetition) =>
              repetition.membres.some(
                (repetitionMember) =>
                  repetitionMember.member.toString() === member._id.toString() &&
                  !repetitionMember.presence
              )
          )
        )
        .map((member) => {
          
          const absentRepetitions = repetitions
            .filter((repetition) =>
              repetition.membres.some(
                (repetitionMember) =>
                  repetitionMember.member.toString() === member._id.toString() &&
                  !repetitionMember.presence
              )
            )
            .map((repetition) => ({
              _id: repetition._id.toString(),
              lieu: repetition.lieu,
              DateRep: repetition.DateRep,
              HeureDeb: repetition.HeureDeb,
              HeureFin: repetition.HeureFin,
            }));
  
          return {
            _id: member._id.toString(),
            nom: member.nom,
            prenom: member.prenom,
            absences: absentRepetitions,
          };
        });
  
      res.status(200).json(absentMembers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
  
  
  
  module.exports = {
    fetchAllRepetitionAbsence,
    fetchAllRepetitionAbsenceByPupitre,
    fetchAllAbsentMembersByChoriste,
    
  };