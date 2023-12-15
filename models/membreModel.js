const mongoose=require('mongoose')
const membreSchema=mongoose.Schema(
    {
       nom:{type:String,required:true},
       prenom:{type:String,required:true},
       email:{type:String,required:true,unique:true},
       sexe:{type:String,enum:["Homme","Femme"],required:true},
       dateNaissance:{type:String,required:true},
       nationalite:{type:String,required:true},
       CIN:{type:String,required:true},
       situationPerso:{type:String,required:true},
       connaissanceMusic:{type:Boolean,required:true},
       activite:{type:Boolean,required:true},
       telephone:{type:String,required:true},
       role:{type:String,enum:["choriste","manager","chef du pupitre","chef de choeur","admin"],required:true},
       statut:{type:String,enum:['Inactif',"Junior","Sénior","Vétéran","En congé"],required:function(){return ['choriste','chef du pupitre'].includes(this.role);}},
       pupitre: {type: String,enum: ["Soprano", "Alto", "Ténor", "Basse"],required: function() {return ['choriste','chef du pupitre'].includes(this.role);
        },
    }
}
)
module.exports=mongoose.model("Membre",membreSchema)