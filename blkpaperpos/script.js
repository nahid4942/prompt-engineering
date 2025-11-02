// BLKPAPER POS frontend logic
// Requirements: set GOOGLE_SHEETS_CONFIG.scriptURL in index.html after deploying Apps Script web app

const STORAGE_KEYS = {
  cart: 'blkpaperpos_cart',
  recentOrders: 'blkpaperpos_recent_orders',
  retryQueue: 'blkpaperpos_retry_queue'
};

let PRODUCTS = [];
let CART = {};
let recentOrders = [];

const elements = {};

function qs(id){return document.getElementById(id)}

function init(){
  elements.productGrid = qs('productGrid');
  elements.categoryFilter = qs('categoryFilter');
  elements.search = qs('search');
  elements.cartItems = qs('cartItems');
  elements.subtotal = qs('subtotal');
  elements.tax = qs('tax');
  elements.total = qs('total');
  elements.checkoutBtn = qs('checkoutBtn');
  elements.cashier = qs('cashier');
  elements.paymentMethod = qs('paymentMethod');
  elements.recentOrders = qs('recentOrders');

  qs('refreshBtn').addEventListener('click', loadProducts);
  qs('addProductBtn').addEventListener('click', openAddProductModal);
  const testBtn = qs('testApiBtn'); if(testBtn) testBtn.addEventListener('click', testApiEndpoint);
  qs('clearFilters').addEventListener('click', ()=>{elements.categoryFilter.value=''; renderProducts();});
  elements.search.addEventListener('input', debounce(()=>renderProducts(),200));
  elements.checkoutBtn.addEventListener('click', onCheckout);
  qs('printLast').addEventListener('click', printLastReceipt);

  loadCartFromStorage();
  loadRecentFromStorage();
  processRetryQueue();
  loadProducts();
}

