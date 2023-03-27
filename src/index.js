const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const signup_collection=require("./mongodb_2")
const event_collection=require("./mongodb_events")
const templates_path=path.join(__dirname,'../templates')
let cur_session=""
app.use(express.json())
app.set("view engine","hbs")
app.set("views",templates_path)
app.use(express.urlencoded({extended:false}))
app.use("/public",express.static("public"))
app.get("/",(req,res)=>{
    res.render("login")
})
app.get("/new_event",(req,res)=>{
  res.render("create_event")
})
app.post("/signup",async(req,res)=>{
const data={
    name:req.body.signup_name,
    email:req.body.signup_email,
    password:req.body.signup_password
}
await signup_collection.insertMany([data])
})
app.post("/event_created",async(req,res)=>{
  const data={
      email:cur_session,
      event_name:req.body.event_name,
      date:req.body.event_date,
      time:req.body.event_time
      

  }
  await event_collection.insertMany([data])
  })
app.post("/login",async(req,res)=>{
    const data={
        email:req.body.login_email,
        password:req.body.login_password
    }
  try{
    const check=await signup_collection.findOne({email:data.email})
    if(check.password===data.password)
    {
      cur_session=data.email
      res.render("index")
  }
    else
    res.send("wrong password")
  }
  catch{
    res.send("wrong credentials")
  }
    })
app.listen(3000,()=>{
    console.log("port connected");
})
