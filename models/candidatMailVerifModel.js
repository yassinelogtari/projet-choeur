const mongoose = require("mongoose");

const condidatverifSchema = new mongoose.Schema(
  {
    email:{
        type:String,
        require:true
    },
    verified:
    {
      type:Boolean,
      default:false}
  },
  
  
  { timestamps: true }
);

module.exports = mongoose.model("condidatVerif", condidatverifSchema);
