const jwt = require("jsonwebtoken");

const Candidats = require("../models/candidatModel");
const CandidatsVerif = require("../models/candidatMailVerifModel");
const sendEmail = require("../utils/sendEmail");
const Audition = require("../models/auditionModel");
const DateRange=require("../models/dateRangeModel")

const fetshCandidats = async (req, res) => {
  try {
    let candidates = await Candidats.find();
    let filteredCandidates = [...candidates];
    const filters = req.query;
    if (Object.keys(filters).length > 0) {
      filteredCandidates = filteredCandidates.filter((candidate) => {
        return Object.entries(filters).every(([key, value]) => {
          return (
            candidate[key].toString().toLowerCase() ===
            value.toString().toLowerCase()
          );
        });
      });
    }
    res.status(200).json(filteredCandidates);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addEmailCandidat = async (req, res) => {
  try {
    let condidat = await CandidatsVerif.findOne({ email: req.body.email });
    if (condidat) {
      return res
        .status(409)
        .send({ message: "condidat with given email already exists!" });
    }

    condidat = await new CandidatsVerif({ ...req.body }).save();

    const token = jwt.sign(
      { condidatId: condidat._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const url = `${process.env.BASE_URL}/api/candidats/${condidat.id}/verify/${token}`;
    await sendEmail(condidat.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account, please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getToken = async (req, res) => {
  try {
    const { id, token } = req.params;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const condidat = await CandidatsVerif.findOne({ _id: id });
    if (!condidat) {
      console.log("condidat not found");
      return res.status(400).send({ message: "Invalid link" });
    }

    await CandidatsVerif.updateOne(
      { _id: condidat._id },
      { $set: { verified: true } }
    );

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).send({ message: "Token has expired" });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

const dateFormRange=async(req,res,next)=>{
  try {
    const newDateRange = new DateRange({
      dateDebut: new Date(req.body.dateDebut),
      dateFin: new Date(req.body.dateFin),
    });

    const existingDateRange = await DateRange.findOne();

    if (existingDateRange) {
      return res.status(400).json({ error: "Date range already exists in the database" });
    }

    const resDateRange = await newDateRange.save();
    res.status(201).json(resDateRange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


const updateDateRange = async (req, res) => {
  try {
    const updatedDateRange = {
      dateDebut: new Date(req.body.dateDebut),
      dateFin: new Date(req.body.dateFin),
    };

    const existingDateRange = await DateRange.findOne();

    if (!existingDateRange) {
      return res.status(404).json({ error: "Date range not found in the database" });
    }

    existingDateRange.dateDebut = updatedDateRange.dateDebut;
    existingDateRange.dateFin = updatedDateRange.dateFin;

    const savedDateRange = await existingDateRange.save();

    res.status(200).json(savedDateRange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const rempForm = async (req, res) => {
  try {

    const { id } = req.params;

    const condidat = await CandidatsVerif.findOne({ _id: id });

    if (!condidat) {
      return res.status(400).send({ message: "Candidate not found" });
    }

    if (!condidat.verified) {
      return res.status(401).send({ message: "Email not verified yet" });
    }

    const {
      nom,
      prenom,
      sexe,
      CIN,
      telephone,
      nationalite,
      dateNaissance,
      activite,
      connaisanceMusical,
      situationPerso,
    } = req.body;
    const newCondidat = await new Candidats({
      nom,
      prenom,
      email: condidat.email,
      sexe,
      CIN,
      telephone,
      nationalite,
      dateNaissance,
      activite,
      connaisanceMusical,
      situationPerso,
    }).save();

    if (newCondidat) {
      const _idCandidate = newCondidat._id;

      const updatedAudition = await Audition.findOneAndUpdate(
        { booked: false },
        { $set: { candidat: _idCandidate, booked: true } },
        { new: true }
      );
      if (!updatedAudition) {
        res
          .status(400)
          .json({
            error: "il n'ya pas une date libre pour l'audition de candidat ",
          });
      }

      const formattedDateString =
        updatedAudition.DateAud.toISOString().slice(8, 10) +
        "-" +
        (updatedAudition.DateAud.getUTCMonth() + 1)
          .toString()
          .padStart(2, "0") +
        "-" +
        updatedAudition.DateAud.getUTCFullYear();
      const formattedTimeDString = updatedAudition.HeureDeb.toISOString().slice(
        11,
        16
      );
      const formattedTimeFString = updatedAudition.HeureFin.toISOString().slice(
        11,
        16
      );

      await sendEmail(
        newCondidat.email,
        "Audition Information",
        "Bonjour " +
          newCondidat.prenom +
          " Félicitations ! Vous avez été présélectionné pour rejoindre l'orchestre symphonique de Cartage. Votre audition aura lieu à " +
          formattedDateString +
          " à partir de " +
          formattedTimeDString +
          " à " +
          formattedTimeFString +
          ". nous avons hâte de découvrir vos talents et de vous voir rejoindre notre équipe."
      );
      res
        .status(201)
        .send({
          message:
            "Formulaire rempli avec succès et Audition est affectée avec succée",
          dataC: newCondidat,
          dataA: updatedAudition,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

module.exports = {
  fetshCandidats,
  addEmailCandidat,
  getToken,
  dateFormRange,
  updateDateRange,
  rempForm,
};
