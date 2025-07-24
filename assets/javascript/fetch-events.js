const fs = require('fs');
const ical = require('ical');
const { RRule, RRuleSet, rrulestr } = require('rrule');
const path = require('path');
const fetch = require('node-fetch');

const ICAL_URL = 'https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565&cat=33846';
const OUTPUT_FILE = path.join(__dirname, '../../_data/events.json');

// Fetch the .ics file and process it
async function fetchAndWriteEvents() {
  const res = await fetch(ICAL_URL);
  const icsText = await res.text();

  const data = ical.parseICS(icsText);
  const events = [];

  for (const key in data) {
    const event = data[key];
    if (event.type !== 'VEVENT') continue;

    // Handle recurring events
    if (event.rrule) {
      const rule = event.rrule;
      const between = rule.between(new Date(), new Date('2026-12-31'), true);

      between.forEach(date => {
        events.push({
          title: event.summary,
          start: date,
          end: new Date(date.getTime() + (event.end - event.start)), // Duration-based
          location: event.location || '',
          description: event.description || '',
        });
      });
    } else {
      // Single (non-recurring) event
      events.push({
        title: event.summary,
        start: event.start,
        end: event.end,
        location: event.location || '',
        description: event.description || '',
      });
    }
  }

  // Sort by start date
  events.sort((a, b) => new Date(a.start) - new Date(b.start));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(events, null, 2));
  console.log(`Wrote ${events.length} events to ${OUTPUT_FILE}`);
}

fetchAndWriteEvents().catch(console.error);
