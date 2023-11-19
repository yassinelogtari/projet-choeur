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
    email: {
      type: String,
      required: true,
    },
    tlph: {
      type: Number,
      required: true,
    },
    verified:
    {
      type:Boolean,
      default:false}
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("condidat", condidatSchema);
