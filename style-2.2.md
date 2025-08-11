---
layout: minimal
title: 'Upcoming SCDS Events Slider: No Colour'
nav_order: 2 
---

<link
  rel="stylesheet"
  href="./assets/css/swiper.css"
/>
<link rel="stylesheet" href="./assets/css/events2v2.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="./assets/js/swiper-bundle.min.js"></script>

- <a href="index">Template 1</a>
- <a href="style-2">Template 2</a>
- <a href="style-2.2">Template 2: No colour background</a>
- <a href="style-2.3">Template 2: Grid</a>
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
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
  <!--<div class="swiper-pagination"></div>-->

<script>
$(document).ready(function() {
      if ($(window).width() < 960) {
      var swiper = new Swiper(".mySwiper", {
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
  }
  else if ($(window).width() > 960 && $(window).width() < 1100) {
  var swiper = new Swiper(".mySwiper", {
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
}

else {
    var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});
  }
    });
  
$(window).resize(function() {
  if ($(window).width() < 960) {
      var swiper = new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
          el: ".swiper-pagination",
          clickable: true,
      },
});
  }
  else if ($(window).width() > 960 && $(window).width() < 1100) {
  var swiper = new Swiper(".mySwiper", {
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
}
else {
    var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});
  }
});
    
    
</script>