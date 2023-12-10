const jwt = require("jsonwebtoken");

const Candidats = require("../models/candidatModel");
const CandidatsVerif = require("../models/candidatMailVerifModel");
const sendEmail = require("../utils/sendEmail");
const Audition = require("../models/auditionModel");
const DateRange = require("../models/dateRangeModel");
const path=require('path')

function paginatedResults(model, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let paginatedResults = {};

  if (endIndex < model.length) {
    paginatedResults.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    paginatedResults.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  paginatedResults.results = model.slice(startIndex, endIndex);
  return paginatedResults;
}

const fetshCandidats = async (req, res) => {
  try {
    let candidates = await Candidats.find();
    let filteredCandidates = [...candidates];
    const { page, limit, ...filters } = req.query;
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
    if (req.query.page && req.query.limit) {
      res
        .status(200)
        .json(
          paginatedResults(filteredCandidates, parseInt(page), parseInt(limit))
        );
    } else res.status(200).json(filteredCandidates);
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

const dateFormRange = async (req, res, next) => {
  try {
    const newDateRange = new DateRange({
      dateDebut: new Date(req.body.dateDebut),
      dateFin: new Date(req.body.dateFin),
    });

    const existingDateRange = await DateRange.findOne();

    if (existingDateRange) {
      return res
        .status(400)
        .json({ error: "Date range already exists in the database" });
    }

    const resDateRange = await newDateRange.save();
    res.status(201).json(resDateRange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateDateRange = async (req, res) => {
  try {
    const updatedDateRange = {
      dateDebut: new Date(req.body.dateDebut),
      dateFin: new Date(req.body.dateFin),
    };

    const existingDateRange = await DateRange.findOne();

    if (!existingDateRange) {
      return res
        .status(404)
        .json({ error: "Date range not found in the database" });
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
    res.status(201).send({
      message: "le candidat a été créé avec sucéé",
      data: newCondidat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};
const accepterCandidat=async(req,res)=>{
  const candidatId=req.params.id
  const pdfFile=req.file
  try{
    const candidat=await Candidats.findById(candidatId)
    if(!candidat){
      return res.status(404).json({message:'Candidat non trouvé'})
    }
    if(candidat.decision=="retenu"){
      return res.status(400).json({message:"Le candidat est déjà retenu"})
    }
    else if(candidat.decision=="refusé"){
      return res.status(400).json({message:"Le candidat est refusé : il ne peut pas étre retenu"})
    }
    else{
      candidat.decision="retenu"
      await candidat.save()
      const sujetEmail="Acceptation de votre candidature"
      const corpsEmail = `Bonjour ${candidat.prenom} ${candidat.nom},
Nous avons le plaisir de vous informer que vous avez été retenu(e) pour faire partie de l'Orchestre Symphonique de Carthage. Félicitations pour cette réussite, et nous sommes impatients de vous accueillir au sein de notre talentueuse équipe.
Pour formaliser votre engagement en tant que membre de l'orchestre, veuillez trouver ci-joint la Charte de l'Orchestre Symphonique de Carthage. Nous vous prions de bien vouloir lire attentivement le document et de le signer en bas de la dernière page.
Pour confirmer votre participation,veuillez cliquer sur ce lien:<a href="${lienDeConfirmation}">Confirmer la participation</a>
Cordialement
      `;
      const namePDF="charte.pdf"
      const attachments=[
        {
          filename:namePDF,
          content:pdfFile.buffer
        }
      ]
      await sendEmail(candidat.email,sujetEmail,corpsEmail,attachments)
      return res.status(200).json({message:"Candidat retenu avec succés"})
    }
  }
  catch(error){
    return res.status(500).json({error:error.message})
  }
}

module.exports = {
  fetshCandidats,
  addEmailCandidat,
  getToken,
  dateFormRange,
  updateDateRange,
  rempForm,
  accepterCandidat,
};
