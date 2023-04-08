const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/se_project")
    .then(() => {
        console.log("connection established")
    })
    .catch(() => {
        console.log("failed to connect events");
    })
const events = new mongoose.Schema({
    email:
    {
        type: String,
        required: true
    },
    event_name: {
        type: String,
        required: true
    },
    date: {
        registration: {
            type: Date,
        },
        event_date: {
            type: Date,
            required: true
        }
    },
    time: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    contact: {
        type: {},
        required: true
    },
    requirements: {
        type: {}
    },
    fees: {
        type: Number,
        required: true
    },
    scope: {
        scope: {
            type: String,
            required: true
        },
        code: {
            type: String,
            default: "PUBLIC"
        }
    }

}

)
const collection2 = new mongoose.model("Events", events)
module.exports = collection2