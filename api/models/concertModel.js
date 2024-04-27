const mongoose = require("mongoose");

const Membre = require("../models/membreModel")

const { Schema } = mongoose;

const concertSchema = new Schema({
  titre: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  lieu: {
    type: String,
    required: true,
  },
  affiche: {
    type: String,
  },
  programme: [
    {
      oeuvre: {
        type: Schema.Types.ObjectId,
        ref: "Oeuvre",
        default: null,
      },
      theme: {
        type: String,
        default: null,
      },
    },
  ],
  listeMembres: [
    {
      membre: {
        type: Schema.Types.ObjectId,
        ref: "Membre",
        required: true,
      },
      presence: {
        type: Boolean,
        default: false,
      },
      disponibility: {
        isAvailable: {
          type: Boolean,
        },
        reason: {
          type: String,
        },
      },
      valider:{
        type: Boolean,
        default:false
      }
    },
  ],
  QrCode: {
    type: String,
    default: "",
  },
});

concertSchema.path("listeMembres").validate(async function (value) {
  const membres = await this.model("Membre").find({
    _id: { $in: value.map((m) => m.membre) },
  });
  const membresInvalides = membres.filter(
    (membre) => membre.role !== "choriste" && membre.role !== "chef du pupitre"
  );
  return membresInvalides.length === 0;
}, 'Tous les membres doivent avoir un rôle de "choriste" ou "chef du pupitre".');



concertSchema.statics.membresValidesPourConcert = async function(concertId) {
  try {
    // Rechercher le concert par son ID
    const concert = await this.findById(concertId);

    if (!concert) {
      throw new Error('Le concert spécifié n\'existe pas.');
    }
    const membresValides = concert.listeMembres.filter(membre => membre.valider === true);

    const membresDetails = await Membre.find({
      _id: { $in: membresValides.map(membre => membre.membre) }
    });

    return membresDetails;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des membres validés pour le concert : ' + error.message);
  }
};


const Concert = mongoose.model("Concert", concertSchema);

module.exports = Concert;
