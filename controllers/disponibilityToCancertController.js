const Joi = require("joi");
const Cancert = require("../models/concertModel");

const disponibilitySchemaToCancert = Joi.object({
  idCancert: Joi.string().required(),
  idMember: Joi.string().required(),
  isAvailable: Joi.boolean().required(),
  reason: Joi.when("isAvailable", {
    is: false,
    then: Joi.string().required(),
    otherwise: Joi.string().allow("").optional(),
  }),
});

const addDisponibility = async (req, res) => {
  const { error } = disponibilitySchemaToCancert.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { idCancert, idMember, isAvailable, reason } = req.body;
  if (reason) {
    try {
      const cancert = await Cancert.findById(idCancert);

      if (!cancert) {
        return res.status(404).json({ error: "Cancert not found" });
      }

      const member = cancert.listeMembres.find(
        (m) => m.membre.toString() === idMember
      );

      member.disponibility = {
        isAvailable,
        reason,
      };

      await cancert.save();

      res.json({ success: true, message: "disponibily is saved succesfuly" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Member not found in the Cancert" });
    }
  } else {
    try {
      const cancert = await Cancert.findById(idCancert);

      if (!cancert) {
        return res.status(404).json({ error: "Cancert not found" });
      }

      const member = cancert.listeMembres.find(
        (m) => m.membre.toString() === idMember
      );

      member.disponibility = {
        isAvailable,
      };

      await cancert.save();

      res.json({ success: true, message: "disponibily is saved succesfuly" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Member not found in the Cancert" });
    }
  }
};

const FetchDisponibleMembers = async (req, res) => {
  const cancertId = req.params.idC;

  try {
    const cancert = await Cancert.findById(cancertId).populate({
      path: "listeMembres.membre",
      model: "Membre",
    });

    if (!cancert) {
      return res.status(404).json({ message: "Concert not found" });
    }

    const availableMembers = cancert.listeMembres
      .filter(
        (member) =>
          member.disponibility && member.disponibility.isAvailable === true
      )
      .map((member) => member.membre);

    res.status(200).json(availableMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addDisponibility,
  FetchDisponibleMembers,
};
