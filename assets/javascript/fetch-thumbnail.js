const fetch = require('node-fetch');
const cheerio = require('cheerio');
const ical = require('ical.js');
const fs = require('fs');

async function fetchIcalEvents() {
  const icalUrl = 'https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565&cat=33846';
  const res = await fetch(icalUrl);
  const text = await res.text();
  
  const jcalData = ical.parse(text);
  const comp = new ical.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');
  
  return vevents.map(ve => {
    const event = new ical.Event(ve);
    return {
      uid: event.uid,
      title: event.summary,
      description: event.description,
      start: event.startDate.toJSDate(),
      url: event.component.getFirstPropertyValue('url') || '',
    };
  });
}

async function fetchEventImages() {
  const pageUrl = 'https://libcal.mcmaster.ca/calendar/scds?cid=7565&t=d&d=0000-00-00&cal=7565&inc=0';
  const res = await fetch(pageUrl);
  const html = await res.text();
  const $ = cheerio.load(html);
  const images = [];
  
  $('.img-thumbnail').each((i, el) => {
    images.push($(el).attr('src'));
  });
  return images;
}

(async () => {
  const events = await fetchIcalEvents();
  const images = await fetchEventImages();

  // Naive assignment: assign images to events by index
  // Ideally, match by title or other unique field if possible
  events.forEach((event, i) => {
    event.image = images[i] || '';
  });

  fs.writeFileSync('_data/events.json', JSON.stringify(events, null, 2));
  console.log('Events JSON file written with images');
})();
