const mongoose = require("mongoose");

const auditionSchema = new mongoose.Schema(
  {
    candidat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "condidat",
    },

    DateAud: {
      type: Date,
      required: true,
    },
    HeureDeb: {
      type: Date,
      required: true,
    },
    HeureFin: {
      type: Date,
      required: true,
    },
    booked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("audition", auditionSchema);
