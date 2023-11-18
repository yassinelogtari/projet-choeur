const Candidats = require("../models/candidatModel");

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
    res.json(filteredCandidates);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  fetshCandidats,
};
