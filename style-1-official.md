---
layout: minimal
title: Upcoming SCDS Events
nav_order: 1 
---

<link rel="stylesheet" href="./assets/css/events.css">
<style>
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
  .load-more-button:hover {
    background: #34495e;
  }
  .load-more-button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/ical.js/1.4.0/ical.min.js"></script>

<a href="/index">1</a> <a href="/style-2">2</a>

<div id="events-container">
  <!-- Events will be inserted here -->
</div>

<button id="load-more" class="load-more-button">Load More Events</button>

<script>
document.addEventListener('DOMContentLoaded', async function() {
  // Configuration
  const eventsPerLoad = 5;
  let loadedEvents = 0;
  let allEvents = [];
  
  // 1. Fetch and parse iCal data
  const icalResponse = await fetch('https://libcal.mcmaster.ca/ical_subscribe.php?src=p&cid=7565');
  const icalData = await icalResponse.text();
  const jcalData = ICAL.parse(icalData);
  const comp = new ICAL.Component(jcalData);
  
  // Store all events sorted by date
  allEvents = comp.getAllSubcomponents('vevent')
    .map(vevent => new ICAL.Event(vevent))
    .sort((a, b) => a.startDate.toJSDate() - b.startDate.toJSDate());
  
  // 2. Initial load
  await loadEvents(eventsPerLoad);
  
  // 3. Load More button
  document.getElementById('load-more').addEventListener('click', async () => {
    await loadEvents(eventsPerLoad);
  });

  async function loadEvents(count) {
    const container = document.getElementById('events-container');
    const loadMoreBtn = document.getElementById('load-more');
    
    // Show loading state
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';
    
    // Process next batch of events
    const batch = allEvents.slice(loadedEvents, loadedEvents + count);
    
    for (const event of batch) {
      const eventId = event.uid.split('@')[0];
      const eventUrl = `https://libcal.mcmaster.ca/event/${eventId}`;
      
      try {
        // Fetch event details for image
        const eventHtml = await fetch(eventUrl).then(r => r.text());
        const parser = new DOMParser();
        const doc = parser.parseFromString(eventHtml, 'text/html');
        
        // Extract image (fallback to placeholder)
        const imageSrc = doc.querySelector('.event-image img')?.src || 
          'https://via.placeholder.com/800x400?text=Event+Image';
        
        // Create event element
        const eventEl = document.createElement('div');
        eventEl.className = 'event-wrapper';
        eventEl.innerHTML = `
          <div class="event-left-cell">
            <img class="event-banner" src="${imageSrc}" alt="${event.summary}" loading="lazy">
          </div>
          <div class="event-location">${event.location || 'TBD'}</div>
          <div class="event-register-cell">
            <a href="${eventUrl}" class="register-button" target="_blank">View Event</a>
          </div>
          <div class="right-col">
            <h3 class="event-title">${event.summary}</h3>
            <span class="event-category">${event.categories?.[0] || ''}</span>
          </div>
          <div class="event-description">
            ${event.description?.replace(/\\n/g, '<br>') || ''}
          </div>
          <div class="event-corner-time-cell">
            <div class="event-date">${formatDate(event.startDate.toJSDate())}</div>
            <div class="event-time">${formatTime(event)}</div>
          </div>
        `;
        container.appendChild(eventEl);
        
      } catch (error) {
        console.error(`Failed to load event ${eventId}:`, error);
        // Fallback display without image
        const eventEl = document.createElement('div');
        eventEl.className = 'event-wrapper';
        eventEl.innerHTML = `
          <div class="event-left-cell">
            <img class="event-banner" src="https://via.placeholder.com/800x400?text=Event+Image" alt="${event.summary}">
          </div>
          <div class="event-register-cell">
            <a href="https://libcal.mcmaster.ca/event/${eventId}" class="register-button" target="_blank">View Event</a>
          </div>
          <div class="right-col">
            <h3 class="event-title">${event.summary}</h3>
          </div>
          <div class="event-corner-time-cell">
            <div class="event-date">${formatDate(event.startDate.toJSDate())}</div>
            <div class="event-time">${formatTime(event)}</div>
          </div>
        `;
        container.appendChild(eventEl);
      }
      
      loadedEvents++;
    }
    
    // Update button state
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Load More Events';
    
    // Hide button if all events loaded
    if (loadedEvents >= allEvents.length) {
      loadMoreBtn.style.display = 'none';
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
});
</script>