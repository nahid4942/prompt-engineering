/*
Google Apps Script for BLKPAPER POS
- doGet?action=getProducts  -> returns JSON list of products from 'Products' sheet
- doPost with {action:'appendOrder', order: {...}} -> appends order to 'Orders' sheet

Setup: run setupBLKPAPERPOS() once in Apps Script editor to create the spreadsheet and sheet headers.
After deploying as a web app (Anyone, even anonymous) copy the web app URL into the frontend `GOOGLE_SHEETS_CONFIG.scriptURL`.
*/

const PROPS = PropertiesService.getScriptProperties();
const SPREADSHEET_KEY = 'BLKPAPER_POS_SPREADSHEET_ID';

function setupBLKPAPERPOS(){
  // Create a new spreadsheet and sheets if not present
  const ss = SpreadsheetApp.create('BLKPAPER_POS_Data');
  const id = ss.getId();
  PROPS.setProperty(SPREADSHEET_KEY, id);
  // Products sheet
  let prod = ss.getSheetByName('Products');
  if(!prod) prod = ss.insertSheet('Products');
  prod.clear();
  prod.appendRow(['id','name','category','price','stock','image']);
  // Orders sheet
  let ord = ss.getSheetByName('Orders');
  if(!ord) ord = ss.insertSheet('Orders');
  ord.clear();
  // Add customer fields and stockChangesJson column to record stock before/after per item
  ord.appendRow(['orderId','createdAt','cashier','payment','customerName','customerPhone','customerAddress','itemsJson','subtotal','tax','total','stockChangesJson']);
  return {status:'ok',spreadsheetId:id, url:ss.getUrl()};
}

function getSpreadsheet(){
  const id = PROPS.getProperty(SPREADSHEET_KEY);
  if(!id) throw new Error('Spreadsheet not configured. Run setupBLKPAPERPOS()');
  return SpreadsheetApp.openById(id);
}

function doGet(e){
  const action = (e.parameter && e.parameter.action) || '';
  if(action==='getProducts'){
    try{
      const ss = getSpreadsheet();
      const sheet = ss.getSheetByName('Products');
      if(!sheet) return ContentService.createTextOutput(JSON.stringify({products:[]})).setMimeType(ContentService.MimeType.JSON);
      const values = sheet.getDataRange().getValues();
      const headers = values.shift();
      const products = values.map(r=>{
        const obj = {};
        headers.forEach((h,i)=> obj[h]=r[i]);
        // convert numeric fields
        obj.price = Number(obj.price) || 0;
        obj.stock = Number(obj.stock) || 0;
        return obj;
      });
      return ContentService.createTextOutput(JSON.stringify({products})).setMimeType(ContentService.MimeType.JSON);
    }catch(err){
      return ContentService.createTextOutput(JSON.stringify({error:err.message,products:[]})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  if(action==='info'){
    try{
      const info = getSpreadsheetInfo();
      return ContentService.createTextOutput(JSON.stringify(info)).setMimeType(ContentService.MimeType.JSON);
    }catch(err){
      return ContentService.createTextOutput(JSON.stringify({status:'error',message:err.message})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try{
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = body.action || '';
    if(action==='appendOrder'){
      const order = body.order;
      // log incoming order payload for diagnostics (visible in Executions)
      try{ Logger.log('appendOrder payload: %s', JSON.stringify(order)); }catch(e){}
      const ss = getSpreadsheet();
      const sheet = ss.getSheetByName('Orders');
      if(!sheet) throw new Error('Orders sheet missing - run setupBLKPAPERPOS()');
      // Append order row and decrement product stocks in Products sheet
      try{
        // Prepare stockChanges array by reading Products sheet (if available)
        let stockChanges = [];
        try{
          const pSheet = ss.getSheetByName('Products');
          if(pSheet){
            const range = pSheet.getDataRange();
            const values = range.getValues();
            const headers = values[0] || [];
            // case-insensitive header search
            const lowerHeaders = headers.map(h=>String(h||'').toLowerCase());
            const idCol = lowerHeaders.indexOf('id');
            const stockCol = lowerHeaders.indexOf('stock');
            if(idCol >= 0 && stockCol >= 0){
              const idToRow = {};
              for(let r=1;r<values.length;r++){
                const rowId = String(values[r][idCol] || '');
                if(rowId) idToRow[rowId] = r+1; // sheet row number
              }
              order.items = order.items || [];
              order.items.forEach(it =>{
                const pid = String(it.id || it.productId || '');
                const qty = Number(it.qty || it.quantity || 0);
                if(!pid || qty<=0) return;
                const rowNum = idToRow[pid];
                if(!rowNum) return;
                const cell = pSheet.getRange(rowNum, stockCol+1);
                const cur = Number(cell.getValue()) || 0;
                const next = Math.max(0, cur - qty);
                cell.setValue(next);
                stockChanges.push({id:pid,old:cur,new:next,qtyTaken:qty,row:rowNum});
              });
            }
          }
        }catch(e){
          Logger.log('Stock computation/update failed: %s', e.message);
        }

  // Append order row including customer details and stockChangesJson for audit
  const customer = order.customer || {};
  sheet.appendRow([order.id, order.createdAt, order.cashier, order.payment, customer.name||'', customer.phone||'', customer.address||'', JSON.stringify(order.items), order.subtotal, order.tax, order.total, JSON.stringify(stockChanges)]);
        if(stockChanges.length) Logger.log('Stock updates: %s', JSON.stringify(stockChanges));
        return ContentService.createTextOutput(JSON.stringify({status:'ok',stockChanges:stockChanges.length})).setMimeType(ContentService.MimeType.JSON);
      }catch(err){
        Logger.log('appendOrder appendRow error: %s', err.message);
        return ContentService.createTextOutput(JSON.stringify({status:'error',message:err.message})).setMimeType(ContentService.MimeType.JSON);
      }
    }
    if(action==='seedProducts'){
      const products = body.products || [];
      const ss = getSpreadsheet();
      const sheet = ss.getSheetByName('Products');
      if(!sheet) throw new Error('Products sheet missing - run setupBLKPAPERPOS()');
      // append rows
      const rows = products.map(p=>[p.id,p.name,p.category,p.price,p.stock,p.image||'']);
      if(rows.length) sheet.getRange(sheet.getLastRow()+1,1,rows.length,rows[0].length).setValues(rows);
      return ContentService.createTextOutput(JSON.stringify({status:'ok',inserted:rows.length})).setMimeType(ContentService.MimeType.JSON);
    }
    if(action==='createProduct'){
      const product = body.product || {};
      const ss = getSpreadsheet();
      const sheet = ss.getSheetByName('Products');
      if(!sheet) throw new Error('Products sheet missing - run setupBLKPAPERPOS()');
      sheet.appendRow([product.id||'', product.name||'', product.category||'', product.price||0, product.stock||0, product.image||'']);
      return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({status:'unknown-action'})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({status:'error',message:err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

// helper: return spreadsheet info
function getSpreadsheetInfo(){
  const id = PROPS.getProperty(SPREADSHEET_KEY) || '';
  if(!id) return {configured:false};
  const ss = SpreadsheetApp.openById(id);
  return {configured:true,id:id,url:ss.getUrl(),sheets:ss.getSheets().map(s=>s.getName())};
}

// helper to reset stored spreadsheet id (careful)
function resetBLKPAPERPOS(){ PROPS.deleteProperty(SPREADSHEET_KEY); return {status:'ok'}; }
