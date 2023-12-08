const mongoose = require("mongoose");

const auditionSchema = new mongoose.Schema(
  {
    candidats: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "candidat",
    }],

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
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("audition", auditionSchema);
