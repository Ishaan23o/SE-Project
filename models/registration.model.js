const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/se_project")
    .then(() => {
        console.log("connection established")
    })
    .catch(() => {
        console.log("failed to connect");
    })
    
const registration_schema = new mongoose.Schema({
    Event_ID:
    {
        type: String,
        required: true
    },
   registered:[{email:String}]
}
)
const collection = new mongoose.model("registrations", registration_schema)
module.exports = collection