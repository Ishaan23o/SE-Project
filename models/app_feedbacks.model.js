const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/se_project")
    .then(() => {
        console.log("connection established")
    })
    .catch(() => {
        console.log("failed to connect");
    })

const feedback_schema = new mongoose.Schema({
    email: String,
    name: String,
    feedback: String
}
)
const collection = new mongoose.model("app_feedbacks", feedback_schema)
module.exports = collection