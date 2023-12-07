const mongoose=require('mongoose')
const Membre=require('./membre')
const congeSchema=mongoose.Schema({
    membre:{type:mongoose.Schema.Types.ObjectId,ref:'Membre'},
    dateDebut:{type:Date,required:true},
    dateFin:{type:Date,required:true},
    raison:{type:String,required:true}
})
module.exports=mongoose.model("Conge",congeSchema)