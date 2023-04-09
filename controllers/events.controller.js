const event_collection = require("../models/events.model")
const registration_collection = require("../models/registration.model")
async function create_event(req, res) {
  let cur_status = ""
  let reg_Date = new Date(req.body.registration_date)
  let dates = new Date();
  if (dates > reg_Date)
    reg_Date = req.body.event_date
  const date = {
    event_date: req.body.event_date,
    registration: reg_Date
  };
  let contact = req.body.con_control;
  let requirements = req.body.req_control;
  let scope = {
    scope: req.body.event_scope,
    code: "PUBLIC"
  }
  let data = {
    email: cur_session,
    event_name: req.body.event_name,
    date: date,
    time: req.body.event_time,
    type: req.body.event_type,
    description: req.body.event_desc,
    fees: req.body.event_fee,
    contact: contact,
    requirements: requirements,
    scope: scope
  }
  var id = require("crypto").randomBytes(64).toString('hex');
  let find_code = await event_collection.find({ "scope.code": id }).count();
  while (find_code > 0) {
    id = require("crypto").randomBytes(64).toString('hex');
    find_code = await event_collection.find({ "scope.code": id }).count();
  }
  data.scope.code = id;

  await event_collection.insertMany([data])
  let registartion_data = {
    Event_ID: id,
    registered:
    {

    }
  }
  await registration_collection.insertMany([registartion_data]);
  res.render("index")
};

async function register(req, res) {
  let find_x = await registration_collection.findOne({ 'Event_ID': req.body.register });
  find_x.registered = {};
  delete find_x._id;
  find_x.registered[cur_session] = true;
  await registration_collection.updateOne({ 'Event_ID': req.body.register }, find_x, { $upsert: false }, function (err, result) {
    if (err) return res.send(500, { error: err });
  });
  let find_elem = await event_collection.find();
  res.render("find_event", { data: find_elem });
}


async function show_event(req, res) {
  let find_elem = await event_collection.find({ email: cur_session });
  let cur_date = new Date();
  cur_date.setHours(0, 0, 0, 0)
  for (var i = 0; i < find_elem.length; i++) {
    var element = find_elem[i];
    let req_date = new Date(element.date)
    req_date.setHours(0, 0, 0, 0)
    if (req_date > cur_date)
      element.status = "upcoming"
    else if (req_date < cur_date)
      element.status = "expired"
    else
      element.status = "today"
  }
  res.render("show_events", { data: find_elem })
};
async function find_event(req, res) {
  let find_elem = await event_collection.find();
  let cur_date = new Date();
  cur_date.setHours(0, 0, 0, 0)
  for (var i = 0; i < find_elem.length; i++) {
    var element = find_elem[i];
    let req_date = new Date(element.date)
    req_date.setHours(0, 0, 0, 0)
    if (req_date > cur_date)
      element.status = "upcoming"
    else if (req_date < cur_date)
      element.status = "expired"
    else
      element.status = "today"
  }
  let cur_elem = await event_collection.find({ 'scope.code': req.query.ID });
  res.render("find_event", { data: find_elem, event_data: cur_elem });
};
module.exports = {
  create_event,
  show_event,
  find_event, register
}