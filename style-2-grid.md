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

<!-- 🔹 Embed events JSON inline -->
<script id="events-data" type="application/json">
{{ site.data.events | jsonify | strip_newlines }}
</script>

<script>
  (function(){
    let events = [];
    let currentIndex = 0;
    const batchSize = 12;
    const wrapper = document.getElementById("events-wrapper");
    const loadMoreBtn = document.getElementById("loadMore");

    function getEvents() {
      if (events.length === 0) {
        try {
          const raw = document.getElementById("events-data").textContent.trim();
          events = JSON.parse(raw);
          // sort by start date
          events.sort((a,b) => new Date(a.start) - new Date(b.start));
        } catch(e) {
          console.error("Failed to parse events JSON", e);
        }
      }
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
    }

    function formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function renderEvents() {
      getEvents();

      const nextBatch = events.slice(currentIndex, currentIndex + batchSize);

      nextBatch.forEach(event => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.innerHTML = `
          <img class="event-banner" src="${event.image}" alt="Banner for ${event.title}">
          <div class="event-details">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-date">${formatDate(event.start)}</div>
            <div class="event-time">${formatTime(event.start)} – ${formatTime(event.end)}</div>
            <div class="event-location">${event.location || ""}</div>
          </div>
          <div class="event-register-cell">
            <a href="${event.url}" class="register-button" target="_blank" rel="noopener">Register</a>
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
  })();
</script>
