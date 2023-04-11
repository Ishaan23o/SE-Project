const event_collection = require("../models/events.model")
const registration_collection = require("../models/registration.model")
const nodemailer = require("nodemailer");
const mailgen=require("mailgen");
async function register(req, res) {
  try{
    let find_x = await registration_collection.findOne({ 'Event_ID': req.body.register });
    find_x.registered = {};
    delete find_x._id;
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
    let find_elem = await event_collection.find({"scope.scope":"public"});
    res.render("find_event", { data: find_elem });}
    catch{
      res.send("wrong code");
    }
  };
  module.exports = {
    register,
    
  }