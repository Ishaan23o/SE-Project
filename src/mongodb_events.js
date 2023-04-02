const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/se_project")
.then(()=>{
    console.log("connection established")
})
.catch(()=>{
    console.log("failed to connect events");
})
const events=new mongoose.Schema({
    email:
    {
        type:String,
        required:true
    },
    event_name:{
        type:String,
        required:true},
        date:{
            type:Date,
            required:true},
            time:{
                type:String,
                required:true},
                type:{
                    type:String,
                    required:true}
                  
            }

)
const collection2=new mongoose.model("collection2",events)
module.exports=collection2