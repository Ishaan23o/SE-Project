const individual_registration_collection = require("../models/individual_registrations.model")
const feedback_collection = require('../models/feedbacks.model')
const app_feedback_collection = require('../models/app_feedbacks.model')
const notification_collection = require("../models/notification.model")
async function give_feedback_app(req, res) {
    res.render('take_feedback', { email: req.session.user, image: req.session.profile.profile_image });
}
async function feedback_submitted(req, res) {
    await app_feedback_collection.updateOne({ 'email': req.session.user }, { $set: { name: req.body.name, feedback: req.body.message } }, { upsert: true })
    res.render('take_feedback', { email: req.session.user, image: req.session.profile.profile_image });
}
async function event_feedback_submitted(req, res) {
    await feedback_collection.updateOne({ 'Event_ID': req.body.event }, { $push: { feedback: { email: req.session.user, rating: req.body.score, comments: req.body.comment } } }, { upsert: true })
    const event_notif = await notification_collection.findOne({ email: req.session.user });
    res.render("index", { event_data: event_notif, image: req.session.profile.profile_image })
}
module.exports = {
    give_feedback_app,
    feedback_submitted,
    event_feedback_submitted
}