const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/se_project")
    .then(() => {
        console.log("connection established")
    })
    .catch(() => {
        console.log("failed to connect");
    })
const sign_up_schema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    organisation: {
        type: String,
        default: "N/A"
    }, profile_image: {
        data: String,
        contentType: String
    },
    otp:{
    type:Number,
    },
    authenticated:
    {
        type:Boolean,
    
    },
    expireAt: { 
        type: Date, 
        default: Date.now,
       expires: '5m' 
      }
}
)

const collection = new mongoose.model("otp", sign_up_schema)
module.exports = collection