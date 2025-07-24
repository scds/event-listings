---
layout: minimal
title: Upcoming SCDS Events
nav_order: 1
---

<link rel="stylesheet" href="./assets/css/events.css">

<a href="/index">1</a> <a href="/style-2">2</a>

<div id="events-container">Loading events...</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.4.0/ical.min.js"></script>
<script>
  const icalUrl = "https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565&cat=33846";
  const calendarPageUrl = "https://libcal.mcmaster.ca/calendar/scds?cid=7565&t=d&d=0000-00-00&cal=7565&ct=33846&inc=0";
  const proxy = "https://api.allorigins.win/raw?url=";

  const proxy = "https://api.allorigins.win/raw?url=";

async function fetchEvents() {
  const res = await fetch(proxy + encodeURIComponent(icalUrl));
  const text = await res.text();
  const jcalData = ICAL.parse(text);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");
  return vevents.map(evt => {
    const e = new ICAL.Event(evt);
    return {
      summary: e.summary,
      description: e.description,
      location: e.location,
      start: e.startDate.toJSDate()
    };
  });
}

  async function fetchThumbnails() {
    const res = await fetch(proxy + encodeURIComponent(calendarPageUrl));
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll(".img-thumbnail")).map(img => img.src);
  }

  function formatDateTime(date) {
    return {
      date: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    };
  }

  async function renderEvents() {
    try {
      const [events, thumbnails] = await Promise.all([fetchEvents(), fetchThumbnails()]);
      const container = document.getElementById("events-container");
      container.innerHTML = "";

      events.sort((a, b) => a.start - b.start).forEach((event, index) => {
        const { date, time } = formatDateTime(event.start);
        const thumb = thumbnails[index] || "https://via.placeholder.com/400x200?text=No+Image";

        const html = `
          <div class="event-wrapper">
            <div class="event-left-cell">
              <img class="event-banner" src="${thumb}">
            </div>
            <div class="event-location">${event.location || ""}</div>
            <div class="event-register-cell">
              <a href="#" class="register-button">Register</a>
            </div>
            <div class="right-col">
              <h3 class="event-title">${event.summary}</h3>
              <span class="event-category">SCDS Event</span>
            </div>
            <div class="event-description">${event.description || ""}</div>
            <div class="event-corner-time-cell">
              <div class="event-date">${date}</div>
              <div class="event-time">${time}</div>
            </div>
          </div>`;
        container.insertAdjacentHTML("beforeend", html);
      });
    } catch (error) {
      console.error("Error rendering events:", error);
      document.getElementById("events-container").textContent = "Failed to load events.";
    }
  }

  renderEvents();
</script>
