const event_collection = require("../models/events.model")
const registration_collection = require("../models/registration.model")
async function registers(req,res){
let req_code=req.body.code;
try
{
const check = await event_collection.findOne({scope: {code:req_code }})

}
catch{
    res.send("wrong code")
}
}