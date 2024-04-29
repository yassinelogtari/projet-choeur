const mongoose = require("mongoose");

const { Schema } = mongoose;

const concertSchema = new Schema({
  titre: {
    type: String,
    required: true,
    unique: true
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

const Concert = mongoose.model("Concert", concertSchema);

module.exports = Concert;
