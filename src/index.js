const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const moment = require('moment')
const fs = require('fs')
const event_controllers = require("../controllers/events.controller")
const login_controllers = require("../controllers/login.controller")
const registrations_controllers = require("../controllers/registrations.controller")
const notification_controllers = require("../controllers/notifications.controller")
const feedback_controllers = require("../controllers/feedback.controller")
const templates_path = path.join(__dirname, '../templates')
const multer = require('multer')
let storage = multer.diskStorage({
  destination: 'public/images/',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
let upload = multer({
  storage: storage
})
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templates_path)
app.use(express.urlencoded({ extended: false }))
app.use("/public", express.static("public"))
num_req = 1;
num_con = 1;
app.get("/", (req, res) => {
  res.render("login")
})
app.get("/new_event", (req, res) => {
  res.render("create_event")
})
app.get("/private_registration", (req, res) => {
  res.render("private_registration")
})


app.get("/find_event", event_controllers.find_event)
app.get("/show_event", event_controllers.show_event)
app.get("/show_registered_events", event_controllers.show_registered_event)
app.post("/get_list", event_controllers.get_list)


app.post("/register", registrations_controllers.register)
app.post("/cancel_register", registrations_controllers.cancel_registration)
app.post("/waitlist", registrations_controllers.waitlist)
app.post("/edit_event", registrations_controllers.edit_event)
app.post("/edited_event", registrations_controllers.edited_event)
app.post("/delete_event", registrations_controllers.delete_event)

app.post("/signup", login_controllers.signup)
app.post("/new_event", upload.single('brochure'), event_controllers.create_event)
app.post("/login", login_controllers.login)

app.post("/give_feedback_app", feedback_controllers.give_feedback_app)
app.post("/feedback_submitted", feedback_controllers.feedback_submitted)

app.get("/notif_clicked", notification_controllers.clicked_notif)
app.get("/waitlist_clicked", notification_controllers.waitlist_clicked)

app.listen(3000, () => {
  console.log("port connected");
})


hbs.handlebars.registerHelper('formatTime', function (date, format) {
  var mmnt = moment(date);
  return mmnt.format(format);
});

hbs.handlebars.registerHelper('array', function (elem) {
  return Array.isArray(elem);
});

hbs.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('notEmpty', function (arg1) {
  if (arg1.length) return true;
  return Object.keys(arg1).length != 0;
});
hbs.handlebars.registerHelper("when", function (operand_1, operator, operand_2, options) {
  var operators = {
    'eq': function (l, r) { return l == r; },
    'noteq': function (l, r) { return l != r; },
    'gt': function (l, r) { return Number(l) > Number(r); },
    'or': function (l, r) { return l || r; },
    'and': function (l, r) { return l && r; },
    '%': function (l, r) { return (l % r) === 0; }
  }
    , result = operators[operator](operand_1, operand_2);

  if (result) return options.fn(this);
  else return options.inverse(this);
});
hbs.handlebars.registerHelper('In', function (elem, list, options) {
  let email_array = list.map((elements) => (elements.email))
  if (email_array.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});
hbs.handlebars.registerHelper('notIn', function (elem, list, options) {

  let email_array = list.map((elements) => (elements.email))
  if (email_array.indexOf(elem) > -1) {
    return options.inverse(this);
  }
  return options.fn(this);
});

hbs.handlebars.registerHelper('notPast', function (elem) {
  if (new Date(elem) < new Date()) return false;
  return true;
});