const event_collection = require("../models/events.model")
async function create_event(req, res) {
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
  };
  

  async function show_event(req, res){
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
  };
  module.exports={
    create_event,
    show_event,
  }