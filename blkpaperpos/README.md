BLKPAPER POS (cloud-backed)

This folder contains a simple cloud POS web app that uses Google Sheets via Google Apps Script as the backend.

Files:
- index.html - POS frontend UI
- styles.css - basic styling
- script.js - frontend logic: fetch products, manage cart, submit orders, retry queue
- google-apps-script.js - Apps Script (server) that provides endpoints to GET products and POST orders
- GOOGLE_SHEETS_SETUP.md - step-by-step deployment and linking instructions

Quick start:
1) Deploy the Apps Script web app following `GOOGLE_SHEETS_SETUP.md`.
2) Update `blkpaperpos/index.html` replacing `REPLACE_WITH_YOUR_APPS_SCRIPT_WEBAPP_URL` with your web app URL.
3) Serve the site (open `blkpaperpos/index.html` in a browser or run a local static server) and test.

Notes and next steps:
- This is a basic example intended to be productionized. Consider adding authentication, inventory updates, and secure server endpoints before using in production.
- The Apps Script stores a single spreadsheet id in script properties after running `setupBLKPAPERPOS()`.
