const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
    concert:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concert",
        required: true,
    },
    place: [{
        row: {
            type: Number,
            required: true,
        },
        column: {
            type: Number,
            required: true,
        },
        membre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Membre"
        },
      }
  ]
})
module.exports=mongoose.model("Placement",placementSchema)