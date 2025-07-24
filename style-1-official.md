---
layout: minimal
title: Upcoming SCDS Events
nav_order: 1 
---

<link rel="stylesheet" href="./assets/css/events.css">

<a href="/index">1</a> <a href="/style-2">2</a>

{% for event in site.data.events %}
<div class="event-wrapper">
  <div class="event-left-cell">
    <img class="event-banner" src="/assets/images/default-thumb.jpg" alt="Event Thumbnail">
  </div>

  <div class="event-location">{{ event.location }}</div>

  <div class="event-register-cell">
     <a href="{{ event.url }}" class="register-button">Register</a>
  </div>
  
  <div class="right-col">
    <h3 class="event-title">{{ event.title }}</h3>
    <span class="event-category">SCDS</span>
  </div>
  
  <div class="event-description">{{ event.description }}</div>
  
  <div class="event-corner-time-cell">
    <div class="event-date">{{ event.start | date: "%B %d, %Y" }}</div>
    <div class="event-time">{{ event.start | date: "%I:%M %p" }}</div>
  </div>
</div>
{% endfor %}
