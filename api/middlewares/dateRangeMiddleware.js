
const DateRange = require("../models/dateRangeModel");

const dateMiddleware = async (req, res, next) => {
  try {
    const today = new Date();

    const dateRange = await DateRange.findOne();
    if (!dateRange) {
      return res.status(500).json({ error: "Date range not found in the database" });
    }

    if (today < dateRange.dateDebut || today > dateRange.dateFin) {
      return res.status(403).json({ message: "The form is not currently accessible." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = dateMiddleware;
