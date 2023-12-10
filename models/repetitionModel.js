const mongoose = require("mongoose");
const membre=require("./membreModel")
const repetitionSchema = new mongoose.Schema(
  {
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
    membres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "membre",
        required:true
      }],
   
  },
  
)

module.exports = mongoose.model("Repetition", repetitionSchema);