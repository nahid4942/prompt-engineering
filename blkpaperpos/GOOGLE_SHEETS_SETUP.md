BLKPAPER POS - Google Sheets setup

1) Open Google Drive and go to https://script.google.com/ and create a new project.
2) Paste the contents of `google-apps-script.js` (from this repository) into the script editor (Code.gs) and save.
3) Run the function `setupBLKPAPERPOS` once from the editor (select the function and click Run). This will create a new spreadsheet in your Drive named 'BLKPAPER_POS_Data' and create 'Products' and 'Orders' sheets with headers.
4) Deploy the script as a Web App:
   - Click Deploy → New deployment → Select type: Web app
   - Description: "BLKPAPER POS Web API"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Deploy and copy the Web App URL.
5) In `blkpaperpos/index.html`, open the file and replace the placeholder value at top:
   const GOOGLE_SHEETS_CONFIG = { scriptURL: "REPLACE_WITH_YOUR_APPS_SCRIPT_WEBAPP_URL" };
   with the Web App URL you copied.
6) Optional: Use the built-in `seedProducts` action to upload a sample product list from the browser console:
   - Open the site in browser after step 5.
   - In console: window.BLKPAPERPOS.adminSeedProducts([{id:'p1',name:'T-Shirt',category:'Tops',price:450,stock:20,image:''}, ...]);

Notes:
- The Web App must be deployed with access "Anyone, even anonymous" (or "Anyone" depending on your G Suite settings) to allow public POST/GET requests from the browser.
- For production, consider restricting access and using a server-side proxy or OAuth.
- The script stores a single spreadsheet in script properties. If you re-run setup it will create a new spreadsheet and store its id.
