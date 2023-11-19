const jwt = require('jsonwebtoken');

const Candidats = require("../models/candidatModel");
const sendEmail=require("../utils/sendEmail")

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

const addCondidat = async (req, res) => {
  try {
    let condidat = await Candidats.findOne({ email: req.body.email });
    if (condidat) {
      return res.status(409).send({ message: "condidat with given email already exists!" });
    }

    condidat = await new Candidats({ ...req.body }).save();

    const token = jwt.sign({ condidatId: condidat._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const url = `${process.env.BASE_URL}/api/candidats/${condidat.id}/verify/${token}`;
    await sendEmail(condidat.email, "Verify Email", url);

    res.status(201).send({ message: "An Email sent to your account, please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


const getToken = async (req, res) => {
  try {
    const { id, token } = req.params;
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const condidat = await Candidats.findOne({ _id: id });
    if (!condidat) {
      console.log('condidat not found');
      return res.status(400).send({ message: "Invalid link" });
    }

    await Candidats.updateOne({ _id: condidat._id }, { $set: { verified: true } });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(400).send({ message: "Token has expired" });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};




module.exports = {
  fetshCandidats,
  addCondidat,
  getToken
};
