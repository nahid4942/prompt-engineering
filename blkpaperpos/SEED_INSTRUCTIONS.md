Seeding sample products into BLKPAPER POS

Files added:
- `sample-products.csv` — 50 sample product rows (headers: id,name,category,price,stock,image)
- `seed-products.js` — small helper to run from the browser console and call the frontend admin seeder

Steps to seed products
1) Deploy the Google Apps Script web app and update `blkpaperpos/index.html` `GOOGLE_SHEETS_CONFIG.scriptURL` as described in `GOOGLE_SHEETS_SETUP.md`.
2) Serve the POS folder and open the POS page in your browser (so `window.BLKPAPERPOS` is available). Example using a local static server from the repo root (Powershell):

   npx http-server .\blkpaperpos -p 8081
   # then open http://localhost:8081

3) On the POS page, open the developer console (F12) and paste the contents of `seed-products.js` (or include that file in the page temporarily). Then run:

   seedProductsFromCSV('sample-products.csv');

   Confirm the prompt. The script will parse `sample-products.csv` and call the Apps Script `seedProducts` action via the frontend helper `adminSeedProducts`.

4) After the seed completes, click the `Refresh` button in the POS UI to load newly inserted products.

Notes and troubleshooting
- Ensure `sample-products.csv` is accessible from the path you provide (if you serve the site at `/`, the path `sample-products.csv` works because it's in the same directory).
- Product images in the CSV are relative paths to the main repo `blkpaper` images; if you don't have those files, the UI will show placeholder images.
- If the Apps Script POST fails due to permissions, check your Web App deployment settings (must allow access) and verify `GOOGLE_SHEETS_CONFIG.scriptURL` is correct.
- The seeder uses the existing `adminSeedProducts` frontend helper; it doesn't bypass Apps Script security.