/* Add Product UI handlers */
function openAddProductModal(){
  document.getElementById('addProductModal').classList.remove('hidden');
}
function closeAddProductModal(){
  document.getElementById('addProductModal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', ()=>{
  // wire modal buttons
  const saveBtn = document.getElementById('saveProductBtn');
  const cancelBtn = document.getElementById('cancelProductBtn');
  if(saveBtn) saveBtn.addEventListener('click', onSaveNewProduct);
  if(cancelBtn) cancelBtn.addEventListener('click', closeAddProductModal);
});

async function onSaveNewProduct(){
  const id = (document.getElementById('newProdId').value||'').trim();
  const name = (document.getElementById('newProdName').value||'').trim();
  const category = (document.getElementById('newProdCategory').value||'').trim();
  const price = Number(document.getElementById('newProdPrice').value||0);
  const stock = Number(document.getElementById('newProdStock').value||0);
  const image = (document.getElementById('newProdImage').value||'').trim();
  if(!id || !name){ return alert('Please provide at least Product ID and Name'); }
  const product = {id,name,category,price,stock,image};
  try{
  const resp = await fetch(GOOGLE_SHEETS_CONFIG.scriptURL, {method:'POST', headers:{'Content-Type':'text/plain; charset=utf-8'}, body:JSON.stringify({action:'createProduct',product})});
    const j = await resp.json();
    if(j && j.status==='ok'){
      alert('Product added');
      closeAddProductModal();
      // refresh products
      loadProducts();
    } else {
      console.error('createProduct failed',j);
      alert('Failed to add product. See console.');
    }
  }catch(err){ console.error(err); alert('Failed to add product: '+err.message); }
}

function loadProducts(){
  const url = GOOGLE_SHEETS_CONFIG.scriptURL + '?action=getProducts';
  fetch(url).then(r=>r.json()).then(data=>{
    PRODUCTS = data.products || [];
    populateCategoryFilter();
    renderProducts();
  }).catch(err=>{
    console.error('Failed to load products from cloud',err);
    // fallback: try local products if any
    PRODUCTS = getLocalProductsFallback();
    populateCategoryFilter();
    renderProducts();
  });
}

function getLocalProductsFallback(){
  // minimal demo fallback
  return [
    {id:'p1',name:'Black T-shirt',category:'Tops',price:450.00,stock:25,image:'../blkpaper/pic/tshirt/1.jpg'},
    {id:'p2',name:'Saree - Classic',category:'Saree',price:3200.00,stock:8,image:'../blkpaper/pic/saree/1.jpg'}
  ];
}

function populateCategoryFilter(){
  const cats = Array.from(new Set(PRODUCTS.map(p=>p.category).filter(Boolean)));
  elements.categoryFilter.innerHTML = '<option value="">All</option>' + cats.map(c=>`<option>${c}</option>`).join('');
  elements.categoryFilter.addEventListener('change', renderProducts);
}

function renderProducts(){
  const q = elements.search.value.trim().toLowerCase();
  const cat = elements.categoryFilter.value;
  const filtered = PRODUCTS.filter(p=>{
    if(cat && p.category !== cat) return false;
    if(!q) return true;
    return p.name.toLowerCase().includes(q) || (p.id && p.id.toLowerCase().includes(q));
  });
  elements.productGrid.innerHTML = '';
  const tpl = document.getElementById('productCard');
  filtered.forEach(p=>{
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector('.card');
    card.querySelector('.card-img').src = p.image || 'placeholder.png';
    card.querySelector('.card-title').textContent = p.name;
    card.querySelector('.card-price').textContent = formatMoney(p.price);
    card.querySelector('.card-stock').textContent = p.stock ? ('Stock: '+p.stock) : '';
    const addBtn = node.querySelector('.addBtn');
    addBtn.addEventListener('click', ()=>addToCart(p.id,1));
    elements.productGrid.appendChild(node);
  });
}

function addToCart(productId, qty=1){
  const product = PRODUCTS.find(p=>p.id===productId);
  if(!product) return alert('Product not found');
  const current = CART[productId] || {product:product, qty:0};
  current.qty += qty;
  CART[productId] = current;
  saveCartToStorage();
  renderCart();
}

function updateCartQty(productId, qty){
  if(qty<=0){ delete CART[productId]; }
  else CART[productId].qty = qty;
  saveCartToStorage();
  renderCart();
}

function renderCart(){
  elements.cartItems.innerHTML = '';
  let subtotal = 0;
  Object.values(CART).forEach(item=>{
    const div = document.createElement('div');
    div.className = 'cart-item';
    const left = document.createElement('div');
    left.innerHTML = `<strong>${item.product.name}</strong><div class="cart-controls">Qty: <input type="number" min="0" value="${item.qty}" data-id="${item.product.id}" class="qtyinput" style="width:60px"></div>`;
    const right = document.createElement('div');
    right.innerHTML = `<div>${formatMoney(item.product.price * item.qty)}</div><button data-id="${item.product.id}" class="removeBtn">Remove</button>`;
    div.appendChild(left); div.appendChild(right);
    elements.cartItems.appendChild(div);

    subtotal += item.product.price * item.qty;
  });
  elements.subtotal.textContent = formatMoney(subtotal);
  const tax = subtotal * 0.05;
  elements.tax.textContent = formatMoney(tax);
  elements.total.textContent = formatMoney(subtotal + tax);

  // attach events
  Array.from(document.getElementsByClassName('qtyinput')).forEach(inp=>{
    inp.addEventListener('change', (e)=>{
      const id = e.target.dataset.id; const v = parseInt(e.target.value||0,10);
      updateCartQty(id, v);
    });
  });
  Array.from(document.getElementsByClassName('removeBtn')).forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = e.target.dataset.id; updateCartQty(id,0);
    });
  });
}

function onCheckout(){
  if(Object.keys(CART).length===0) return alert('Cart is empty');
  const cashier = elements.cashier.value || 'Unknown';
  const payment = elements.paymentMethod.value;
  const order = buildOrder(cashier, payment);
  sendOrder(order).then(res=>{
    if(res && res.status==='ok'){
      recordRecentOrder(order);
      CART = {};
      saveCartToStorage();
      renderCart();
      alert('Sale recorded');
      // refresh products to reflect updated stock
      loadProducts();
      printReceipt(order);
    } else {
      // if cloud failed, queue
      saveOrderToRetryQueue(order);
      recordRecentOrder(order);
      CART = {}; saveCartToStorage(); renderCart();
      alert('Sale saved locally and will retry in background');
    }
  });
}

