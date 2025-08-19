---
layout: minimal
title: Upcoming SCDS Events Grid
nav_order: 2 
---

<link rel="stylesheet" href="./assets/css/swiper.css" />
<link rel="stylesheet" href="./assets/css/events2grid.css" />

<div class="myEventsGrid">
  <div id="events-wrapper" class="swiper-wrapper">
    <!-- Events will be injected here -->
  </div>
</div>

<div style="text-align:center; margin-top: 1em;">
  <button id="loadMore" class="btn btn-outline">Load More...</button>
</div>

<!-- Embed the JSON inline -->
<script id="events-data" type="application/json">
  {{ site.data.events | jsonify | strip_newlines }}
</script>

<!-- 🔹 Add this script here, after the JSON and elements exist -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  const eventsData = JSON.parse(document.getElementById('events-data').textContent.trim());
  const eventsWrapper = document.getElementById('events-wrapper');
  const loadMoreButton = document.getElementById('loadMore');
  let currentIndex = 0;
  const batchSize = 12;

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function renderEvents() {
    const nextBatch = eventsData.slice(currentIndex, currentIndex + batchSize);
    nextBatch.forEach(event => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <img class="event-banner" src="${event.image}" alt="Banner for ${event.title}">
        <div class="event-details">
          <h3 class="event-title">${event.title}</h3>
          <div class="event-date">${formatDate(event.start)}</div>
          <div class="event-time">${formatTime(event.start)} – ${formatTime(event.end)}</div>
          <div class="event-location">${event.location}</div>
        </div>
        <div class="event-register-cell">
          <a href="${event.url}" class="register-button" target="_blank" rel="noopener">Register</a>
        </div>
      `;
      eventsWrapper.appendChild(slide);
    });
    currentIndex += nextBatch.length;
    if (currentIndex >= eventsData.length) {
      loadMoreButton.style.display = 'none';
    }
  }

  loadMoreButton.addEventListener('click', renderEvents);
  renderEvents(); // Initial render
});
</script>