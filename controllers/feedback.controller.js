const individual_registration_collection = require("../models/individual_registrations.model")
const feedback_collection = require('../models/feedbacks.model')
const app_feedback_collection = require('../models/app_feedbacks.model')
async function give_feedback_app(req, res) {
    res.render('take_feedback', { email: cur_session });
}
async function feedback_submitted(req, res) {
    await app_feedback_collection.updateOne({ 'email': cur_session }, { $set: { name: req.body.name, feedback: req.body.message } }, { upsert: true })
    res.render('take_feedback', { email: cur_session });
}
module.exports = {
    give_feedback_app,
    feedback_submitted
}