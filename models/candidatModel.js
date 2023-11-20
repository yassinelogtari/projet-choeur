const mongoose = require("mongoose");

const condidatSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    tlph: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("candidat", condidatSchema);
