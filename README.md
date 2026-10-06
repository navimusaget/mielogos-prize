# MIELOGOS Literary Prize — static site v0.1

Canonical host: `https://prize.mielogos.org`

This package is deliberately plain static HTML/CSS/JS so it can be hosted on GitHub Pages without WordPress, a CMS, a database or a build service.

## Architecture principle

**2027 is the first record in the website, not the website itself.**

Annual content lives in `data/cycles.json`; public recognition data lives in `data/recognitions.json`; the archive views read those data files automatically. The website templates do not need to be redesigned for a new cycle.

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
