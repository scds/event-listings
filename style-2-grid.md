---
layout: minimal
title: Upcoming SCDS Events Grid
nav_order: 2 
---

<link rel="stylesheet" href="./assets/css/swiper.css"/>
<link rel="stylesheet" href="./assets/css/events2grid.css"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="./assets/js/swiper-bundle.min.js"></script>

<div class="swiper mySwiper">
  <div class="swiper-wrapper" id="events-container"></div>
</div>
<div style="text-align:center; margin-top:1em;">
  <button id="loadMore" class="btn btn-outline">Load More...</button>
</div>

<!-- Embed JSON into page -->
<script>
  const eventsData = {{ site.data.events | jsonify }};
  let currentIndex = 0;
  const batchSize = 12;

  function renderEvents() {
    const container = document.getElementById("events-container");
    const nextBatch = eventsData.slice(currentIndex, currentIndex + batchSize);

    nextBatch.forEach(event => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <img class="event-banner" src="${event.image}">
        <div class="event-details">
          <h3 class="event-title">${event.title}</h3>
          <div class="event-date">${new Date(event.start).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
          <div class="event-time">${new Date(event.start).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
          <div class="event-location"></div>
        </div>
        <div class="event-register-cell">
          <a href="${event.url}" class="register-button">Register</a>
        </div>
      `;
      container.appendChild(slide);
    });

    currentIndex += batchSize;

    if (currentIndex >= eventsData.length) {
      document.getElementById("loadMore").style.display = "none";
    }

    // Re-init swiper so new slides work
    if (window.mySwiper) {
      window.mySwiper.update();
    }
  }

  document.getElementById("loadMore").addEventListener("click", renderEvents);

  // init swiper + first batch
  window.addEventListener("DOMContentLoaded", () => {
    renderEvents();
    window.mySwiper = new Swiper(".mySwiper", {
      slidesPerView: 3,
      spaceBetween: 20,
      pagination: { el: ".swiper-pagination", clickable: true },
    });
  });
</script>
