---
layout: minimal
title: Upcoming SCDS Events
nav_order: 1 
---

<link rel="stylesheet" href="./assets/css/events.css">

<div id="events-container">
  <p class="loading-message">Loading events...</p>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.4.0/ical.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('events-container');
  try {
    // Step 1: Fetch iCal data through CORS proxy
    container.innerHTML = '<p class="loading-message">Connecting to calendar...</p>';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const icalUrl = 'https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565';
    const response = await fetch(proxyUrl + icalUrl, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const icalData = await response.text();
    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');  
    if (vevents.length === 0) {
      container.innerHTML = '<p class="no-events">No upcoming events found.</p>';
      return;
    }
    container.innerHTML = '';
    vevents.slice(0, 10).forEach(vevent => {
      const event = new ICAL.Event(vevent);
      const eventId = event.uid.split('@')[0];    
      container.innerHTML += `
        <div class="event-wrapper">
          <div class="event-left-cell">
            <img class="event-banner" src="https://via.placeholder.com/800x400?text=SCDS+Event" alt="${event.summary}">
          </div>
          <div class="event-location">${event.location || 'Location TBD'}</div>
          <div class="event-register-cell">
            <a href="https://libcal.mcmaster.ca/event/${eventId}" class="register-button" target="_blank">View Event</a>
          </div>
          <div class="right-col">
            <h3 class="event-title">${event.summary}</h3>
            <span class="event-category">Workshop</span>
          </div>
          <div class="event-description">
            ${(event.description || 'Description not available').replace(/\\n/g, '<br>')}
          </div>
          <div class="event-corner-time-cell">
            <div class="event-date">${formatDate(event.startDate.toJSDate())}</div>
            <div class="event-time">${formatTime(event)}</div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Event loading failed:', error);
    container.innerHTML = `
      <div class="error-message">
        <p>⚠️ Couldn't load events. Try:</p>
        <ul>
          <li><a href="https://libcal.mcmaster.ca/calendar/scds" target="_blank">View calendar directly</a></li>
          <li>Refresh this page</li>
        </ul>
        <p><small>Technical details: ${error.message}</small></p>
      </div>
    `;
  }
});
// Formatting helpers
function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}
function formatTime(event) {
  if (event.startDate.isDate) return 'All Day';
  const start = event.startDate.toJSDate();
  const end = event.endDate.toJSDate();
  return `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
}
</script>

<style>
/* Basic error/loading states */
.loading-message, .no-events, .error-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}
.error-message {
  color: #d33;
  background: #fee;
  padding: 1rem;
  border-radius: 4px;
}
.error-message a {
  color: #06c;
}
.error-message small {
  display: block;
  margin-top: 1rem;
  color: #999;
}

/* Existing event styles (from your events.css) */
.event-wrapper {
  position: relative;
  border: 1px solid #eee;
  margin-bottom: 20px;
  padding: 15px;
}
.register-button {
  background: #2c3e50;
  color: white;
  padding: 8px 15px;
  text-decoration: none;
  border-radius: 3px;
  display: inline-block;
}
</style>