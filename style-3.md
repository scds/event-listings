---
layout: minimal
title: Upcoming SCDS Events
nav_order: 1 
---

<link rel="stylesheet" href="./assets/css/events3.css">

- <a href="index">Template 1</a>
- <a href="style-2">Template 2</a>
- <a href="style-3">Template 3</a>

<div class="events-container">
{% for event in site.data.events %}
<div class="event-wrapper">
  
  <div class="left-col">
    <img class="event-banner" src="{{ event.image }}" alt="Event Thumbnail">
    <div class="event-location">{{ event.location }}</div>
  </div>
  
  <div class="right-col">
    <h3 class="event-title">{{ event.title }}</h3>
    <div class="event-date">{{ event.start | date: "%B %d, %Y" }}</div>
    <div class="event-time">{{ event.start | date: "%I:%M %p" }}</div>
    <a href="{{ event.url }}" class="register-button">Register</a>
  </div>
</div>
{% endfor %}
</div>
