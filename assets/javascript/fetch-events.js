const fetch = require('node-fetch');
const IcalExpander = require('ical-expander');
const cheerio = require('cheerio');
const fs = require('fs');

// Extract categories from an event component
function extractCategories(component) {
  const catProp = component.getFirstPropertyValue('categories');
  if (!catProp) return [];
  if (typeof catProp === 'string') return catProp.split(',').map(cat => cat.trim());
  if (Array.isArray(catProp)) return catProp.map(cat => cat.trim());
  return [];
}

// Expand recurring and single events from iCal
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
      start: event.startDate.toJSDate(),
      end: event.endDate.toJSDate(),
      description: event.description,
      location: event.location,
      url: event.component.getFirstPropertyValue('url') || '',
      categories: extractCategories(event.component)
    });
  });

  // Recurring instances
  expanded.occurrences.forEach(occ => {
    events.push({
      uid: occ.item.uid,
      title: occ.item.summary,
      start: occ.startDate.toJSDate(),
      end: occ.endDate.toJSDate(),
      description: occ.item.description,
      location: occ.item.location,
      url: occ.item.component.getFirstPropertyValue('url') || '',
      categories: extractCategories(occ.item.component)
    });
  });

  // Sort chronologically
  events.sort((a, b) => a.start - b.start);

  return events;
}

// Scrape image URL from event page
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

// Main script
(async () => {
  const events = await getExpandedEvents();

  for (const event of events) {
    event.image = await fetchImageFromUrl(event.url);
    console.log(`📅 ${event.title}\n🖼️ ${event.image || 'No image'}\n🏷️ ${event.categories.join(', ') || 'No categories'}\n`);
  }

  fs.writeFileSync('_data/events.json', JSON.stringify(events, null, 2));
  console.log(`✅ Saved ${events.length} events with images and categories to _data/events.json`);
})();
