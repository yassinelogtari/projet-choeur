const mongoose=require("mongoose")

const testSchema=mongoose.Schema(
    {
    email:{type:String,unique:true,require:true},
    verified:{type:Boolean,default:false}
    }
)

module.exports=mongoose.model("Test",testSchema)