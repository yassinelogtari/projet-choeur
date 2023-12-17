const Joi = require("joi");
const Cancert = require("../models/concertModel");
const sendEmail = require("../utils/sendEmail");

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
      const cancert = await Cancert.findById(idCancert).populate({
        path: "listeMembres.membre",
        model: "Membre",
      });

      if (!cancert) {
        return res.status(404).json({ error: "Cancert not found" });
      }

      const Member = cancert.listeMembres.find(
        (m) => m.membre._id.toString() === idMember
      );

      Member.disponibility = {
        isAvailable,
      };

      const Concert = await cancert.save();

      if (Concert && Member.membre.role == "choriste") {
        for (i = 0; i < Concert.listeMembres.length; i++) {
          
          if (
            Concert.listeMembres[i].membre.role == "chef du pupitre" &&
            Concert.listeMembres[i].membre.pupitre == Member.membre.pupitre
          ) {
            const formattedDate = new Date(Concert.date).toLocaleDateString(
              "fr-FR"
            );
            const formattedTime = new Date(Concert.date).toLocaleTimeString(
              "fr-FR",
              { hour: "2-digit", minute: "2-digit" }
            );

            await sendEmail(
              Concert.listeMembres[i].membre.email,
              `Confirmation de la disponibilité de ${Member.membre.prenom} ${Member.membre.nom} pour [Nom du Concert]`,
              `Cher/Chère ${Concert.listeMembres[i].membre.prenom} ${Concert.listeMembres[i].membre.nom},<br>
            
              J'espère que ce message vous trouve en bonne santé. Je vous écris pour vous informer que ${Member.membre.prenom} ${Member.membre.nom} a confirmé sa disponibilité pour participer au prochain concert, [Nom du Concert].<br>
              
              Détails du Concert :<br>
              - Date : ${formattedDate}<br>
              - Heure : ${formattedTime}<br>
              - Lieu : ${Concert.lieu}<br>
              
              ${Member.membre.prenom} ${Member.membre.nom} a exprimé son engagement à se préparer activement pour le concert et a été encouragé(e) à participer à toutes les répétitions prévues.<br> Veuillez vous assurer que [il/elle] est tenu(e) informé(e) de toutes les instructions spécifiques ou détails concernant votre section.<br>
              
              Si vous avez des instructions supplémentaires ou s'il y a quelque chose de particulier que vous souhaitez communiquer à ${Member.membre.prenom} ${Member.membre.nom} ou à toute la section, n'hésitez pas à le faire.<br>
              
              Merci pour votre dévouement continu à assurer l'excellence de notre chœur. Nous sommes impatients de vivre une performance réussie et harmonieuse.<br>
              
              Cordialement,
              `
            );
          }
        }

        res.json({
          success: true,
          message:
            "disponibily is saved succesfuly and email sent to the 'chef du pupitre' ",
        });
      }
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
