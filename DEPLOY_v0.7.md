# MIELOGOS v0.7 deployment notes

This is an **overlay staging package** for the existing `navimusaget/mielogos-prize` repository.

Upload `MIELOGOS_Prize_GitHub_Staging_v0.7.zip` to the repository root and run the existing **Bootstrap MIELOGOS Prize site** GitHub Action. The workflow already selects the newest `MIELOGOS_Prize_GitHub_Staging_v*.zip`, unpacks it over the repository, removes staging ZIPs, commits and pushes.

No existing images, canonical DOCX files, DNS files or private data are replaced by this package.

After deployment, verify:
1. homepage shows the Research & Positioning block before Partners & Supporters;
2. `/positioning/` opens;
3. `/enter/` no longer exposes `data/cycles.json` implementation copy;
4. hamburger opens and closes once per tap;
5. `/verify/` still works with an empty register;
6. mobile recognition and Symbiotic Authorship images remain unchanged;
7. GitHub Pages stays on `prize.mielogos.org`.
