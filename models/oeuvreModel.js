const mongoose = require('mongoose');

const oeuvreSchema = new mongoose.Schema({
    titre: {
        type:String,
        unique:true,
        require:true
    },
    //compositeurs: 
    //arrangeurs: 
    //pupitre:
    anneeComposition:{
        type:Number,
        require:true
    } ,
    genre: {
        type:String,
        require:true
    },

    paroles: {
        type:String,
        require:true
    },
    partition:{
        type:String,
        require:true
    },
    presenceChoeur: {
      type: Boolean,
      default: false,
    },
  });
  const Oeuvre = mongoose.model('Oeuvre', oeuvreSchema);
  
  module.exports = Oeuvre;