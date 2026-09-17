# Entebbe Corporate League — website

A static website (HTML, CSS, JavaScript). No build tools or server required: open `index.html` in a browser, or upload the whole folder to any web host (Netlify, GitHub Pages, cPanel, etc.).

## ⚠️ Before launch: set your domain
The SEO tags use a **placeholder domain**: `https://www.entebbecorporateleague.com`.
Find-and-replace it across all files (`*.html`, `stories/*.html`, `sitemap.xml`, `robots.txt`) with the real domain. Wrong canonical URLs can stop Google indexing the site.

## Structure

```
index.html            Home: video hero, value proposition, why-join cards, two leagues, latest stories, partner carousel
about.html            Our story, numbers, photos, mission & vision, services
activities.html       Activity cards, filterable by All / Corporate / Kids Academy
gallery.html          Corporate vs Kids Academy, then by sport (and age group for kids), with lightbox
updates.html          News & highlights, Latest updates (timeline), Exclusive stories
registration.html     Fees, eligibility, steps, and a form for company or child entry
stories/              One page per news article or exclusive story (own URL = better search ranking)
404.html              "Page not found" page
sitemap.xml           List of pages for Google/Bing
robots.txt            Tells search engines where the sitemap is
site.webmanifest      App name/icons when saved to a phone home screen
css/styles.css        All styling, mobile-first
js/main.js            Behaviour. The CONFIG block at the top holds the form endpoint and email
pictures/             Every image, icon and the hero video
```

The Calendar page has been removed.

## What changed for SEO
- **All content is in the HTML.** Gallery, activities, partners and updates used to be drawn by JavaScript. They're now plain HTML that search engines can read.
- **Every page has** a unique title (under ~60 characters) and description, a canonical URL, and Open Graph/Twitter tags for link previews on WhatsApp, Facebook, X and LinkedIn.
- **Structured data (JSON-LD)** tells Google this is a sports organisation in Entebbe, with contacts, venue and Instagram. It also marks up breadcrumbs on every inner page and articles on each story page.
- **Each story has its own page** under `stories/` so it can rank and be shared on its own.
- **Other basics:** `sitemap.xml`, `robots.txt`, a 404 page, descriptive image alt text, one `<h1>` per page, and width/height on every image to prevent layout jumps.
- **After launch:** submit `sitemap.xml` in Google Search Console and create a **Google Business Profile** for the league at the venue. That profile is the biggest lever for "Entebbe" searches.

## Mobile-first
- **Phones are the base design.** Larger screens add columns via `min-width` breakpoints at 560, 760 and 1024 px.
- **Tap targets and form inputs.** Tap targets are at least 44 px. Form inputs use 16 px text so iPhones don't zoom in.
- **Filters.** Filter chips scroll sideways on phones.
- **Hero video.** On phones, slow connections and data-saver mode, the video isn't downloaded at all; the poster photo shows instead.
- **Header.** On phones the menu collapses, and the Corporate / Kids switch sits on its own row.

## Adding content

### A latest update (short announcement)
In `updates.html`, copy one `<li>` inside `<ol class="timeline">`, put it at the top, and edit the date and text.

### A news item or exclusive story
1. Copy an existing page in `stories/` (e.g. `why-we-plant-trees.html`) and rename it with a short hyphenated name.
2. Edit the `<title>`, description, canonical/`og:url`, the JSON-LD headline and dates, the heading, image and body.
3. Add a card for it in `updates.html`: a `news-card` for news, or a `story-card` for exclusive stories.
4. Add its URL to `sitemap.xml`.

### A gallery photo
Save it in the right `pictures/` folder, then copy one `<li>` in `gallery.html` and change:
- `data-league`: `corporate` or `kids`
- `data-sport`
- `data-age`: kids only
- the image path, alt text and caption

Add `class="is-wide"` for a large tile. The filter buttons update automatically.

## Brand
- **Colours** come from the ECL logo, and are set once at the top of `css/styles.css`:
  - Lemon green `#B5DC1B`
  - Black `#151515`
  - White
