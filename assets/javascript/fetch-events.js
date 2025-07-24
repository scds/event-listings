const fetch = require('node-fetch');
const IcalExpander = require('ical-expander');
const fs = require('fs');

(async () => {
  const res = await fetch('https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565');
  const icalData = await res.text();

  const icalExpander = new IcalExpander({ ics: icalData, maxIterations: 1000 });

  // get events between now and 1 year ahead
  const now = new Date();
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  const events = [];

  const expanded = icalExpander.between(now, oneYearFromNow);

  // Add single events
  expanded.events.forEach(event => {
    events.push({
      title: event.summary,
      start: event.startDate.toJSDate(),
      end: event.endDate.toJSDate(),
      description: event.description,
      location: event.location,
      url: event.url || ''
    });
  });

  // Add recurring event instances
  expanded.occurrences.forEach(occurrence => {
    events.push({
      title: occurrence.item.summary,
      start: occurrence.startDate.toJSDate(),
      end: occurrence.endDate.toJSDate(),
      description: occurrence.item.description,
      location: occurrence.item.location,
      url: occurrence.item.url || ''
    });
  });

  // Sort by start date ascending
  events.sort((a, b) => a.start - b.start);

  // Save JSON
  fs.writeFileSync('_data/events.json', JSON.stringify(events, null, 2));
  console.log(`Saved ${events.length} events to _data/events.json`);
})();
