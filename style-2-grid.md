---
layout: minimal
title: Upcoming SCDS Events Grid
nav_order: 2 
---

<link
  rel="stylesheet"
  href="./assets/css/swiper.css"
/>
<link rel="stylesheet" href="./assets/css/events2grid.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="./assets/js/swiper-bundle.min.js"></script>

- <a href="index">Template 1</a>
- <a href="style-2">Template 2</a>
- <a href="style-2.2">Template 2: No colour background</a>
- <a href="style-2-grid">Template 2: Grid</a>
- <a href="style-3">Template 3</a>


<!-- Slider main container -->
<div class="swiper mySwiper">
    <div class="swiper-wrapper">
{% for event in site.data.events %}
<div class="swiper-slide">
        <img class="event-banner" src="{{ event.image }}">
        <div class="event-details">
          <h3 class="event-title">{{ event.title }}</h3>
          <div class="event-date">{{ event.start | date: "%B %d, %Y" }}</div>
          <div class="event-time">{{ event.start | date: "%I:%M %p" }}</div>
          <div class="event-location"></div>
        </div>
        <div class="event-register-cell">
          <a href="{{ event.url }}" class="register-button">Register</a>
        </div>
    </div>
{% endfor %}
    </div>
  </div>