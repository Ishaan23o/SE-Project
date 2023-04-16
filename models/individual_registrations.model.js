const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/se_project")
    .then(() => {
        console.log("connection established")
    })
    .catch(() => {
        console.log("failed to connect");
    })
    
const registration_schema = new mongoose.Schema({
   Email:
    {
        type: String,
        required: true
    },
   events:[{events:String}]
}
)
const collection = new mongoose.model("individual registrations", registration_schema)
module.exports = collection