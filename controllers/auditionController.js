const Joi = require("joi");
const Audition = require("../models/auditionModel");
const sendEmail=require("../utils/sendEmail")

const Candidats = require("../models/candidatModel");

const generateAuditionSchedule = (
  startDate,
  endDate,
  sessionsPerDay,
  startTime,
  endTime,
  auditionDuration
) => {
  const schedule = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    for (let i = 0; i < sessionsPerDay; i++) {
      const start = new Date(currentDate).setHours(
        startTime + 1 + i * auditionDuration
      );
      const end = new Date(currentDate).setHours(
        startTime + 1 + (i + 1) * auditionDuration
      );

      schedule.push({
        date: new Date(currentDate).toISOString(),
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString(),
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedule;
};

const generateSchedule = async (req, res) => {
  try {
    const { error } = Joi.object({
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      sessionsPerDay: Joi.number().integer().required(),
      startTime: Joi.number().integer().required(),
      endTime: Joi.number().integer().required(),
      auditionDuration: Joi.number().integer().required(),
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
      endDate,
      sessionsPerDay,
      startTime,
      endTime,
      auditionDuration,
    } = req.body;

    const schedule = generateAuditionSchedule(
      startDate,
      endDate,
      sessionsPerDay,
      startTime,
      endTime,
      auditionDuration
    );

    const auditionInstances = schedule.map(
      (session) =>
        new Audition({
          candidat: null,
          DateAud: new Date(session.date),
          HeureDeb: new Date(session.startTime),
          HeureFin: new Date(session.endTime),
        })
    );

    const savedAuditions = await Audition.insertMany(auditionInstances);

    res.status(200).json({ success: true, savedAuditions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

const fetshAuditions = async (req, res) => {
  try {
    const auditionsToGet = await Audition.find().populate("candidat");
    res.status(200).json(auditionsToGet);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addAuditionToCandidat = async (req, res) => {
  try {
    const _idAudition = req.params._idA;
    const _idCandidate = req.params._idC;

    

    const updatedAudition = await Audition.findOneAndUpdate(
      { _id: _idAudition },
      { $set: { candidat: _idCandidate, booked: true } },
      { new: true }
    );

      const Candidat = await Candidats.findOne({ _id: _idCandidate });
      const formattedDateString = updatedAudition.DateAud.toISOString().slice(8, 10) + '-' + (updatedAudition.DateAud.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + updatedAudition.DateAud.getUTCFullYear();
      const formattedTimeDString = updatedAudition.HeureDeb.toISOString().slice(11, 16);
      const formattedTimeFString = updatedAudition.HeureFin.toISOString().slice(11, 16);

      await sendEmail(Candidat.email, "Audition Information", "Bonjour "+ Candidat.prenom +" Félicitations ! Vous avez été présélectionné pour rejoindre l'orchestre symphonique de Cartage. Votre audition aura lieu à " +formattedDateString+" à partir de "+ formattedTimeDString+" à "+formattedTimeFString+". nous avons hâte de découvrir vos talents et de vous voir rejoindre notre équipe.");
       


    res.status(200).json(updatedAudition);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { generateSchedule, fetshAuditions, addAuditionToCandidat };
