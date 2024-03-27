const Joi = require("joi");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const Audition = require("../models/auditionModel");
const Candidats = require("../models/candidatModel");
const path = require("path");

const generateAuditionSchedule = (
  startDate,
  candidats,
  CandidatsPerHour,
  startTime,
  endTime
) => {
  const schedule = [];
  let currentDate = new Date(startDate);
  let candidateIndex = 0;
  let i = 0;

  while (schedule.length < candidats.length / CandidatsPerHour) {
    const candidates = candidats
      .slice(candidateIndex, candidateIndex + CandidatsPerHour)
      .map((candidate) => candidate._id);
    const start = new Date(currentDate).setHours(startTime + 1 + i);
    const end = new Date(currentDate).setHours(startTime + 1 + (i + 1));
    i++;

    schedule.push({
      date: new Date(currentDate).toISOString(),
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString(),
      candidates,
    });

    candidateIndex += CandidatsPerHour;

    if (startTime + (i + 1) > endTime) {
      i = 0;
      currentDate.setHours(startTime);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return schedule;
};

const generateSchedule = async (req, res) => {
  try {
    const { error } = Joi.object({
      startDate: Joi.date().required(),
      CandidatsPerHour: Joi.number().integer().required(),
      startTime: Joi.number().integer().required(),
      endTime: Joi.number().integer().required(),
    }).validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        msg: `Validation error: ${error.details
          .map((detail) => detail.message)
          .join(", ")}`,
      });
    }

    const { startDate, CandidatsPerHour, startTime, endTime } = req.body;

    const candidats = await Candidats.find({});
    console.log(candidats);

    if (candidats.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No candidates found. Please add candidates before generating auditions.",
      });
    }

    const existingAuditions = await Audition.find({});

    if (existingAuditions.length > 0) {
      await Audition.updateMany({}, { $set: { archived: true } });
    }

    const schedule = generateAuditionSchedule(
      startDate,
      candidats,
      CandidatsPerHour,
      startTime,
      endTime
    );

    const auditionInstances = schedule.map(
      (session) =>
        new Audition({
          candidats: session.candidates,
          DateAud: new Date(session.date),
          HeureDeb: new Date(session.startTime),
          HeureFin: new Date(session.endTime),
        })
    );

    const savedAuditions = await Audition.insertMany(auditionInstances);

    if (savedAuditions) {
      for (let i = 0; i < savedAuditions.length; i++) {
        for (let j = 0; j < savedAuditions[i].candidats.length; j++) {
          const candidate = await Candidats.findById(
            savedAuditions[i].candidats[j]
          );

          const formattedDateString =
            savedAuditions[i].DateAud.toISOString().slice(8, 10) +
            "-" +
            (savedAuditions[i].DateAud.getUTCMonth() + 1)
              .toString()
              .padStart(2, "0") +
            "-" +
            savedAuditions[i].DateAud.getUTCFullYear();
          const formattedTimeDString = savedAuditions[
            i
          ].HeureDeb.toISOString().slice(11, 16);
          const formattedTimeFString = savedAuditions[
            i
          ].HeureFin.toISOString().slice(11, 16);

          await sendEmail(
            candidate.email,
            "Audition Information",
            "Bonjour " +
              candidate.prenom +
              " Félicitations ! Vous avez été présélectionné pour rejoindre l'orchestre symphonique de Cartage. Votre audition aura lieu à " +
              formattedDateString +
              " à partir de " +
              formattedTimeDString +
              " à " +
              formattedTimeFString +
              ". nous avons hâte de découvrir vos talents et de vous voir rejoindre notre équipe."
          );
        }
      }
      res.status(201).send({
        message:
          "Audition est affectée avec succès et les Email ont été envoyés avec succès",
        dataA: savedAuditions,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const generateAdditionalSchedule = async (req, res) => {
  try {
    const { error } = Joi.object({
      startDate: Joi.date().required(),
      CandidatsPerHour: Joi.number().integer().required(),
      startTime: Joi.number().integer().required(),
      endTime: Joi.number().integer().required(),
      failingCandidats: Joi.array().items(Joi.string()).required(),
    }).validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        msg: `Validation error: ${error.details
          .map((detail) => detail.message)
          .join(", ")}`,
      });
    }

    const {
      startDate,
      CandidatsPerHour,
      startTime,
      endTime,
      failingCandidats,
    } = req.body;

    const candidats = failingCandidats.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const schedule = generateAuditionSchedule(
      startDate,
      candidats,
      CandidatsPerHour,
      startTime,
      endTime
    );

    const auditionInstances = schedule.map(
      (session) =>
        new Audition({
          candidats: session.candidates,
          DateAud: new Date(session.date),
          HeureDeb: new Date(session.startTime),
          HeureFin: new Date(session.endTime),
        })
    );

    const savedAuditions = await Audition.insertMany(auditionInstances);

    if (savedAuditions) {
      for (let i = 0; i < savedAuditions.length; i++) {
        for (let j = 0; j < savedAuditions[i].candidats.length; j++) {
          const candidate = await Candidats.findById(
            savedAuditions[i].candidats[j]
          );

          const formattedDateString =
            savedAuditions[i].DateAud.toISOString().slice(8, 10) +
            "-" +
            (savedAuditions[i].DateAud.getUTCMonth() + 1)
              .toString()
              .padStart(2, "0") +
            "-" +
            savedAuditions[i].DateAud.getUTCFullYear();
          const formattedTimeDString = savedAuditions[
            i
          ].HeureDeb.toISOString().slice(11, 16);
          const formattedTimeFString = savedAuditions[
            i
          ].HeureFin.toISOString().slice(11, 16);

          await sendEmail(
            candidate.email,
            "Audition Information",
            "Bonjour " +
              candidate.prenom +
              " Félicitations ! Vous avez été présélectionné pour rejoindre l'orchestre symphonique de Cartage. Votre audition aura lieu à " +
              formattedDateString +
              " à partir de " +
              formattedTimeDString +
              " à " +
              formattedTimeFString +
              ". nous avons hâte de découvrir vos talents et de vous voir rejoindre notre équipe."
          );
        }
      }
      res.status(201).send({
        message:
          "Audition est affectée avec succès et les Email ont été envoyés avec succès",
        dataA: savedAuditions,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const fetshAuditions = async (req, res) => {
  try {
    const auditionsToGet = await Audition.find().populate("candidats");
    res.status(200).json(auditionsToGet);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addAuditionInfo = async (req, res) => {
  try {
    const {
      auditionId,
      candidatId,
      extraitChante,
      tessiture,
      evaluation,
      decision,
      remarque,
    } = req.body;

    const { error } = Joi.object({
      auditionId: Joi.string().required(),
      candidatId: Joi.string().required(),
      extraitChante: Joi.string().required(),
      tessiture: Joi.string().required(),
      evaluation: Joi.string().valid("A", "B", "C").required(),
      decision: Joi.string(),
      remarque: Joi.string(),
    }).validate(
      {
        auditionId,
        candidatId,
        extraitChante,
        tessiture,
        evaluation,
        decision,
        remarque,
      },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        msg: `Validation error: ${error.details
          .map((detail) => detail.message)
          .join(", ")}`,
      });
    }

    const audition = await Audition.findById(auditionId);

    if (!audition) {
      return res
        .status(404)
        .json({ success: false, msg: "Audition not found." });
    }

    if (!audition.candidats.includes(candidatId)) {
      return res.status(400).json({
        success: false,
        msg: "Candidate not associated with this audition.",
      });
    }

    audition.candidatsInfo = audition.candidatsInfo || [];

    const candidatInfoIndex = audition.candidatsInfo.findIndex(
      (info) => info && info.candidat && info.candidat.toString() === candidatId
    );

    if (candidatInfoIndex !== -1) {
      audition.candidatsInfo[candidatInfoIndex] = {
        extraitChante,
        tessiture,
        evaluation,
        decision,
        remarque,
      };
    } else {
      audition.candidatsInfo.push({
        extraitChante,
        tessiture,
        evaluation,
        decision,
        remarque,
      });
    }

    await audition.save();

    res
      .status(200)
      .json({ success: true, msg: "Audition information added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};


const getAuditionById = async (req, res) => {
  const auditionId = req.params.auditionId;

  try {
    const audition = await Audition.findById(auditionId).populate('candidats');
    if (!audition) {
      return res.status(404).json({ success: false, msg: 'Audition not found.' });
    }
    res.status(200).json({ success: true, audition });
  } catch (error) {
    console.error('Error fetching audition by ID:', error);
    res.status(500).json({ success: false, msg: 'Internal server error.' });
  }
};



const updateAudition = async (req, res) => {
  try {
    const auditionId = req.params.auditionId;
    const candidatInfoId = req.body.candidatInfoId;
    const updateFields = req.body.updateFields;

    const audition = await Audition.findById(auditionId);
    if (!audition) {
      return res.status(404).json({ message: "Audition not found" });
    }


    const candidatIndex = audition.candidatsInfo.findIndex(info => info._id == candidatInfoId);
    if (candidatIndex === -1) {
      return res.status(404).json({ message: "Candidat information not found" });
    }

    
    for (let key in updateFields) {
      audition.candidatsInfo[candidatIndex][key] = updateFields[key];
    }

    
    await audition.save();

    return res.status(200).json({ message: "Candidat information updated successfully" });
  } catch (error) {
    console.error("Error updating candidat info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}






const deleteAudition = async (req, res) => {
  try {
    const { auditionId } = req.params;

    const deletedAudition = await Audition.findByIdAndDelete(auditionId);

    if (!deletedAudition) {
      return res.status(404).json({ success: false, msg: "Audition non trouvée." });
    }

    res.status(200).json({ success: true, msg: "Audition supprimée avec succès", data: deletedAudition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};


module.exports = { generateSchedule, fetshAuditions,addAuditionInfo,updateAudition,deleteAudition ,generateAdditionalSchedule ,getAuditionById};
