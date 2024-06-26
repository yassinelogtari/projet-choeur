const mongoose = require("mongoose");

const Membre = require("./membreModel");
const Repetition = require("./repetitionModel");
const Oeuvre = require("./oeuvreModel");
const Concert = require("./concertModel");

const saisonSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
  candidats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "candidat",
    },
  ],
  membres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membre",
    },
  ],
  repetitions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repetition",
    },
  ],
  oeuvres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Oeuvre",
    },
  ],
  concerts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concert",
    },
  ],

  auditions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "audition",
    },
  ],
  seuilnomination: {
    type: Number,
    default: 3,
  },
  nominatedMembers: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membre",
      },
      nom: String,
      prenom: String,
      total_absences: Number,
    },
  ],
  seuilelimination: {
    type: Number,
    default: 1,
  },
  eliminatedMembers: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membre",
      },
      nom: String,
      prenom: String,
      total_absences: Number,
      eliminationReason: String,
    },
  ],

  saisonCourante: {
    type: Boolean,
    default: false,
  },
  archivee: {
    type: Boolean,
    default: false,
  },
  dureeOut: {
    type: Number,
    default: 365,
  },
});

const Saison = mongoose.model("Saison", saisonSchema);

module.exports = Saison;
