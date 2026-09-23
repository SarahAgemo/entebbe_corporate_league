# Entebbe Corporate League — website

A static website (HTML, CSS, JavaScript). No build tools or server required: open `index.html` in a browser, or upload the whole folder to any web host (Netlify, GitHub Pages, cPanel, etc.).

## ⚠️ Before launch: set your domain
The SEO tags use a **placeholder domain**: `https://www.entebbecorporateleague.com`.
Find-and-replace it across all files (`*.html`, `stories/*.html`, `sitemap.xml`, `robots.txt`) with the real domain. Wrong canonical URLs can stop Google indexing the site.

## Structure

```
index.html                  Home: what ECL is, what we do, the two sides of ECL, value for each audience, green action, news, partners
corporate-league.html       Disciplines, what organisations gain, how a season works
academy.html                ECL Sports Academy: year-round programme, what children do, progression, parent information
kids-league.html            Kids League: the children's competition and its calendar
environment.html            Environment & community: ecosystem restoration and how to join in
partners.html               Why partner, ways to partner, current partners + the partnership enquiry form
news.html                   News & highlights (filterable), latest updates, exclusive stories
gallery.html                Photos by story category, then by sport
about.html                  Our story, numbers, mission and vision
join.html                   Chooses a route (organisation / child / partner) and lists contact details
register-organisation.html  Corporate League registration form
register-child.html         Sports Academy enrolment form
stories/                    One page per news article or story
404.html, sitemap.xml, robots.txt, site.webmanifest
css/styles.css              All styling, mobile-first
js/main.js                  Behaviour. The CONFIG block at the top holds the form endpoint and email
pictures/                   Photos, logo files and icons
```

## How ECL is presented
- **ECL** is the whole organisation: corporate sport, networking, wellness, team building, community engagement, CSR and ecosystem restoration.
- **Corporate League** is the platform for organisations.
- **ECL Sports Academy** is a year-round youth programme in its own right, running through school terms and holidays.
- **Kids League** is the Academy's competition, with its own calendar peaking in the third-term school break.
- Nothing on the site says the Academy happens only on corporate match days.

## Brand and colour balance
Colours are set once at the top of `css/styles.css`: lemon green `#B5DC1B`, black `#151515` and white.

Each area of the site leads with a different one of them, so the palette reads as identity rather than decoration:
- **Black-led:** Home, Corporate League, Environment, News, Gallery, Join, Register an organisation
- **Lemon-led:** Sports Academy, Kids League, Enrol a child, Partners (set by `data-area` on the `<body>` tag)

To change an area's treatment, change its `data-area` value. To add a new lemon-led page, add its `data-area` name to the selector list near the top of `css/styles.css`.

**Logo:** `pictures/logo/ecl-logo.svg` (full) and `ecl-mark.svg` (letters only) are vector files taken from the supplied PDF. They take the colour of their surroundings, so one file works in lemon, black or white. Icons and the share image are generated from them.

## Photos

### Where they're used
| Area | Photos |
|---|---|
| Gallery, Youth development | 17 Academy football, 2 swimming |
| Gallery, Corporate sport | 3 netball, 4 volleyball, 4 tug of war |
| Gallery, Environment & community | 3 tree planting |
| Pages | Corporate disciplines, Academy, Kids League, Environment, Partners, Home |

There are no placeholder images. Partners and participating organisations show as text tiles until real logos are supplied. `pictures/image-fallback.jpg` (the logo on black) only appears if a photo file goes missing.

### ⚠️ Photo sources
The netball, volleyball, tug of war and swimming photos appear to come from other events found online, not from ECL. Their captions are kept general and don't claim to be ECL events. Before launch, get permission to use them or replace them with ECL's own photos (save the new file with the same name).

### Gallery storytelling
Photos are grouped by story, not only by sport: **Corporate sport**, **Youth development**, **Environment & community**. Add more categories (networking, partners, celebrations) by setting `data-cat` on a gallery `<li>` — the filter buttons build themselves from what's there.

### Adding photos
1. Export as JPG (iPhone HEIC files won't display in browsers).
2. Resize to 1600 px on the long side, plus an 800 px copy named `…-sm.jpg` (optional for small images).
3. Copy one `<li>` in `gallery.html` and edit `data-cat`, `data-sport`, the path, alt text and caption.

### Hero video
There's no video yet, so the hero shows a photo.
1. Add `pictures/hero/hero-video.mp4` (10–20 s loop, muted, 1280×720, under 8 MB).
2. Set `data-src="pictures/hero/hero-video.mp4"` on the `<video>` tag in `index.html`.

## Adding content
- **A short update:** copy an `<li>` at the top of `<ol class="timeline">` in `news.html`.
- **A news item or story:** copy a page in `stories/`, edit its title, description, canonical URL, JSON-LD and body, add a card in `news.html` (set `data-area` so the filters work), and add the URL to `sitemap.xml`.
- **Forms:** there are three, each on its own page, and each marked with `data-kind` on the `<form>` tag:
  - `register-organisation.html` (`corporate`)
  - `register-child.html` (`academy`)
  - `partners.html#enquiry` (`partner`)
  Paste a free Formspree endpoint into `formEndpoint` at the top of `js/main.js` and all three submit to it. Each submission includes an `enquiry_type` field so you can tell them apart. Without an endpoint, a form opens the visitor's email app pre-filled with a subject naming the form.

## SEO
Unique titles and descriptions per page, canonical URLs, Open Graph and Twitter tags, JSON-LD (organisation, breadcrumbs, articles), sitemap, robots file, 404 page, alt text on every image, one `<h1>` per page, and width/height on images to prevent layout shift.

After launch: submit `sitemap.xml` in Google Search Console and create a Google Business Profile for ECL.

## Still to confirm
See `CONTENT-QUESTIONS.md` for the list of facts the site still needs from ECL.
