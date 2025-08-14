---
layout: minimal
title: Upcoming SCDS Events Grid
nav_order: 2
---

<link rel="stylesheet" href="./assets/css/swiper.css" />
<link rel="stylesheet" href="./assets/css/events2grid.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="./assets/js/swiper-bundle.min.js"></script>

<div class="swiper mySwiper">
  <div class="swiper-wrapper" id="eventsWrapper">
    <!-- Events will be injected here -->
  </div>
</div>

<button id="loadMore" class="load-more-btn" style="display:none;">Load More Events</button>

<script>
$(function(){
  const batchSize = 12;
  let currentIndex = 0;
  let eventsData = [];

  function renderBatch(){
    const nextBatch = eventsData.slice(currentIndex, currentIndex + batchSize);

    nextBatch.forEach(event => {
      $("#eventsWrapper").append(`
        <div class="swiper-slide">
          <img class="event-banner" src="${event.image}">
          <div class="event-details">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-date">${new Date(event.start).toLocaleDateString()}</div>
            <div class="event-time">${new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
          <div class="event-register-cell">
            <a href="${event.url}" class="register-button">Register</a>
          </div>
        </div>
      `);
    });

    currentIndex += nextBatch.length;

    if(currentIndex < eventsData.length){
      $("#loadMore").show();
    } else {
      $("#loadMore").hide();
    }
  }

  // Fetch JSON file from public assets folder
  fetch('./assets/data/events.json')
    .then(response => {
      if (!response.ok) throw new Error("Failed to load events JSON");
      return response.json();
    })
    .then(data => {
      eventsData = data;
      renderBatch(); // show first 12
    })
    .catch(err => console.error(err));

  $("#loadMore").on("click", renderBatch);
});
</script>
