const jwt = require('jsonwebtoken');

const Test=require("../models/test")
const sendEmail=require("../utils/sendEmail")




const addCondidat = async (req, res) => {
  try {
    let test = await Test.findOne({ email: req.body.email });
    if (test) {
      return res.status(409).send({ message: "test with given email already exists!" });
    }

    test = await new Test({ ...req.body }).save();

    const token = jwt.sign({ testId: test._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const url = `${process.env.BASE_URL}/api/${test.id}/verify/${token}`;
    await sendEmail(test.email, "Verify Email", url);

    res.status(201).send({ message: "An Email sent to your account, please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};



const getToken = async (req, res) => {
  try {
    const { id, token } = req.params;

    console.log('Received parameters:', { id, token });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const test = await Test.findOne({ _id: id });
    if (!test) {
      console.log('test not found');
      return res.status(400).send({ message: "Invalid link" });
    }

    await Test.updateOne({ _id: test._id }, { $set: { verified: true } });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(400).send({ message: "Token has expired" });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};


module.exports={
    addCondidat,
    getToken
}