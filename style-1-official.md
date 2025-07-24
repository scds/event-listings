---
layout: minimal
title: Upcoming SCDS Events
nav_order: 1 
---

<link rel="stylesheet" href="./assets/css/events.css">

<div id="events-container">
  <p class="loading-message">Loading events...</p>
</div>

<button id="load-more" class="load-more-button" style="display:none;">Load More</button>

<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.4.0/ical.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('events-container');
  const loadMoreBtn = document.getElementById('load-more');
  
  try {
    // 1. Fetch iCal data
    container.innerHTML = '<p>Fetching calendar data...</p>';
    const icalUrl = 'https://cors-anywhere.herokuapp.com/https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565';
    const icalResponse = await fetch(icalUrl);
    
    if (!icalResponse.ok) {
      throw new Error(`HTTP error! status: ${icalResponse.status}`);
    }
    
    const icalData = await icalResponse.text();
    console.log("Raw iCal data:", icalData.substring(0, 200)); // Log first 200 chars
    
    // 2. Parse iCal
    container.innerHTML = '<p>Parsing events...</p>';
    let events = [];
    try {
      const jcalData = ICAL.parse(icalData);
      const comp = new ICAL.Component(jcalData);
      events = comp.getAllSubcomponents('vevent')
        .map(vevent => new ICAL.Event(vevent))
        .sort((a, b) => a.startDate.toJSDate() - b.startDate.toJSDate());
      
      console.log("Parsed events:", events);
    } catch (parseError) {
      console.error("Parsing failed:", parseError);
      throw new Error("Couldn't parse calendar data");
    }
    
    // 3. Display initial events
    if (events.length === 0) {
      container.innerHTML = '<p>No upcoming events found.</p>';
      return;
    }
    
    await displayEvents(events.slice(0, 5)); // Show first 5
    
    // 4. Set up Load More if needed
    if (events.length > 5) {
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.addEventListener('click', () => displayEvents(events.slice(5)));
    }
    
  } catch (error) {
    console.error("Failed to load events:", error);
    container.innerHTML = `
      <p class="error-message">
        Error loading events. Please try again later.<br>
        <small>${error.message}</small>
      </p>
    `;
  }
});

async function displayEvents(events) {
  const container = document.getElementById('events-container');
  container.innerHTML = ''; // Clear loading message
  
  for (const event of events) {
    try {
      const eventId = event.uid.split('@')[0];
      const eventUrl = `https://libcal.mcmaster.ca/event/${eventId}`;
      
      const eventEl = document.createElement('div');
      eventEl.className = 'event-wrapper';
      eventEl.innerHTML = `
        <div class="event-left-cell">
          <img class="event-banner" src="https://via.placeholder.com/800x400?text=Event" 
               alt="${event.summary}" loading="lazy">
        </div>
        <div class="event-location">${event.location || 'Location TBD'}</div>
        <div class="event-register-cell">
          <a href="${eventUrl}" class="register-button" target="_blank">View Event</a>
        </div>
        <div class="right-col">
          <h3 class="event-title">${event.summary}</h3>
          <span class="event-category">Event</span>
        </div>
        <div class="event-description">
          ${event.description?.replace(/\\n/g, '<br>') || 'No description available'}
        </div>
        <div class="event-corner-time-cell">
          <div class="event-date">${formatDate(event.startDate.toJSDate())}</div>
          <div class="event-time">${formatTime(event)}</div>
        </div>
      `;
      container.appendChild(eventEl);
      
    } catch (error) {
      console.error(`Error rendering event:`, error);
    }
  }
}

// Helper functions
function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatTime(event) {
  if (event.startDate.isDate) return 'All Day';
  return `
    ${event.startDate.toJSDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
    -
    ${event.endDate.toJSDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
  `;
}
</script>

<style>
.loading-message, .error-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}
.error-message small {
  color: #d33;
}
.load-more-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>