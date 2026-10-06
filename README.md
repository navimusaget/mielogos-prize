# MIELOGOS Literary Prize — static site v0.6

Canonical host: `https://prize.mielogos.org`

This package is deliberately plain static HTML/CSS/JS so it can be hosted on GitHub Pages without WordPress, a CMS, a database or a build service.

## Architecture principle

**2027 is the first record in the website, not the website itself.**

Annual content lives in `data/cycles.json`; public recognition data lives in `data/recognitions.json`; the archive views read those data files automatically. The website templates do not need to be redesigned for a new cycle.


## Visual identity roles

The public identity uses three distinct levels:

- **Core glyph** — compact neutral mark for favicon and small digital surfaces.
- **Primary Prize Seal** — neutral ceremonial emblem for the Prize itself; used in the homepage hero and institutional contexts. It contains **MIELOGOS / LITERARY PRIZE** and never implies that a Winner has already been selected.
- **Winner Medal** — recognition mark reserved for actual Winner status.

Official descriptor: **A literary prize for Symbiotic Authorship.**

Do not place “first in the world” or equivalent priority claims inside the permanent seal. Any historical priority claim must remain separate prose and should be used only after independent verification.

## Live submission button

The header `ENTER` button is permanent and always routes to `/enter/`.

The real `START SUBMISSION` button on `/enter/` is wired to the current cycle object in `data/cycles.json`:

- before opening: disabled, shows the opening date;
- during the window: active **only if** `submission_url` contains the tested official submission endpoint;
- after closing: disabled, shows that the cycle is closed.

Before 1 February 2027, insert the tested Google Apps Script submission URL into the 2027 `submission_url` field. Do not use a personal Gmail or unverified sender for official Prize correspondence.

## Add a future Prize Year

1. Add the new year object to `data/cycles.json` and set exactly one cycle to `"current": true`.
2. Run `python tools/add_cycle.py 2028` (replace year as needed).
3. Add Longlist / Shortlist / Winner public records to `data/recognitions.json` as they are announced.

`/prize-years/`, `/winners/`, `/shortlists/`, `/longlists/` and `/verify/` update from those datasets without redesign.

## Public vs private boundary

This repository contains **no** applicant records, manuscript files, eligibility evidence, private judging material, provider secrets or internal strategic documents. Keep the submission backend, Google Drive folder IDs, private Sheets and internal workflows outside the public repository.

## Canonical documents

The exact locked public DOCX files copied from the canonical corpus are under `documents/downloads/`. Do not edit those files in place. A substantive governance change requires a new canonical version and corpus review.

## Deploy

Use the repository root as the GitHub Pages publishing source. `CNAME` is already set to `prize.mielogos.org`. Configure the `prize` DNS record to the actual GitHub Pages hostname for the repository, then enforce HTTPS once DNS validates.

`mielogos.com` should be handled separately as a redirect to `https://prize.mielogos.org/` rather than as the canonical host.


## Homepage hero imagery

The homepage uses an evergreen aspirational recognition scene rather than a documentary image of an actual laureate. The scene intentionally shows a fictional winning title to demonstrate how MIELOGOS recognition can live on a book. Cycle dates and live status remain HTML/data-driven and are not embedded in the image.

Responsive assets:

- `assets/img/mielogos-prize-hero-desktop.jpg` — landscape desktop hero.
- `assets/img/mielogos-prize-hero-mobile.jpg` — portrait mobile hero.

## Editorial illustration system

Approved public illustrations are integrated into the relevant explanatory pages:

- recognition progression → `/prize/`
- certificate + Public Recognition Record → `/verify/`
- AI Literary Assessment → `/ai-literary-assessment/`
- Symbiotic Authorship → `/symbiotic-authorship/`

The Recognition progression and Symbiotic Authorship pages use responsive desktop/mobile image pairs. On phones, the approved portrait artwork is shown in full rather than forcing horizontal scrolling.

The images are conceptual explanatory visuals. Fictional works, names and provisional IDs shown inside them are not public Prize records.

## Partners & Supporters

The homepage and `/partners/` contain a permanent partnership area. Before the first external partner is listed, it functions as an open invitation rather than an empty sponsor block.

Partner listings are data-driven from `data/partners.json`. To add a confirmed public partner:

1. place its approved logo under `assets/img/partners/`;
2. add an object with `name`, `type`, optional `url`, and optional `logo` to `data/partners.json`;
3. use one of the role types already defined there, or add a new role only if the relationship actually requires it.

Do not publish a logo before the relationship and permission to display it are confirmed. Partner support does not confer influence over eligibility, literary assessment or recognition decisions.