- **Corporate mode** uses black surfaces with lemon accents.
- **Kids Academy mode** flips this: lemon surfaces with black accents, plus rounder shapes.
- **Logo:** `pictures/logo/ecl-logo.svg` (full) and `ecl-mark.svg` (ECL letters only) are clean vector files taken from the supplied PDF. They take the colour of their surroundings, so the same file works in lemon, black or white.
- **Icons and share image:** `favicon.svg`, `favicon.png`, `pictures/icons/*` and `og-image.jpg` are generated from the logo.

## Photos

### Where they're used
| Area | Photos |
|---|---|
| Kids Academy gallery | 17 football, 2 swimming |
| Corporate gallery | 3 netball, 4 volleyball, 4 tug of war, 3 tree planting |
| Activity cards | One photo per sport |
| Home, About, Updates | League photos (tree planting, Kids Academy football) |

There are no placeholder images left. Partners and participating organisations show as text tiles until real logos are supplied.

`pictures/image-fallback.jpg` (the logo on black) only appears if a photo file goes missing.

### ⚠️ Photo sources
The netball, volleyball, tug of war and swimming photos appear to come from other events found online, not from ECL. For example:
- One swimming photo shows another programme's branding.
- One volleyball photo is a school match.
- One netball photo is an international fixture.

Their captions are kept general and don't say they're from ECL. Before launch, either get permission to use them or replace them with the league's own photos. Replace a photo by saving the new one with the same file name, e.g. `pictures/corporate/netball/netball-01.jpg`.

### Adding more gallery photos
1. Export as JPG (iPhone HEIC files won't display in browsers).
2. Resize to 1600 px on the long side, plus an 800 px copy named `…-sm.jpg`. The small copy is optional for images under ~900 px.
3. Put the files in the right folder, then copy one `<li>` in `gallery.html` and edit it. Sport filter buttons appear automatically for any sport that has photos.

### Age groups
The gallery age filter appears once photos are tagged, e.g. `data-age="Under 8"` in `gallery.html`.

### Hero video
There's no video yet, so the hero shows a photo, which changes with the Corporate/Kids switch.
1. Add `pictures/hero/hero-video.mp4`.
2. Set `data-src="pictures/hero/hero-video.mp4"` on the `<video>` tag in `index.html`.

## Registration form
Create a free form at https://formspree.io and paste the endpoint into `formEndpoint` at the top of `js/main.js`. Without it, the form opens the visitor's email app pre-filled and addressed to the league.

## Please confirm before launch
- **Domain**: see the top of this file.
- **Venue**: Lake Victoria Primary School (the original brief said "Lake Victory").
- **Season fee**: UGX 2,000,000 per company per season. Kawowo reported UGX 1,000,000 per team for 2024.
- **Kids Academy age groups**: Under 8 / Under 11 / Under 14 in the registration form are placeholders.
- **Kids Academy venue**: the football photos were taken at ESA Park, not the school playground. The site doesn't name a Kids Academy venue. Add it once confirmed.
- **Photo consent**: the gallery shows children. Confirm parents have agreed to their photos being published.
- **Photo rights**: see "Photo sources" above.
- **Partner logos**: send official logo files to replace the text tiles.
- **Kids Academy details**: the fee, eligibility and swimming venue aren't published anywhere.
- **Written content**:
  - The mission, vision and "Our story" text are drafts.
  - The two exclusive stories ("Why we plant trees", "Six-a-side") are drafts in the league's voice. Ask the organisers to review them and add real quotes.
- **Update dates**: "September 2026" on the website-launch and photo-appeal updates should match the real launch date.
- **Contacts**: the league email and phone numbers come from 2024 press coverage.

## Accessibility
- **Navigation and controls:** keyboard-accessible menu, filters and lightbox, with visible focus.
- **Skip link and breadcrumbs:** a "skip to content" link on every page and breadcrumbs on inner pages.
- **Reduced motion:** respected; the carousel stops and the video isn't loaded.
- **Media controls:** a pause button on the hero video, and the carousel pauses on hover or focus.
