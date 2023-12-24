const mongoose=require('mongoose')
const membreSchema=mongoose.Schema(
    {
       nom:{type:String,required:true},
       prenom:{type:String,required:true},
       email:{type:String,required:true,unique:true},
       password:{type:String,required:true},
       sexe:{type:String,enum:["Homme","Femme"],required:true},
       dateNaissance:{type:String,required:true},
       nationalite:{type:String,required:true},
       CIN:{type:String,required:true},
       situationPerso:{type:String,required:true},
       connaissanceMusic:{type:Boolean,required:true},
       activite:{type:Boolean,required:true},
       telephone:{type:String,required:true},
       notifications: { type: Array, default: [] },
       role:{type:String,enum:["choriste","manager","chef du pupitre","chef de choeur","admin"],required:true},
       statut:{type:String,enum:['Inactif',"Junior","Sénior","Vétéran","En congé"],required:function(){return ['choriste','chef du pupitre'].includes(this.role);}},
       pupitre: {type: String,enum: ["soprano", "alto", "ténor", "basse"],required: function() {return ['choriste','chef du pupitre'].includes(this.role);
        },
    }  ,historiqueStatut: [
        {
        saison: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Saison',
          },
          status: String, 
     } ], 
}
)
module.exports=mongoose.model("Membre",membreSchema)