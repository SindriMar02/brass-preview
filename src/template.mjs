/* BRASS - Panel Chrome, rebuilt strictly on the reference system.

   The reference has exactly two kinds of section and nothing else:
     A. a photo card, with chrome and micro-labels laid over it, and type
        anchored bottom-left
     B. a cream panel floating over a photograph, holding rows of
        name / description / price
   Every dark text band and every split-with-image row is gone. If a section
   is not A or B, it does not belong on this page. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
/* their real lockup, traced off the vinyl on their own window */
const LOCKUP = readFileSync(join(here, '..', 'public', 'img', 'brass-lockup.svg'), 'utf8')
  .replace(/<\?xml[^>]*\?>/, '')
  .replace(/<!DOCTYPE[^>]*>/, '')
  .trim();

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const marks = (items) =>
  `<div class="pc-marks">${items.map((t) => `<p class="pc-label">${esc(t)}</p>`).join('')}</div>`;

const lockup = (copy) => `
  <span class="pc-lockup" role="img" aria-label="${esc(copy.brand)} ${esc(copy.descriptor)}">
    ${LOCKUP}
  </span>`;

const chrome = (copy, { nav = false, ink = false } = {}) => `
  <div class="pc-chrome${ink ? ' pc-chrome--ink' : ''}">
    ${lockup(copy)}
    <p class="pc-label pc-chrome__mid">${esc(copy.chromeMid)}</p>
    ${
      nav
        ? `<nav aria-label="Aðalvalmynd">
            <ul class="pc-chrome__list">
              ${copy.nav.map((i) => `<li class="pc-label"><a href="${esc(i.href)}">${esc(i.label)}</a></li>`).join('')}
            </ul>
          </nav>`
        : `<p class="pc-label pc-chrome__right" aria-hidden="true">${esc(copy.handle)}</p>`
    }
  </div>`;

const rows = (list) => `
  <ul class="pc-rows">
    ${list
      .map(
        (r, i) => `
      <li class="pc-row" style="--i:${i}"${r.peek ? ` data-peek="${esc(r.peek)}"` : ''}>
        <span>
          <span class="pc-row__name">${esc(r.name)}</span>
          ${r.note ? `<span class="pc-row__note" lang="en">${esc(r.note)}</span>` : ''}
        </span>
        ${r.price ? `<span class="pc-row__price">${esc(r.price)}</span>` : '<span></span>'}
      </li>`
      )
      .join('')}
  </ul>`;

const dualRows = (list, head) => `
  <div class="pc-rows__head pc-label">${head.map((h) => `<span>${esc(h)}</span>`).join('')}</div>
  <ul class="pc-rows">
    ${list
      .map(
        (r, i) => `
      <li class="pc-row pc-row--dual" style="--i:${i}">
        <span>
          <span class="pc-row__name">${esc(r.name)}</span>
          <span class="pc-row__note" lang="en">${esc(r.note)}</span>
        </span>
        ${r.prices.map((p) => `<span class="pc-row__price">${esc(p)}</span>`).join('')}
      </li>`
      )
      .join('')}
  </ul>`;

const menuBlock = (section) => `
  <div class="pc-menu">
    <div class="pc-menu__head">
      <h3 class="pc-menu__title">${esc(section.title)}</h3>
      ${section.note ? `<p class="pc-label">${esc(section.note)}</p>` : ''}
    </div>
    <div>${rows(section.rows)}</div>
  </div>`;

/* B. cream panel over a photograph */
const sheet = ({ id = '', image, alt, body }) => `
  <section class="pc-sheet"${id ? ` id="${id}"` : ''} data-reveal>
    <img class="pc-sheet__media" src="${esc(image)}" alt="${esc(alt)}" loading="lazy" decoding="async">
    <div class="pc-sheet__panel">${body}</div>
  </section>`;

/* A. photo card with type over it */
const card = ({ id = '', image, alt, priority = false, top = '', bottom, hero = false }) => `
  <section class="pc-card${hero ? ' pc-card--hero' : ''}"${id ? ` id="${id}"` : ''} data-reveal>
    <img class="pc-card__media" src="${esc(image)}" alt="${esc(alt)}"
         ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    <div class="pc-card__scrim"></div>
    <div class="pc-card__inner">
      <div>${top}</div>
      <div class="pc-card__foot">${bottom}</div>
    </div>
  </section>`;

