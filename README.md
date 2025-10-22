# Event-Listings

A widget to add upcoming SCDS events to scds.ca

## Purpose

This repository contains a GitHub site of an SCDS events widget so that other websites (like scds.ca) can embed it into their pages. The events are from McMaster's SCDS LibCal, through LibCal's API.

## How to Use

### Adding Events to a Page

There are two formats that the events widget is arranged in:

- [a grid format]("style-2-grid"), to be embedded in https://scds.ca/events/
- [a carousel slider format]("events-carousel") to be embedded in https://scds.ca home page.

**Carousel Slider**

To add the events carousel slider to an SCDS WordPress page, use a shortcode block and include the following line:  

```[iframe src="https://learn.scds.ca/event-listings/events-carousel" width="100%" scrolling="no" height="400px" ]```

To add the events carousel to any other page, use the following iframe code:  
```html
<iframe src="https://learn.scds.ca/event-listings/events-carousel" width="100%" scrolling"yes" height="400px">
</iframe>
```

**Events Grid**

To add the events grid to an SCDS WordPress page, use a shortcode block and include the following line:  
```[iframe src="https://learn.scds.ca/event-listings/style-2-grid" width="100%" height="1200px" scroll="yes"]```

To add the events carousel to any other page, use the following iframe code:  
```html
<iframe src="https://learn.scds.ca/event-listings/style-2-grid" width="100%" scrolling"yes" height="1200px">
</iframe>
```


### Adding/updating Events Manually

To manually add or update the events that are listed, you have to modify `_data/events.json`. Otherwise, events will be automatically updated based on what is on McMaster SCDS' Libcal.


In `_data/events.json`, an event will have the following data. To remove the event manually, erase the event's information along with its opening and closing brackets {} and any comma that follows. 

The event's information includes:

- "uid": "LibCal-7565-3920895" (SCDS LibCal ID)
- "title": The event/workshop title
- "start": Start time of event in ISO 8601 date and time format.
- "end": End time of event in ISO 8601 date and time format.
- "description": Event description
- "location": Event location
- "url": LibCal URL of event for registration
- "image": Image URL of event from the event's LibCal page. Event images are not stored in this event-listings github repository.


### Relevant Backend Search Code

If edits to the code are required, see the below.

- `assets/js/fetch-events.js` scrapes data from [SCDS's LibCal]("https://libcal.mcmaster.ca/calendar/scds?cid=7565&t=g&d=0000-00-00&cal=7565&inc=0"), which includes the event image banner, the event link, event time and location, without LibCal's API call.
- `.github/scripts/fetch-libcal-events.js` fetches events automatically from [SCDS's LibCal]("https://libcal.mcmaster.ca/calendar/scds?cid=7565&t=g&d=0000-00-00&cal=7565&inc=0") through API call
- `style-2-grid.md` and `events-carousel` and their respective css styles dictate how the events are displayed and styled.
- `events.json`: an automatically generated file that compiles the events information fetched by fetch event scripts. 
## Credits

Made by Tram Nguyen.