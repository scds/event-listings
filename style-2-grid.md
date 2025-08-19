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

<script>
  let events = [];
  let currentIndex = 0;
  const batchSize = 12;
  const wrapper = document.getElementById("events-wrapper");
  const loadMoreBtn = document.getElementById("loadMore");

  async function fetchEvents() {
    if (events.length === 0) {
      // fetch your events.json file
      const response = await fetch("{{ '/_data/events.json' | relative_url }}");
      events = await response.json();
    }
    renderEvents();
  }

  function renderEvents() {
    const nextBatch = events.slice(currentIndex, currentIndex + batchSize);

    nextBatch.forEach(event => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide"; // still use for CSS grid styling
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

    // hide button when all events are loaded
    if (currentIndex >= events.length) {
      loadMoreBtn.style.display = "none";
    }
  }

  loadMoreBtn.addEventListener("click", renderEvents);

  // render first 12 on page load
  fetchEvents();
</script>
