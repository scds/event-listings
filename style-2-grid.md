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

<!-- 🔹 Embed all events JSON directly in the page -->
<script id="events-data" type="application/json">
  {{ site.data.events | jsonify }}
</script>

<script>
  let events = [];
  let currentIndex = 0;
  const batchSize = 12;
  const wrapper = document.getElementById("events-wrapper");
  const loadMoreBtn = document.getElementById("loadMore");

  function getEvents() {
    if (events.length === 0) {
      const raw = document.getElementById("events-data").textContent;
      events = JSON.parse(raw);
    }
  }

  function renderEvents() {
    getEvents();

    const nextBatch = events.slice(currentIndex, currentIndex + batchSize);

    nextBatch.forEach(event => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide"; // still use CSS class for styling
      slide.innerHTML = `
        <img class="event-banner" src="${event.image}">
        <div class="event-details">
          <h3 class="event-title">${event.title}</h3>
          <div class="event-date">${new Date(event.start).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</div>
          <div class="event-time">${new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        <div class="event-register-cell">
          <a href="${event.url}" class="register-button">Register</a>
        </div>
      `;
      wrapper.appendChild(slide);
    });

    currentIndex += nextBatch.length;

    if (currentIndex >= events.length) {
      loadMoreBtn.style.display = "none";
    }
  }

  loadMoreBtn.addEventListener("click", renderEvents);

  // render first 12 on page load
  renderEvents();
</script>
