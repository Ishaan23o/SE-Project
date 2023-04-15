const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const moment = require('moment')
const fs=require('fs')
const event_controllers = require("../controllers/events.controller")
const login_controllers = require("../controllers/login.controller")
const registrations_controllers = require("../controllers/registrations.controller")
const notification_controllers = require("../controllers/notifications.controller")
const templates_path = path.join(__dirname, '../templates')
const multer=require('multer')
let storage=multer.diskStorage({
  destination:'public/images/',
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})
let upload=multer({
  storage:storage
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
app.post("/new_event", event_controllers.create_event)

app.post("/register", registrations_controllers.register)
app.post("/edit_event", registrations_controllers.edit_event)
app.post("/edited_event", registrations_controllers.edited_event)
app.post("/delete_event", registrations_controllers.delete_event)

app.post("/signup", login_controllers.signup)
app.post("/new_event",upload.single('brochure'),event_controllers.create_event)
app.post("/login", login_controllers.login)

app.get("/notif_clicked", notification_controllers.clicked_notif)
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
  if (arg1.length) return false;
  return Object.keys(arg1).length != 0;
});