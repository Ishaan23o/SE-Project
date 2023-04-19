const signup_collection = require("../models/signup.model")
const notification_collection = require("../models/notification.model")
const event_collection = require("../models/events.model")
async function signup(req, res) {
  const data = {
    name: req.body.signup_name,
    email: req.body.signup_email,
    password: req.body.signup_password,
    contact: req.body.signup_contact,
    organisation: req.body.signup_organisation
  }
  await signup_collection.insertMany([data])
  res.json({ check: "yo" });
};

async function login(req, res) {
  const data = {
    email: req.body.login_email,
    password: req.body.login_password
  }
  try {
    const check = await signup_collection.findOne({ email: data.email })
    const event_notif = await notification_collection.findOne({ email: data.email });
    if (check.password === data.password) {
      cur_session = data.email
      if ((event_notif !== null) && event_notif.waitlist) {
        for (var k in event_notif.waitlist) {
          event_notif.waitlist[k] = await event_collection.findOne({ 'scope.code': event_notif.waitlist[k] })
            .then((temp1) => {
              if (temp1.max_limit > temp1.total_registrations) return { name: temp1.event_name, code: temp1.scope.code };
              else return 'null';
            })
        };
        event_notif.waitlist = event_notif.waitlist.filter((temp) => {
          return temp != 'null';
        })
      }
      res.render("index", { event_data: event_notif })
    }
    else
      res.send("wrong password")
  }
  catch (err) {
    console.log(err);
    res.send("wrong credentials")
  }
};
module.exports = {
  signup,
  login,
}