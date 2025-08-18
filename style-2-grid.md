---
layout: minimal
title: Upcoming SCDS Events Grid
nav_order: 2
---

<link rel="stylesheet" href="{{ '/assets/css/swiper.css' | relative_url }}" />
<link rel="stylesheet" href="{{ '/assets/css/events2grid.css' | relative_url }}">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="{{ '/assets/js/swiper-bundle.min.js' | relative_url }}"></script>

<div class="swiper mySwiper">
  <div class="swiper-wrapper" id="eventsWrapper"></div>
</div>

<button id="loadMore" class="load-more-btn" style="display:none;">Load More Events</button>

<script>
(function(){
  const EVENTS_URL = "{{ '/assets/data/events.json' | relative_url }}"; // ✅ base-aware
  const BATCH_SIZE = 12;

  let idx = 0;
  let events = [];
  let swiper;

  function fmtDate(s){
    const d = new Date(s);
    return d.toLocaleDateString(undefined, { month: 'long', day: '2-digit', year: 'numeric' });
  }
  function fmtTime(s){
    const d = new Date(s);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendSlides(batch){
    const wrapper = document.getElementById('eventsWrapper');
    const frag = document.createDocumentFragment();

    batch.forEach(ev => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <img class="event-banner" src="${ev.image}" loading="lazy" alt="">
        <div class="event-details">
          <h3 class="event-title">${ev.title}</h3>
          <div class="event-date">${fmtDate(ev.start)}</div>
          <div class="event-time">${fmtTime(ev.start)}</div>
          <div class="event-location"></div>
        </div>
        <div class="event-register-cell">
          <a href="${ev.url}" class="register-button">Register</a>
        </div>
      `;
      frag.appendChild(slide);
    });

    wrapper.appendChild(frag);

    if (swiper) {
      swiper.update();           // keep Swiper in sync after adding slides
    } else if (window.Swiper) {  // init Swiper on first batch (optional config)
      swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 16,
        breakpoints: {
          640: { slidesPerView: 2, spaceBetween: 16 },
          1024:{ slidesPerView: 3, spaceBetween: 24 }
        },
        observer: true,
        observeParents: true
      });
    }
  }

  function loadNext(){
    const next = events.slice(idx, idx + BATCH_SIZE);
    appendSlides(next);
    idx += next.length;

    // toggle button
    document.getElementById('loadMore').style.display =
      (idx < events.length) ? 'inline-block' : 'none';
  }

  // Fetch events
  fetch(EVENTS_URL, { cache: 'no-store' })
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load ${EVENTS_URL} (${r.status})`);
      return r.json();
    })
    .then(data => {
      // OPTIONAL: sort upcoming first (remove if you already sort in the file)
      events = Array.isArray(data) ? data.slice() : [];
      // events.sort((a,b) => new Date(a.start) - new Date(b.start));

      if (!events.length) {
        console.warn('No events found in JSON.');
        return;
      }
      loadNext(); // first 12
      document.getElementById('loadMore').addEventListener('click', loadNext);
    })
    .catch(err => {
      console.error(err);
      // Debug helper: show a message if JSON path is wrong
      const btn = document.getElementById('loadMore');
      btn.textContent = 'Could not load events';
      btn.disabled = true;
      btn.style.opacity = 0.6;
      btn.style.cursor = 'not-allowed';
      btn.style.display = 'inline-block';
    });
})();
</script>