function buildOrder(cashier, payment){
  const customerName = document.getElementById('customerName')?.value || '';
  const customerPhone = document.getElementById('customerPhone')?.value || '';
  const customerAddress = document.getElementById('customerAddress')?.value || '';

  const items = Object.values(CART).map(it=>({id:it.product.id,name:it.product.name,qty:it.qty,price:it.product.price,amount:it.qty*it.product.price}));
  const subtotal = Object.values(CART).reduce((s,it)=>s + it.qty*it.product.price,0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const now = new Date();
  return {
    id: 'ORD-'+now.getTime(),
    createdAt: now.toISOString(),
    cashier, payment, customer: { name: customerName, phone: customerPhone, address: customerAddress }, items, subtotal, tax, total
  };
}

async function sendOrder(order){
  try{
    const resp = await fetch(GOOGLE_SHEETS_CONFIG.scriptURL, {
      method:'POST', headers:{'Content-Type':'text/plain; charset=utf-8'}, body:JSON.stringify({action:'appendOrder',order})
    });
    const text = await resp.text();
    let json;
    try{ json = JSON.parse(text); }catch(e){ json = {status:'error',raw:text}; }
    if(!resp.ok) console.error('sendOrder HTTP error',resp.status, text);
    console.log('sendOrder response', resp.status, json);
    return json;
  }catch(err){
    console.error('sendOrder failed',err);
    return null;
  }
}

function saveOrderToRetryQueue(order){
  const q = JSON.parse(localStorage.getItem(STORAGE_KEYS.retryQueue)||'[]');
  q.push(order);
  localStorage.setItem(STORAGE_KEYS.retryQueue, JSON.stringify(q));
}

function processRetryQueue(){
  const q = JSON.parse(localStorage.getItem(STORAGE_KEYS.retryQueue)||'[]');
  if(!q.length) return;
  (async ()=>{
    for(const o of q.slice()){
      try{
        const res = await sendOrder(o);
        if(res && res.status==='ok'){
          // remove from queue
          const cur = JSON.parse(localStorage.getItem(STORAGE_KEYS.retryQueue)||'[]');
          const idx = cur.findIndex(x=>x.id===o.id);
          if(idx>-1){ cur.splice(idx,1); localStorage.setItem(STORAGE_KEYS.retryQueue, JSON.stringify(cur)); }
        }
      }catch(e){console.warn('retry failed for',o.id)}
    }
  })();
}

function recordRecentOrder(order){
  recentOrders.unshift(order);
  recentOrders = recentOrders.slice(0,10);
  localStorage.setItem(STORAGE_KEYS.recentOrders, JSON.stringify(recentOrders));
  renderRecentOrders();
}

function loadRecentFromStorage(){
  recentOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.recentOrders)||'[]');
  renderRecentOrders();
}

function renderRecentOrders(){
  elements.recentOrders.innerHTML = '';
  recentOrders.forEach(o=>{
    const li = document.createElement('li');
    li.textContent = `${o.id} • ${o.cashier} • ${formatMoney(o.total)} • ${new Date(o.createdAt).toLocaleString()}`;
    elements.recentOrders.appendChild(li);
  });
}

function saveCartToStorage(){ localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(CART)); }
function loadCartFromStorage(){ CART = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)||'{}'); renderCart(); }

function formatMoney(n){ return (Number(n)||0).toFixed(2); }

