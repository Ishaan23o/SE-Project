const event_collection = require("../models/events.model")
const registration_collection = require("../models/registration.model")
const notification_collection = require("../models/notification.model")

async function clicked_notif(req, res) {
    var str = 'Events.' + req.query.event;
    console.log(str);
    var x = {};
    x[str] = true;
    await notification_collection.updateOne({ email: cur_session }, { $unset: x });
    res.redirect(`/find_event?ID=${req.query.event}`);
}
module.exports = {
    clicked_notif
}