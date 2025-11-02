// Run this from the browser console on the POS page (after you set GOOGLE_SHEETS_CONFIG.scriptURL and the page has loaded)
// It fetches sample-products.csv from the same folder and calls the admin seeding helper window.BLKPAPERPOS.adminSeedProducts(products)

async function seedProductsFromCSV(csvPath='sample-products.csv'){
  try{
    const res = await fetch(csvPath);
    if(!res.ok) throw new Error('Failed to fetch CSV: '+res.status);
    const text = await res.text();
    const lines = text.trim().split('\n');
    const headers = lines.shift().split(',').map(h=>h.trim());
    const products = lines.map(line=>{
      const cols = line.split(',').map(c=>c.trim());
      const obj = {};
      headers.forEach((h,i)=> obj[h]=cols[i]||'');
      obj.price = Number(obj.price||0);
      obj.stock = Number(obj.stock||0);
      return obj;
    });
    console.log('Parsed',products.length,'products. Sample:',products[0]);
    if(!window.BLKPAPERPOS || !window.BLKPAPERPOS.adminSeedProducts) throw new Error('BLKPAPERPOS.adminSeedProducts not available - open the POS page and ensure script loaded');
    // Confirm with user then call
    if(confirm('Seed '+products.length+' products into Products sheet?')){
      await window.BLKPAPERPOS.adminSeedProducts(products);
      console.log('Seed request sent. Click Refresh in POS UI to load products.');
    }
  }catch(err){ console.error(err); alert('Failed: '+err.message); }
}

// Usage (paste into console on the POS page):
// seedProductsFromCSV('sample-products.csv');

// You can also call seedProductsFromCSV with a remote URL that returns the same CSV format.
