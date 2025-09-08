const fetch = require('node-fetch');
const IcalExpander = require('ical-expander');
const cheerio = require('cheerio');
const fs = require('fs');

// 🔹 Convert Date → ISO string with EST/EDT label
function toEastern(date) {
  const options = {
    timeZone: "America/Toronto", // auto-switches EST/EDT
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short" // gives "EST" or "EDT"
  };

  const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(date);
  const get = type => parts.find(p => p.type === type)?.value;

  const iso =
    `${get("year")}-${get("month")}-${get("day")}T` +
    `${get("hour")}:${get("minute")}:${get("second")}`;

  const zone = get("timeZoneName"); // "EST" or "EDT"

  return `${iso} ${zone}`;
}


// Fetch iCal and expand recurring events
async function getExpandedEvents() {
  const res = await fetch('https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565');
  const icalData = await res.text();
  const icalExpander = new IcalExpander({ ics: icalData, maxIterations: 1000 });

  const now = new Date();
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  const expanded = icalExpander.between(now, oneYearFromNow);
  const events = [];

  // Single events
  expanded.events.forEach(event => {
    events.push({
      uid: event.uid,
      title: event.summary,
      start: toEastern(event.startDate.toJSDate()),
      end: toEastern(event.endDate.toJSDate()),
      description: event.description,
      location: event.location,
      url: event.component.getFirstPropertyValue('url') || ''
    });
  });

  // Recurring instances
  expanded.occurrences.forEach(occ => {
    events.push({
      uid: occ.item.uid,
      title: occ.item.summary,
      start: toEastern(occ.startDate.toJSDate()),
      end: toEastern(occ.endDate.toJSDate()),
      description: occ.item.description,
      location: occ.item.location,
      url: occ.item.component.getFirstPropertyValue('url') || ''
    });
  });

  // Sort chronologically
  events.sort((a, b) => new Date(a.start) - new Date(b.start));

  return events;
}

// Scrape image from event page
async function fetchImageFromUrl(url) {
  if (!url) return '';
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    return $('.img-thumbnail').attr('src') || '';
  } catch (err) {
    console.warn(`⚠️ Failed to fetch image from ${url}:`, err.message);
    return '';
  }
}

(async () => {
  const events = await getExpandedEvents();

  for (const event of events) {
    event.image = await fetchImageFromUrl(event.url);
    console.log(`🖼️ ${event.title}: ${event.start} → ${event.end}`);
  }

  fs.writeFileSync('_data/events.json', JSON.stringify(events, null, 2));
  console.log(`✅ Saved ${events.length} events with images to _data/events.json`);
})();
