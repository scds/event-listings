fetch("/_data/events.json")
  .then(res => res.json())
  .then(events => {
    const container = document.getElementById("events-container");
    events.forEach(event => {
      const div = document.createElement("div");
      div.className = "event-wrapper";
      div.innerHTML = `
        <div class="event-left-cell">
          <img class="event-banner" src="${event.image || '/assets/img/default.jpg'}" alt="Event Banner">
        </div>
        <div class="event-location">${event.location || ""}</div>
        <div class="event-register-cell">
          <a href="${event.url}" class="register-button" target="_blank">Register</a>
        </div>
        <div class="right-col">
          <h3 class="event-title">${event.title}</h3>
          <span class="event-category">${event.category || ""}</span>
        </div>
        <div class="event-description">${event.description || ""}</div>
        <div class="event-corner-time-cell">
          <div class="event-date">${event.date}</div>
          <div class="event-time">${event.time}</div>
        </div>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Error loading events:", err);
    document.getElementById("events-container").innerText = "Failed to load events.";
  });
