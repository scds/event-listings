---
layout: minimal
title: Upcoming SCDS Events Style 2
nav_order: 2 
---

<link
  rel="stylesheet"
  href="./assets/css/swiper.css"
/>
<link rel="stylesheet" href="./assets/css/events2.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="./assets/js/swiper-bundle.min.js"></script>

- <a href="index">Template 1</a>
- <a href="style-2">Template 2</a>
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
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-pagination"></div>
  </div>

<script>
  var swiper;

  function initSwiper() {
    if (swiper) swiper.destroy(true, true); // Destroy existing instance

    var winWidth = $(window).width();

    if (winWidth < 960) {
      swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    } else if (winWidth >= 960 && winWidth < 1100) {
      swiper = new Swiper(".mySwiper", {
        slidesPerView: 3,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    } else {
      swiper = new Swiper(".mySwiper", {
        slidesPerView: 4,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }
  }

  $(document).ready(function () {
    initSwiper();
  });

  $(window).resize(function () {
    initSwiper();
  });
</script>
