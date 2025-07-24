const fs = require("fs");
const fetch = require("node-fetch");
const ICAL = require("ical.js");

const url = "https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565&cat=33846";

async function fetchICal(url) {
  const res = await fetch(url);
  const text = await res.text();
  const jcalData = ICAL.parse(text);
  const comp = new ICAL.Component(jcalData);
  const events = comp.getAllSubcomponents("vevent").map(e => new ICAL.Event(e));

  return events.map(evt => ({
    title: evt.summary,
    description: evt.description,
    location: evt.location,
    start: evt.startDate.toString(),
    end: evt.endDate.toString(),
  }));
}

fetchICal(url).then(events => {
  fs.writeFileSync("_data/events.json", JSON.stringify(events, null, 2));
});
