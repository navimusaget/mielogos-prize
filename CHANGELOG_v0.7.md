# MIELOGOS Literary Prize — v0.7 audit-fix release

Date: 7 October 2026

## Public-site fixes

- Common initialization is now idempotent, eliminating duplicate mobile-navigation bindings on pages such as `/enter/`.
- Mobile navigation adds `aria-controls`, Escape-to-close and deterministic current-page state.
- Public implementation/staging copy on the Enter page is replaced with entrant-facing language.
- Works and Authors archive rendering now escapes untrusted text.
- Verify Recognition now exposes an accessible live status region.
- Focus visibility, reduced-motion behavior, target scroll offset and small-text gold contrast are hardened.
- Canonical and Open Graph / social metadata are supplied dynamically across the static site; the new Positioning page also carries static metadata.
- 404 pages receive `noindex,follow` at runtime.

## Archive / future-cycle fixes

- Recognition records may now preserve cumulative history (Longlist → Shortlist → Winner) under one public record.
- Longlist, Shortlist and Winner archive views test recognition history rather than only a single mutable status.
- Year-page dates are read from `data/cycles.json` rather than hard-coded 2027 strings.
- The future-cycle scaffolder no longer carries Founding-Cycle wording forward by default.

## Research & positioning

- Added `/positioning/`.
- Added a homepage Research & Positioning block.
- Public language is limited to the supportable formulation:
  “To our knowledge, MIELOGOS is the first literary prize dedicated specifically to works qualifying under a formal definition of symbiotic authorship.”
- Research cut-off displayed publicly: 7 October 2026.
- The page expressly states that the claim is qualified, evidence-open and not constitutive of MIELOGOS identity.
