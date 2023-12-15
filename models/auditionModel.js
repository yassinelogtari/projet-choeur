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
    candidatsInfo: [
      {
        
        extraitChante: {
          type: String,
          default: false,
        },
        tessiture: {
          type: String,
          enum: ["alto", "basse", "soprano","ténor"],
          default: false,
        },
        evaluation: {
          type: String,
          enum: ["A", "B", "C"], 
          default: false,
        },
        decision: {
          type: String,
          enum: ["Accepté", "Refusé", "En attente"]
        },
        remarque: {
          type: String,
        }
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("audition", auditionSchema);
