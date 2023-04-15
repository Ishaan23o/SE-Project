const event_collection = require("../models/events.model")
const registration_collection = require("../models/registration.model")
const notification_collection = require("../models/notification.model")
const nodemailer = require("nodemailer");
const mailgen = require("mailgen");

async function edit_event(req, res) {
  let elem = await event_collection.findOne({ 'scope.code': req.body.Edit });
  res.render('edit_event', { data: elem });
}

async function delete_event(req, res) {
  await event_collection.findOneAndDelete({ 'scope.code': req.body.Edit });
  await registration_collection.findOneAndDelete({ Event_ID: req.body.Edit });
  res.render('index')
}

async function edited_event(req, res) {
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
  let data = {
    event_name: req.body.event_name,
    date: date,
    time: req.body.event_time,
    type: req.body.event_type,
    description: req.body.event_desc,
    fees: req.body.event_fee,
    contact: contact,
    requirements: requirements,
    'scope.scope': req.body.event_scope
  }
  if (req.body.notif) {
    var x = {
      time: (new Date()).toISOString(),
      name: data.event_name
    };
    var y = `Events.${req.body.code}`;
    var z = {};
    z.email = cur_session;
    z[y] = x;
    await notification_collection.updateOne({ email: cur_session }, { "$set": z }, { upsert: true });
  }


  let elem = await event_collection.findOneAndUpdate({ 'scope.code': req.body.code }, { $set: data });
  const event_notif = await notification_collection.findOne({ email: cur_session });
  res.render("index", { event_data: event_notif })
}


async function register(req, res) {
  try {
    let find_x = {};
    find_x.registered = {};
    find_x.registered[cur_session] = true;
    await registration_collection.updateOne({ 'Event_ID': req.body.register }, find_x, { $upsert: false }, function (err, result) {
      if (err) return res.send(500, { error: err });
    });
    // let config={
    //   service:'gmail',
    //   auth:{
    //     user:'prathambhatia8686@gmail.com',
    //     pass:'urgcylkulebavygd'
    //   }
    // }
    // let transporter=nodemailer.createTransport(config);
    // let mail_generator=new mailgen({
    //   theme:"default",
    //   product:{
    //     name: "Mailgen",
    //     link:'https://mailgen.js'
    //   }
    // })
    // let response={
    //   body:{
    //     intro:"you have successfully registered",
    //   }
    // }
    // let mail=mail_generator.generate(response)
    // let message={
    //   from:'prathambhatia8686@gmail.com',
    //   to:cur_session,
    //   html:mail
    // }
    // transporter.sendMail(message);
    let find_elem = await event_collection.find({ "scope.scope": "public" });
    res.render("find_event", { data: find_elem });
  }
  catch {
    res.send("wrong code");
  }
};
module.exports = {
  register,
  edit_event,
  edited_event, delete_event
}