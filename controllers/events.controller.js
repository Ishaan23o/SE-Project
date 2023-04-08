const event_collection = require("../models/events.model")
async function create_event(req, res) {
  let cur_status = ""
  let reg_Date=new Date(req.body.registration_date)
  let dates=new Date();
  if(dates>reg_Date)
  reg_Date=req.body.event_date
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
  if (data.scope != "PUBLIC") {
    var id = require("crypto").randomBytes(64).toString('hex');
    let find_code = await event_collection.find({ "scope.code": id }).count();
    while (find_code > 0) {
      id = require("crypto").randomBytes(64).toString('hex');
      find_code = await event_collection.find({ "scope.code": id }).count();
    }
    data.scope.code = id;
  }

  await event_collection.insertMany([data])

  res.render("create_event")
};


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
  res.render("find_event", { data: find_elem })
};
module.exports = {
  create_event,
  show_event,
  find_event
}