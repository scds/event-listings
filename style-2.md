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
<script src="./assets/javascript/swiper-bundle.min.js"></script>

- <a href="/index">1</a> <a href="/style-2">2</a>

<!-- Slider main container -->
<div class="swiper mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
      <img class="event-banner" src="https://devgj00vx92jb.cloudfront.net/data/feat_img/4102/7565/1743543001.png">
      <div class="event-details">
        <h3 class="event-title">Zines as Critical Data</h3>
        <div class="event-date">April 15 2025</div>
        <div class="event-time">4:00PM</div>
        <div class="event-location"></div>
      </div>
      <details class="detail-accordion">
      <summary>Details</summary>
      Ready to shake up the ways we think about and create data culture(s)? For the past 4 months, CMSTMM 720: Data Culture(s) graduate students have been focused on planning, researching and producing zines that disrupt conventional understandings of data culture(s).  
    Explore how zines are a platform for crafting primary sources to enhance research, teaching, and learning! 
    Participate in reflective discussions on entrenched assumptions about scholarship, authorship, and editorial privilege!  
    Attend in person and make a mini zine! 
     </details>
      </div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
      <div class="swiper-slide">Slide 4</div>
      <div class="swiper-slide">Slide 5</div>
      <div class="swiper-slide">Slide 6</div>
      <div class="swiper-slide">Slide 7</div>
      <div class="swiper-slide">Slide 8</div>
      <div class="swiper-slide">Slide 9</div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-pagination"></div>
  </div>

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
else {
    var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2.5,
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
else {
    var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2.5,
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