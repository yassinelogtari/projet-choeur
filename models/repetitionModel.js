const mongoose = require("mongoose");
const membre = require("./membreModel");

const repetitionSchema = new mongoose.Schema({
    idConcert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concert"
    },
  lieu: {
    type: String,
    required: true,
  },
  DateRep: {
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
  
  membres: [
    {
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membre",
        required: true,
      },
      presence: {
        type: Boolean,
        default: false,
      },
    },
  ],
  QrCode: {
    type: String,
    default: "",
  },
});

  

module.exports = mongoose.model("Repetition", repetitionSchema);
