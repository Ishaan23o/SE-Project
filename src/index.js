const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const signup_collection = require("./mongodb_2")
const event_collection = require("./mongodb_events")
const templates_path = path.join(__dirname, '../templates')
let cur_session = ""
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templates_path)
app.use(express.urlencoded({ extended: false }))
app.use("/public", express.static("public"))
app.get("/", (req, res) => {
  res.render("login")
})
app.get("/new_event", (req, res) => {
  res.render("create_event")
})
app.get("/show_event", async (req, res) => {
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
})

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.signup_name,
    email: req.body.signup_email,
    password: req.body.signup_password,
    contact: req.body.signup_contact,
    organisation: req.body.signup_organisation
  }
  await signup_collection.insertMany([data])
})
app.post("/new_event", async (req, res) => {
  let cur_status = ""
  console.log(req.body.event_type)
  const data = {
    email: cur_session,
    event_name: req.body.event_name,
    date: req.body.event_date,
    time: req.body.event_time,
    type: req.body.event_type,
  }
  await event_collection.insertMany([data])
  res.render("create_event")
})
app.post("/login", async (req, res) => {
  const data = {
    email: req.body.login_email,
    password: req.body.login_password
  }
  try {
    const check = await signup_collection.findOne({ email: data.email })
    if (check.password === data.password) {
      cur_session = data.email
      res.render("index")
    }
    else
      res.send("wrong password")
  }
  catch {
    res.send("wrong credentials")
  }
})
app.listen(3000, () => {
  console.log("port connected");
})
