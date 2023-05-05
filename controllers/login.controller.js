const signup_collection = require("../models/signup.model")
const notification_collection = require("../models/notification.model")
const event_collection = require("../models/events.model")
const fs = require('fs')
const path = require("path")
const btoa = require("btoa")
const bcrypt = require("bcryptjs")
async function signup(req, res) {
  let hash_password = await bcrypt.hash(req.body.signup_password, 12);
  if (!req.file) {
    req.file = {};
    req.file.filename = "defaultUser.png";
  }
  const data = {
    name: req.body.signup_name,
    email: req.body.signup_email,
    password: hash_password,
    contact: req.body.signup_contact,
    organisation: req.body.signup_organisation,
    profile_image: {
      data: btoa(fs.readFileSync(path.join(__dirname, '..', 'public', 'images', req.file.filename))),
      contentType: 'image/png'
    }
  }
  await signup_collection.insertMany([data])
  res.json({ check: "yo" });
};

async function profileUpdate(req, res) {
  if (!req.file) {
    req.file = {};
    req.file.filename = "defaultUser.png";
  }

  const data = {
    name: req.body.name,
    email: req.session.user,
    contact: req.session.contact,
    profile_image: {
      data: btoa(fs.readFileSync(path.join(__dirname, '..', 'public', 'images', req.file.filename))),
      contentType: 'image/png'
    }
  }
  if (req.body.password) {
    let hash_password = await bcrypt.hash(req.body.password, 12);
    data.password = hash_password;
  }
  await signup_collection.findOneAndUpdate({ email: req.session.user }, { $set: data });
  req.session.profile = await signup_collection.findOne({ email: data.email });
  res.redirect('/');
};

async function login(req, res) {
  const data = {
    email: req.body.login_email,
    password: req.body.login_password
  }
  try {
    const check = await signup_collection.findOne({ email: data.email })
    const event_notif = await notification_collection.findOne({ email: data.email });

    const isMatch = bcrypt.compareSync(data.password, check.password)
    if (isMatch) {
      req.session.isAuth = true;
      req.session.user = data.email;
      req.session.profile = check;
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
      res.render("landing_page", { event_data: event_notif, image: req.session.profile.profile_image })
    }
    else
      res.send("wrong password")
  }
  catch (err) {
    console.log(err);
    res.send("wrong credentials")
  }
};

async function index(req, res) {
  const event_notif = await notification_collection.findOne({ email: req.session.user });
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
  res.render("index", { event_data: event_notif, image: req.session.profile.profile_image })
};

async function logout(req, res) {
  req.session.destroy((err) => {
    if (err)
      throw err;
    else
      res.render("login");
  })
}
module.exports = {
  signup,
  login,
  logout,
  index, profileUpdate
}