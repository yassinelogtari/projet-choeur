const mongoose = require("mongoose");

const dateRangeSchema = new mongoose.Schema({
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
});

const DateRangeModel = mongoose.model("DateRange", dateRangeSchema);

module.exports = DateRangeModel;