export function render(copy, opts = {}) {
  const { noindex = false, canonical = '' } = opts;

  return `<!doctype html>
<html lang="${esc(copy.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(copy.title)}</title>
<meta name="description" content="${esc(copy.description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<meta name="theme-color" content="#14181B">
<meta property="og:title" content="${esc(copy.title)}">
<meta property="og:description" content="${esc(copy.description)}">
<meta property="og:image" content="${esc(copy.hero.image)}">
<meta property="og:type" content="restaurant.restaurant">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<!-- Safari ignores SVG favicons and falls back to the ORIGIN's icon, which on a
     shared github.io account is somebody else's mark in this client's tab. -->
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="favicon-48.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<link rel="preload" as="font" type="font/woff2" href="fonts/Switzer-Variable.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="fonts/GeistMono-Regular.woff2" crossorigin>
<link rel="stylesheet" href="styles.css">
<link rel="preload" as="script" href="app.js" fetchpriority="high">
<script>document.documentElement.classList.add('is-loading');</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Brass Kitchen & Bar",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Laugavegur 66-68",
    "postalCode": "101",
    "addressLocality": "Reykjavík",
    "addressCountry": "IS"
  },
  "telephone": "+354 519 6566",
  "email": "info@brass.is",
  "servesCuisine": ["Burgers", "Icelandic", "Bar food"],
  "priceRange": "$$",
  "acceptsReservations": "https://www.dineout.is/brass",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "14:00",
    "closes": "22:00"
  }]
}
</script>
</head>
<body>
<a class="pc-skip" href="#main">Beint í efni</a>

<div class="pc-load" data-load role="status" aria-live="polite" aria-label="Hleð">
  <div class="pc-load__inner">
    <span class="pc-load__mark">${LOCKUP}</span>
    <div class="pc-load__meter">
      <span class="pc-load__fill" data-load-fill></span>
    </div>
    <p class="pc-label pc-load__num"><span data-load-num>0</span></p>
  </div>
</div>

<div class="pc-bar" data-bar>
  <a class="pc-bar__mark" href="#main" aria-label="${esc(copy.brand)}">${LOCKUP}</a>
  <nav class="pc-bar__nav" aria-label="Flýtileiðir">
    ${copy.nav.map((i) => `<a class="pc-label" href="${esc(i.href)}">${esc(i.label)}</a>`).join('')}
  </nav>
  <a class="pc-action pc-bar__cta" href="${esc(copy.find.action.href)}" rel="noopener">${esc(copy.find.action.label)}</a>
</div>

<div class="pc-grain" aria-hidden="true"></div>

<main id="main">

${card({
  image: copy.hero.image,
  alt: copy.hero.alt,
  priority: true,
  hero: true,
  top: `${chrome(copy, { nav: true })}<div class="pc-hero__marks">${marks(copy.hero.marksTop)}</div>`,
  bottom: `
    <h1 class="pc-display pc-mass">
      <span class="pc-sr">${esc(copy.brand)} ${esc(copy.descriptor)}. </span>
      ${copy.hero.lines.map((l) => `<span>${esc(l)}</span>`).join('')}
    </h1>
    <div class="pc-hero__row">
      <p class="pc-hero__fact">${esc(copy.hero.fact)}</p>
      <p class="pc-hero__cta">
        <a class="pc-action" href="${esc(copy.find.action.href)}" rel="noopener">${esc(copy.find.action.label)}</a>
        <a class="pc-action pc-action--ghost" href="#matsedill">${esc(copy.hero.secondary)}</a>
      </p>
    </div>`,
})}

  <!-- everything past the hero rides over it on its own opaque ground, so the
       pinned photograph never shows through the gaps between sections -->
  <div class="pc-stack">
  <div class="pc-sentinel" data-sentinel aria-hidden="true"></div>

${sheet({
  id: 'stadurinn',
  image: copy.place.image,
  alt: copy.place.alt,
  body: `
    <h2 class="pc-label pc-sheet__eyebrow">${esc(copy.place.eyebrow)}</h2>
    <p class="pc-display pc-statement">${esc(copy.statement.lead)}</p>
    <p class="pc-body">${esc(copy.statement.body)}</p>
    <div class="pc-hh" data-reveal>
      <div class="pc-hh__head">
        <span class="pc-label">${esc(copy.happyHour.label)}</span>
        <span class="pc-label">${esc(copy.happyHour.note)}</span>
      </div>
      <div class="pc-hh__track">
        <span class="pc-hh__fill"></span>
        <span class="pc-hh__from pc-label">${esc(copy.happyHour.from)}</span>
        <span class="pc-hh__to pc-label">${esc(copy.happyHour.to)}</span>
      </div>
    </div>
    <div class="pc-menu">
      <div class="pc-menu__head"><h3 class="pc-menu__title">opnun</h3></div>
      <div>${rows(copy.statement.facts.map((f) => ({ name: f.term, note: f.en, price: f.detail })))}</div>
    </div>`,
})}


  <!-- THE PINNED COURSE SEQUENCE.
       The stage holds still for three viewports while the courses change in
       place: the titles switch weight, the rows swap, the photograph behind
       crossfades to the dish being read. Driven by one observer on three
       spacer steps, so there is no scroll listener anywhere. -->
  <section class="pc-pin" id="matsedill" data-reveal>
    <div class="pc-pin__stage" data-stage data-active="0">
      ${copy.menu.sections
        .map(
          (sec, i) => `<img class="pc-pin__media" data-media="${i}" src="${esc(sec.image)}"
             alt="${esc(sec.imageAlt)}" loading="lazy" decoding="async">`
        )
        .join('')}
      <div class="pc-pin__scrim"></div>

      <div class="pc-pin__inner">
        <div class="pc-pin__body">
          <div class="pc-pin__nav">
            <p class="pc-label pc-pin__count">
              <span data-count>01</span> / ${String(copy.menu.sections.length).padStart(2, '0')}
            </p>
            <div class="pc-pin__rail" aria-hidden="true"><span class="pc-pin__railfill"></span></div>
            <ol class="pc-pin__titles">
              ${copy.menu.sections
                .map(
                  (sec, i) => `<li class="pc-pin__title" data-title="${i}">
                    <span class="pc-display">${esc(sec.title)}</span>
                    <span class="pc-label">${esc(sec.note || '')}</span>
                  </li>`
                )
                .join('')}
            </ol>
          </div>

          <div class="pc-pin__panels">
            ${copy.menu.sections
              .map(
                (sec, i) => `<div class="pc-pin__panel" data-panel="${i}">
                  <div class="pc-sheet__head">
                    <p class="pc-label">${esc(copy.menu.eyebrow)}</p>
                    <p class="pc-label">${esc(copy.menu.currency)}</p>
                  </div>
                  ${rows(sec.rows)}
                </div>`
              )
              .join('')}
          </div>
        </div>

        <p class="pc-label pc-pin__foot">${esc(copy.menu.footnote)}</p>
      </div>
    </div>

    ${copy.menu.sections.map((_, i) => `<div class="pc-pin__step" data-step="${i}"></div>`).join('')}
    <!-- the stage unpins one viewport before the last step ends, so without this
         tail the final course would get half the dwell the others get -->
    <div class="pc-pin__tail" aria-hidden="true"></div>
  </section>

  <!-- their own line, full bleed, their own amber, their own photograph -->
  <section class="pc-card pc-card--wash" data-reveal>
    <img class="pc-card__media" src="${esc(copy.wash.image)}" alt="${esc(copy.wash.alt)}" loading="lazy" decoding="async">
    <div class="pc-card__scrim"></div>
    <div class="pc-card__inner">
      <div class="pc-chrome">
        ${lockup(copy)}
        <p class="pc-label pc-chrome__mid">${esc(copy.wash.eyebrow)}</p>
        <p class="pc-label pc-chrome__right">${esc(copy.chromeMid)}</p>
      </div>
      <p class="pc-tagline">
        ${copy.wash.lines.map((l) => `<span>${esc(l)}</span>`).join('')}
      </p>
    </div>
  </section>

  <!-- a band of the room, always moving -->
  <section class="pc-strip" aria-labelledby="strip-title" data-reveal>
    <h2 class="pc-sr" id="strip-title">${esc(copy.rail.eyebrow)}</h2>
    <div class="pc-strip__track">
      ${[...copy.rail.items, ...copy.rail.items]
        .map(
          (i, n) => `<figure${n >= copy.rail.items.length ? ' aria-hidden="true"' : ''}>
            <img src="${esc(i.image)}" alt="${n >= copy.rail.items.length ? '' : esc(i.caption)}" loading="lazy" decoding="async">
          </figure>`
        )
        .join('')}
    </div>
  </section>

${sheet({
  id: 'drykkir',
  image: copy.drinks.image,
  alt: copy.drinks.alt,
  body: `
    <div class="pc-sheet__head">
      <h2 class="pc-label pc-sheet__eyebrow">${esc(copy.drinks.eyebrow)}</h2>
      <p class="pc-label">${esc(copy.drinks.currency)}</p>
    </div>
    <div class="pc-menu">
      <div class="pc-menu__head">
        <h3 class="pc-menu__title">${esc(copy.drinks.draught.title)}</h3>
        <p class="pc-label">${esc(copy.drinks.note)}</p>
      </div>
      <div>${dualRows(copy.drinks.draught.rows, copy.drinks.draught.head)}</div>
    </div>
    ${menuBlock(copy.drinks.mixed)}
    ${menuBlock(copy.drinks.coffee)}`,
})}

${card({
  id: 'barusalur',
  image: copy.room.image,
  alt: copy.room.alt,
  top: chrome(copy),
  bottom: `
    <h2 class="pc-display pc-mass pc-mass--sm">${esc(copy.room.lede)}</h2>
    <div class="pc-hero__row">
      <p class="pc-hero__fact">${esc(copy.room.fact)}</p>
      <p class="pc-hero__cta">
        <a class="pc-action" href="${esc(copy.room.action.href)}">${esc(copy.room.action.label)}</a>
      </p>
    </div>`,
})}

${sheet({
  id: 'finna',
  image: copy.find.image,
  alt: copy.find.imageAlt,
  body: `
    <h2 class="pc-label pc-sheet__eyebrow">${esc(copy.find.eyebrow)}</h2>
    <p class="pc-display pc-statement">${esc(copy.find.lede)}</p>
    <div class="pc-menu">
      <div class="pc-menu__head"><h3 class="pc-menu__title">opið</h3></div>
      <div>${rows(copy.find.hours.map((h) => ({ name: h.term, note: h.en, price: h.detail })))}</div>
    </div>
    <div class="pc-menu" id="morgunverdur">
      <div class="pc-menu__head"><h3 class="pc-menu__title">${esc(copy.breakfast.eyebrow)}</h3></div>
      <div>
        <p class="pc-body">${esc(copy.breakfast.body)}</p>
        <p class="pc-sheet__actions">
          <a class="pc-action pc-action--ink" href="${esc(copy.find.action.href)}" rel="noopener">${esc(copy.find.action.label)}</a>
          ${copy.find.contact
            .map((c) => `<a class="pc-action pc-action--inkghost" href="${esc(c.href)}">${esc(c.label)}</a>`)
            .join('')}
        </p>
      </div>
    </div>`,
})}

${card({
  image: copy.voice.image,
  alt: copy.voice.alt,
  top: chrome(copy),
  bottom: `
    <div class="pc-voice">
      <h2 class="pc-display pc-mass pc-mass--sm">${esc(copy.voice.headline)}</h2>
      <div>
        <p class="pc-body">${esc(copy.voice.body)}</p>
        <form class="pc-field" data-signup
              data-msg-ok="${esc(copy.voice.ok)}"
              data-msg-invalid="${esc(copy.voice.invalid)}">
          <label class="pc-label" for="pc-email">${esc(copy.voice.inputLabel)}</label>
          <span class="pc-field__line">
            <input id="pc-email" name="email" type="email" autocomplete="email"
                   placeholder="${esc(copy.voice.placeholder)}" required>
            <button type="submit">${esc(copy.voice.submit)}</button>
          </span>
          <p class="pc-label pc-field__msg" data-signup-msg role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>`,
})}

  </div>
</main>

<footer class="pc-foot">
  <div class="pc-foot__mark">${lockup(copy)}</div>
  <address class="pc-label" style="font-style:normal">
    ${copy.foot.address.map(esc).join('<br>')}
  </address>
  <p class="pc-label">
    ${copy.foot.links.map((l) => `<a href="${esc(l.href)}" rel="noopener">${esc(l.label)}</a>`).join('<br>')}
  </p>
  <p class="pc-label pc-foot__note">
    ${esc(copy.foot.credit)}<br>${esc(copy.foot.legal)}
  </p>
</footer>

<script src="lenis.js" defer></script>
<script src="app.js" defer fetchpriority="high"></script>
</body>
</html>`;
}
