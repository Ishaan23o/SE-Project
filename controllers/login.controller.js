const signup_collection = require("../models/signup.model")
const notification_collection = require("../models/notification.model")
const event_collection = require("../models/events.model")
const bcrypt=require("bcryptjs")
async function signup(req, res) {
  let hash_password=await bcrypt.hash(req.body.signup_password,12);
  const data = {
    name: req.body.signup_name,
    email: req.body.signup_email,
    password: hash_password,
    contact: req.body.signup_contact,
    organisation: req.body.signup_organisation
  }
  await signup_collection.insertMany([data])
  res.json({ check: "yo" });
};

async function login(req, res) {
  console.log(req.session)
  const data = {
    email: req.body.login_email,
    password: req.body.login_password
  }
  try {
    const check = await signup_collection.findOne({ email: data.email })
    const event_notif = await notification_collection.findOne({ email: data.email });
 
    const isMatch=bcrypt.compareSync(data.password,check.password)
    if (isMatch) {
      req.session.isAuth=true
      req.session.user=data.email;
      console.log(req.session.user)
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
async function logout(req,res)
{
  req.session.destroy((err)=>{
    if(err)
    throw err;
    else
    res.render("login");
  })
}
module.exports = {
  signup,
  login,
  logout,
 
}