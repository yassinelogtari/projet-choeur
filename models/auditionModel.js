const mongoose = require("mongoose");

const auditionSchema = new mongoose.Schema(
  {
    candidat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "condidat",
      required: true,
    },

    DateAud: {
      type: Date,
      required: true,
    },
    HeureDeb: {
      type: String,
      required: true,
    },
    HeureFin: {
      type: String,
      required: true,
    },
    duree: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("audition", auditionSchema);
