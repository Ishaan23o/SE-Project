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
  var registered={};
  registered[cur_session]=true;
  var Event_ID=req.query.ID
  var temp1={
  Event_ID:Event_ID,
  registered:registered
};
  let reg=await registration_collection.find(temp1).count();
  if(reg)cur_elem[0].registered=true;
  console.log(cur_elem)
  res.render("find_event", { data: find_elem, event_data: cur_elem });
};
async function show_registered_event(req, res) {
 let registered={}
  registered[cur_session]=true;
  let x={registered}
  var find_elem_temp = await registration_collection.find(x);
   let ids=find_elem_temp.map((item)=>{
    return item.Event_ID
   })

  var find_elem=await event_collection.find({"scope.code":{$in:ids}});
  console.log(find_elem);
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
module.exports = {
  create_event,
  show_event,
  show_registered_event,
  find_event, 
}