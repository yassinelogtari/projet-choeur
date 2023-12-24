const mongoose = require('mongoose');

const Membre = require('./membreModel'); 
const Repetition = require('./repetitionModel');
const Oeuvre = require('./oeuvreModel');
const Concert=require('./concertModel')

const saisonSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique:true
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
  membres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membre',
    },
  ],
  repetitions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repetition',
    },
  ],
  oeuvres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Oeuvre',
    },
  ],
   concerts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Concert',
    },
  ],
  saisonCourante: {
    type: Boolean,
    default: false,
  },
});

const Saison = mongoose.model('Saison', saisonSchema);

module.exports = Saison;