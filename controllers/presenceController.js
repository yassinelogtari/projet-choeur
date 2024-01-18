const Joi = require("joi");
const Repetition = require("../models/repetitionModel");
const Cancert = require("../models/concertModel");

const presenceSchemaToRepetition1 = Joi.object({
  idRepetition: Joi.string().required(),
});

const markPresenceToRepetition = async (req, res) => {
  const { error } = presenceSchemaToRepetition1.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { idRepetition } = req.body;

  try {
    const repetition = await Repetition.findById(idRepetition);

    if (!repetition) {
      return res.status(404).json({ error: "Repetition not found" });
    }

    const member = repetition.membres.find(
      (m) => m.member.toString() === req.auth.membreId
    );


    member.presence = true;

    await repetition.save();

    res.json({ success: true, message: "Presence marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Member not found in the repetition" });
  }
};

const presenceSchemaToCancert1 = Joi.object({
  idCancert: Joi.string().required(),
});

const markPresenceToCancert = async (req, res) => {
  const { error } = presenceSchemaToCancert1.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { idCancert} = req.body;

  try {
    const cancert = await Cancert.findById(idCancert);

    if (!cancert) {
      return res.status(404).json({ error: "Cancert not found" });
    }

    const member = cancert.listeMembres.find(
     
      (m) => m.membre.toString() === req.auth.membreId
    );

    member.presence = true;

    await cancert.save();

    res.json({ success: true, message: "Presence marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Member not found in the Cancert" });
  }
};

const presenceSchemaToRepetition2 = Joi.object({
  idRepetition: Joi.string().required(),
  idMember: Joi.string().required(),
});

const markPresenceToRepetitionManualy = async (req, res) => {
  const { error } = presenceSchemaToRepetition2.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { idRepetition, idMember } = req.body;

  try {
    const repetition = await Repetition.findById(idRepetition);

    if (!repetition) {
      return res.status(404).json({ error: "Repetition not found" });
    }

    const member = repetition.membres.find(
      (m) => m.member.toString() === idMember
    );

    if (!member) {
      return res
        .status(404)
        .json({ error: "Member not found in the repetition" });
    }

    member.presence = true;

    await repetition.save();

    res.json({ success: true, message: "Presence marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const presenceSchemaToCancert2 = Joi.object({
  idCancert: Joi.string().required(),
  idMember: Joi.string().required(),
});

const markPresenceToCancertManualy = async (req, res) => {
  const { error } = presenceSchemaToCancert2.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { idCancert, idMember } = req.body;

  try {
    const cancert = await Cancert.findById(idCancert);
    
    if (!cancert) {
      return res.status(404).json({ error: "Cancert not found" });
    }

    const member = cancert.listeMembres.find(

      (m) => m.membre.toString() === idMember
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found in the cancert" });
    }

    member.presence = true;

    await cancert.save();

    res.json({ success: true, message: "Presence marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { markPresenceToRepetition, markPresenceToCancert,markPresenceToRepetitionManualy, markPresenceToCancertManualy };
