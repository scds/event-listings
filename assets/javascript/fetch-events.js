const fs = require('fs');
const ical = require('ical');
const { rrulestr } = require('rrule');
const path = require('path');
const fetch = require('node-fetch');

const ICAL_URL = 'https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565&cat=33846';
const OUTPUT_FILE = path.join(__dirname, '../../_data/events.json');

async function fetchAndWriteEvents() {
  const res = await fetch(ICAL_URL);
  const icsText = await res.text();

  const data = ical.parseICS(icsText);
  const events = [];

  const today = new Date();
  const endDate = new Date('2026-12-31');

  for (const key in data) {
    const event = data[key];
    if (event.type !== 'VEVENT') continue;

    const url = event.url || '';

    // Recurring events
    if (event.rrule) {
      const rule = rrulestr(event.rrule.toString(), { dtstart: event.start });
      const allDates = rule.between(today, endDate, true);

      for (const date of allDates) {
        events.push({
          title: event.summary,
          start: date.toISOString(),
          end: new Date(date.getTime() + (event.end - event.start)).toISOString(),
          location: event.location || '',
          description: event.description || '',
          url: url
        });
      }
    } else {
      // Single event
      events.push({
        title: event.summary,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        location: event.location || '',
        description: event.description || '',
        url: url
      });
    }
  }

  // Sort events chronologically
  events.sort((a, b) => new Date(a.start) - new Date(b.start));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(events, null, 2));
  console.log(`✅ Wrote ${events.length} events to ${OUTPUT_FILE}`);
}

fetchAndWriteEvents().catch(console.error);
