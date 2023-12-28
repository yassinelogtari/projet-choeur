const mongoose=require('mongoose')
const membreSchema=mongoose.Schema(
    {
       nom:{type:String,required:true},
       prenom:{type:String,required:true},
       email:{type:String,required:true,unique:true},
       password:{type:String,required:true},
       sexe:{type:String,enum:["Homme","Femme"],required:function(){return ['choriste'].includes(this.role);}},
       dateNaissance:{type:String,required:function(){return ['choriste'].includes(this.role);}},
       nationalite:{type:String,required:function(){return ['choriste'].includes(this.role);}},
       CIN:{type:String,required:function(){return ['choriste'].includes(this.role);}},
       situationPerso:{type:String,required:function(){return ['choriste'].includes(this.role);}},
       connaissanceMusic:{type:Boolean,required:function(){return ['choriste'].includes(this.role);}},
       activite:{type:Boolean,required:function(){return ['choriste'].includes(this.role);}},
       telephone:{type:String,required:function(){return ['choriste'].includes(this.role);}},
       notifications: { type: Array, default: [] },
       role:{type:String,enum:["choriste","manager","chef du pupitre","chef de choeur","admin"],required:true},
       statut:{type:String,enum:['Inactif',"Junior","Sénior","Vétéran","En congé","Choriste"],required:function(){return ['choriste'].includes(this.role);}},
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