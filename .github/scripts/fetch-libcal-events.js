// .github/scripts/fetch-libcal-events.js
const fetch = require('node-fetch'); // add to package.json deps if needed
const fs = require('fs');

const domain = process.env.LIBCAL_DOMAIN;
const clientId = process.env.LIBCAL_CLIENT_ID;
const clientSecret = process.env.LIBCAL_CLIENT_SECRET;
const calendarId = process.env.LIBCAL_CALENDAR_ID;

console.log('Requesting token from:', `https://${domain}/1.1/oauth/token`);

function getEventUrl(ev) {
  if (!ev) return "#";
  if (typeof ev.url === "string") return ev.url;
  if (ev.url && ev.url.public) return ev.url.public;
  if (ev.reserve_link && typeof ev.reserve_link === "string") return ev.reserve_link;
  return "#";
}

function getEventImage(ev) {
  if (ev.featured_image) return ev.featured_image.startsWith('http') ? ev.featured_image : `https://${domain}${ev.featured_image}`;
  if (ev.location && ev.location.image) return ev.location.image.startsWith('http') ? ev.location.image : `https://${domain}${ev.location.image}`;
  if (ev.description) {
    const imgMatch = ev.description.match(/<img.*?src="(.*?)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1].startsWith('http') ? imgMatch[1] : `https://${domain}${imgMatch[1]}`;
  }
  return "/assets/images/default.jpg";
}



// Basic OAuth token exchange for LibCal (1.1): adjust if your instance uses different route
async function getToken() {
  const tokenUrl = `https://${domain}/1.1/oauth/token`;
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    })
  });

  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
  return res.json();
}


async function fetchEvents(accessToken) {
  // Example endpoint; change query params as you need (days, limit, etc.)
  const eventsUrl = `https://${domain}/1.1/events?cal_id=${calendarId}&days=300&limit=50`;
  const res = await fetch(eventsUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Events request failed: ' + res.statusText);
  return res.json();
}

(async () => {
  try {
    const tokenResp = await getToken();
    const accessToken = tokenResp.access_token;

    // Fetch events from LibCal
    const eventsResp = await fetchEvents(accessToken);

    // <-- Add this line here to inspect the first event -->
    console.log(eventsResp.events[0]);

    // Map events to the structure your Jekyll site expects
    const events = (eventsResp.events || []).map(ev => ({
      title: ev.title,
      start: ev.start,
      url: getEventUrl(ev),
      location: ev.location_name || (ev.location && ev.location.name) || "",
      image: getEventImage(ev),
      description: ev.description || ""
    }));

    // Ensure _data folder exists
    if (!fs.existsSync('_data')) fs.mkdirSync('_data');

    // Write to JSON
    fs.writeFileSync('_data/events.json', JSON.stringify(events, null, 2), 'utf8');
    console.log(`✅ Wrote ${events.length} events to _data/events.json`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

