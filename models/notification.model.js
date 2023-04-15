const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/se_project")
    .then(() => {
        console.log("connection established")
    })
    .catch(() => {
        console.log("failed to connect");
    })
const notification_schema = new mongoose.Schema({
    email: {
        type: String
    },
    Events: {
        type: {}
    }

}
)
const collection = new mongoose.model("notification", notification_schema)
module.exports = collection