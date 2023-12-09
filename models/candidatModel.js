const { boolean } = require("joi");
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
    sexe: {
      type: String,
      enum: ["Homme", "Femme"],
      required: true,
    },
    CIN: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    nationalite:{
      type: String,
      required: true,
    },
    dateNaissance:{
      type: String,
      required: true,
    },
    activite:{
      type: Boolean,
      required: true,
    },
    connaisanceMusical:{
      type: Boolean,
      required: true,
    },
    situationPerso:{
      type: String,
      required: true,
    },
    decision:{
      type:String,
      enum:["retenu","refusé",""],
      default:""
    }
   
    
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("candidat", condidatSchema);
