---
layout: minimal
title: Upcoming SCDS Events Grid
nav_order: 2 
---

<link rel="stylesheet" href="./assets/css/events2grid.css">

<div class="swiper mySwiper">
    <div class="swiper-wrapper events-grid" id="eventsContainer">
      <button id="loadMoreEvents">Load More</button>
    </div>
</div>


<!-- Store all events as JSON for JS to process -->
<script type="application/json" id="events-data">
  {{ site.data.events | jsonify }}
</script>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const eventsData = JSON.parse(document.getElementById("events-data").textContent);
  const container = document.getElementById("eventsContainer");
  const batchSize = 12;
  let currentIndex = 0;

  function renderBatch() {
    for (let i = currentIndex; i < currentIndex + batchSize && i < eventsData.length; i++) {
      const event = eventsData[i];
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("event-item");
      eventDiv.innerHTML = `
        <img class="event-banner" src="${event.image}" loading="lazy">
        <div class="event-details">
          <h3 class="event-title">${event.title}</h3>
          <div class="event-date">${new Date(event.start).toLocaleDateString(undefined, {month: 'long', day:'numeric', year:'numeric'})}</div>
          <div class="event-time">${new Date(event.start).toLocaleTimeString(undefined, {hour: 'numeric', minute:'2-digit'})}</div>
          <div class="event-location"></div>
        </div>
        <div class="event-register-cell">
          <a href="${event.url}" class="register-button">Register</a>
        </div>
      `;
      container.appendChild(eventDiv);
    }

    currentIndex += batchSize;

    if (currentIndex >= eventsData.length) {
      document.getElementById("loadMoreEvents").style.display = "none";
    }
  }

  // initial batch
  renderBatch();

  // Load More button
  document.getElementById("loadMoreEvents").addEventListener("click", renderBatch);
});
</script>
