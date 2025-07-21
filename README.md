# search-page

A widget to easily search and explore SCDS workshops.

## Purpose

This repository contains a GitHub site of a search widget so that other websites (like scds.ca) can embed it into their pages.

There's an interactive search page version, as well as a non-interactive static text-only page.

## How to Use

### Adding to a page

To add the search widget to an SCDS WordPress page, use a shortcode block and include the following line:  
```[iframe src="https://learn.scds.ca/search-page/" width="100%" scrolling="yes" height="850px" ]```

To add the search widget to any other page, use the following iframe code:  
```html
<iframe src="https://learn.scds.ca/search-page/" width="100%" scrolling"yes" height="850px">
</iframe>
```

Currently, there's no support to add the text-only page as an automatically resizable widget.

### Adding/updating Workshops

To add or update the workshops that are listed in the tool, you have to modify `_data/workshop_list_scratch.csv`. If there are new series (with an acronym) added, `_data/workshop_series.json` must be modified as well.

To modify the CSV, the easiest thing would be to open it in a supporting spreadsheet application (something like Excel can work). From here, you'll see 8 columns: Title, Year, URL, Image, Series, Type, Topic, Software.

- Title: The name of the workshop. Ensure that this does not conflict with any other workshop name. If it does, add the year into the name.
    - Ex: Intermediate Python Programming (2022-2023) vs Intermediate Python Programming (2023-2024)
- Year: The year(s) that the workshop was offered. If the webpage has multiple years of the workshop offered, separate options by a semicolon (;) with no spaces.
    - Ex: `2022-2023;2023-2024` means that the workshop page has recordings for the 2022-2023 year as well as the 2023-2024 year.
- URL: The direct link to the workshop page.
- Image: The direct link to the workshop image. To do this, go to the workshop page, right click the image there, "Copy link to image". If workshop has no image, just write `TODO`.
- Series: The workshop series of the workshop. One of "DMDS", "DASH", "RDM", "DR", "RR", "SFS", "SPECIAL", "DS Bytes", "Events", "LibGuides", "ARL Digital Scholarship Institute", or "Other". If you plan to use any other series (with an acronym), update `workshop_series.json`.
- Type: Unused in the tool. One (or more) of "Recording", "Asynchronous Workshop", or "Resource".
- Topic: A list of semicolon separated workshops topics covered by the workshop. Prior to listing options out, look at the search widget to see existing list of topics and try to use these if applicable. Otherwise, feel free to create your own. Keep in mind, tags are case sensitive.
- Software: A list of semicolon separated softwares used by the workshop. Same as topics. Prior to listing options out, look at the search widget to see existing list of topics and try to use these if applicable. Otherwise, feel free to create your own. Keep in mind, tags are case sensitive. Use "N/A" if workshop does not use any software.

### Relavant Backend Search Code

If edits to the code are required, see the below.

- `assets/javascript/search-script.js` includes code from here: <https://github.com/christian-fei/Simple-Jekyll-Search>. However, it's been modified to add accessibility features and other SCDS-specific features. This file contains the actual logic for how searching works.
- The other file that contains code for the search widget is in `index.md`. This includes how entries should look, as well as some other entries on how searching should work (fuzzy search toggle, limit of searches per load, etc.).
- `search.json`: an automatically generated file that compiles the CSV workshop list into JSON data that the JavaScript interfaces with. This file is generated when the website is reloaded (aka when commits are made), so no edits should be needed to be done to this file, unless a new label is required to be used. Template language used is Liquid: <https://shopify.github.io/liquid/>.

## Credits

Made by Richie Motorgeanu.