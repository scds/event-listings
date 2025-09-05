const fetch = require('node-fetch');
const IcalExpander = require('ical-expander');
const cheerio = require('cheerio');
const fs = require('fs');

// 🔹 Convert Date → ISO string in strict EST (UTC-5)
function toEST(date) {
  // get UTC timestamp, then subtract 5 hours
  const est = new Date(date.getTime() - (5 * 60 * 60 * 1000));
  return est.toISOString().replace('Z', '-05:00'); 
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
      start: toEST(event.startDate.toJSDate()),
      end: toEST(event.endDate.toJSDate()),
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
      start: toEST(occ.startDate.toJSDate()),
      end: toEST(occ.endDate.toJSDate()),
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
