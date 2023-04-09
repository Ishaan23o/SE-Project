const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const moment = require('moment')
const event_controllers = require("../controllers/events.controller")
const login_controllers = require("../controllers/login.controller")
const templates_path = path.join(__dirname, '../templates')
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
app.get("/find_event", event_controllers.find_event)
app.get("/show_event", event_controllers.show_event)
app.post("/signup", login_controllers.signup)
app.post("/new_event", event_controllers.create_event)
app.post("/login", login_controllers.login)

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