# Frank Worldwide — Travel Stories

A personal travel blog told through an interactive 3D globe. Each pin marks a real trip; click it to read the story.

Live at: https://frankworldwide.github.io

## Stack

- Plain HTML/CSS/JS, no build step
- [Globe.gl](https://github.com/vasturiano/globe.gl) for the 3D globe (loaded via CDN)
- Trip data lives in [`data/trips.json`](data/trips.json)

## Adding a new trip

Open `data/trips.json` and add an entry:

```json
{
  "id": "unique-slug",
  "title": "Trip Title",
  "country": "Country Name",
  "lat": 0.0,
  "lng": 0.0,
  "date": "Month Year",
  "summary": "A few sentences about the trip.",
  "sourceUrl": "https://link-to-full-story",
  "sourceLabel": "Read the full story on ..."
}
```

Commit and push — GitHub Pages redeploys automatically.

## Running locally

This is a static site, but `fetch()`-ing `data/trips.json` requires an HTTP server (won't work via `file://`). Any static server works, e.g.:

```bash
npx serve .
```

Then open the printed local URL.
