const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/se_project")
    .then(() => {
        console.log("connection established")
    })
    .catch(() => {
        console.log("failed to connect");
    })

const feedback_schema = new mongoose.Schema({
    Event_ID:
    {
        type: String,
        required: true
    },
    feedback: [{ email: String, rating: { type: Number, minimum: 1, maximum: 10 }, comments: String }]
}
)
const collection = new mongoose.model("feedbacks", feedback_schema)
module.exports = collection