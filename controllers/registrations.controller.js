const event_collection = require("../models/events.model")
const registration_collection = require("../models/registration.model")
async function register(req, res) {
  try{
    let find_x = await registration_collection.findOne({ 'Event_ID': req.body.register });
    find_x.registered = {};
    delete find_x._id;
    find_x.registered[cur_session] = true;
    await registration_collection.updateOne({ 'Event_ID': req.body.register }, find_x, { $upsert: false }, function (err, result) {
      if (err) return res.send(500, { error: err });
    });
    let find_elem = await event_collection.find();
    res.render("find_event", { data: find_elem });}
    catch{
      res.send("wrong code");
    }
  };
  module.exports = {
    register,
    
  }