function escapeHtml(str){ if(!str && str!==0) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

function printReceipt(order){
  const w = window.open('','_blank','width=420,height=700');
  // build items rows
  const rows = (order.items || []).map(i => `
      <tr>
        <td class="qty">${i.qty}</td>
        <td class="name">${i.name}</td>
        <td class="price">${formatMoney(i.price)}</td>
        <td class="amount">${formatMoney(i.amount)}</td>
      </tr>
  `).join('');

  const html = `
  <html>
  <head>
    <title>Receipt ${order.id}</title>
    <meta charset="utf-8" />
    <style>
      :root{font-family: Inter, Roboto, Arial, sans-serif;color:#111}
      body{margin:0;padding:18px;width:320px}
      .store{display:flex;align-items:center;gap:12px}
      .logo{height:44px}
      h1{font-size:18px;margin:6px 0}
      .meta{font-size:12px;color:#555;margin-bottom:8px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th{font-size:12px;text-align:left;padding:6px 0;color:#333}
      td{padding:6px 0}
      td.qty{width:36px;text-align:left}
      td.name{padding-left:6px}
      td.price, td.amount{text-align:right;width:72px}
      .totals{margin-top:8px;border-top:1px dashed #ddd;padding-top:8px}
      .totals div{display:flex;justify-content:space-between;padding:4px 0;font-weight:600}
      .small{font-size:11px;color:#666}
      .center{text-align:center}
      .thankyou{margin-top:12px;text-align:center;font-weight:700}
      @media print{body{width:320px;margin:0} .no-print{display:none}}
    </style>
  </head>
  <body>
    <div class="store">
      <img src="102.png" class="logo" alt="BLKPAPER">
      <div>
        <h1>BLKPAPER</h1>
        <div class="small">Modern fashion & lifestyle</div>
      </div>
    </div>
    <div class="meta">
      <div>Order: ${order.id}</div>
      <div>Date: ${new Date(order.createdAt).toLocaleString()}</div>
      <div>Cashier: ${order.cashier}</div>
      <div>Payment: ${order.payment}</div>
      ${order.customer && order.customer.name ? `<div>Customer: ${escapeHtml(order.customer.name)}</div>` : ''}
      ${order.customer && order.customer.phone ? `<div>Phone: ${escapeHtml(order.customer.phone)}</div>` : ''}
      ${order.customer && order.customer.address ? `<div>Address: ${escapeHtml(order.customer.address)}</div>` : ''}
    </div>

    <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px">
      <div style="flex:0 0 120px">
        <img src="https://chart.googleapis.com/chart?cht=qr&chs=160x160&chl=${encodeURIComponent(order.id)}&chld=L|1" alt="QR" style="width:100%;height:auto;border:0" />
      </div>
      <div class="small">Scan this QR to view order details<br><strong>Order ID:</strong> ${order.id}</div>
    </div>

    <table>
      <thead>
        <tr><th class="qty">Qty</th><th class="name">Item</th><th class="price">Price</th><th class="amount">Amount</th></tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals">
      <div><span>Subtotal</span><span>${formatMoney(order.subtotal)}</span></div>
      <div><span>Tax</span><span>${formatMoney(order.tax)}</span></div>
      <div style="font-size:16px"><span>Total</span><span>${formatMoney(order.total)}</span></div>
    </div>

    <div class="thankyou">Thank you for shopping with BLKPAPER</div>
    <div class="center small">www.blkpaper.example | +880 1XX-XXX-XXXX</div>

    <script>
      window.onload = function(){
        setTimeout(function(){ window.print(); }, 250);
      };
    </script>
  </body>
  </html>`;

  w.document.write(html);
  w.document.close();
}

function printLastReceipt(){ if(!recentOrders.length) return alert('No recent order'); printReceipt(recentOrders[0]); }

function saveRecentToStorage(){ localStorage.setItem(STORAGE_KEYS.recentOrders, JSON.stringify(recentOrders)); }

// small utils
function debounce(fn, wait){let t; return function(){clearTimeout(t); t=setTimeout(()=>fn.apply(this,arguments),wait);};}

// admin helper to seed products into cloud (must be used after deploying Apps Script and setting scriptURL)
async function adminSeedProducts(sampleProducts){
  if(!confirm('Seed products into Cloud Products sheet?')) return;
  try{
    const resp = await fetch(GOOGLE_SHEETS_CONFIG.scriptURL, {method:'POST', headers:{'Content-Type':'text/plain; charset=utf-8'}, body:JSON.stringify({action:'seedProducts',products:sampleProducts})});
    const text = await resp.text(); let j; try{ j = JSON.parse(text);}catch(e){ j={status:'error',raw:text}; }
    console.log('seed result',resp.status,j);
    if(j.status==='ok') loadProducts();
    else alert('Seed failed — check console for response');
  }catch(err){ console.error('Seed failed',err); alert('Seed failed - see console'); }
}

// Diagnostic: test API endpoint (GET products + POST a small test order)
async function testApiEndpoint(){
  try{
    const getUrl = GOOGLE_SHEETS_CONFIG.scriptURL + '?action=getProducts';
    const g = await fetch(getUrl);
    const gtext = await g.text();
    let gjson; try{ gjson = JSON.parse(gtext);}catch(e){ gjson = {error:'invalid-json',raw:gtext}; }
    console.log('GET products status', g.status, gjson);

    const testOrder = {id:'TEST-'+Date.now(), createdAt:new Date().toISOString(), cashier:'tester', payment:'cash', items:[], subtotal:0, tax:0, total:0};
    const p = await fetch(GOOGLE_SHEETS_CONFIG.scriptURL, {method:'POST', headers:{'Content-Type':'text/plain; charset=utf-8'}, body:JSON.stringify({action:'appendOrder',order:testOrder})});
    const ptext = await p.text(); let pjson; try{ pjson = JSON.parse(ptext);}catch(e){ pjson={error:'invalid-json',raw:ptext}; }
    console.log('POST appendOrder status', p.status, pjson);
    alert('GET status: '+g.status+'; POST status: '+p.status+' — see console for details');
  }catch(err){ console.error('testApiEndpoint failed',err); alert('API test failed — see console'); }
}

// init
window.addEventListener('DOMContentLoaded', init);

// Expose for console
window.BLKPAPERPOS = {addToCart, adminSeedProducts, sendOrder};
