// AMARAK - script.js completo (catálogo + carrusel por prenda + carrito + WhatsApp)
// Número de la tienda (sin +): 573507692564
const shopNumber = '573507692564';

const PRODUCTS = [
  {
    id: 'AMA01',
    title: 'Conjunto Safari',
    price: 110000,
    currency: 'COP',
    category: 'Conjuntos',
    img: [
      'https://drive.google.com/uc?export=view&id=12Yu6in3qXoZjSQHPZfV0N7ytiH6uiMpe',
      'https://drive.google.com/uc?export=view&id=1FyIcmCYGJMGYfG3wNPNs4IiV_0Cruwhs',
      'https://drive.google.com/uc?export=view&id=15zdbLzv-mptp4NqAnj6TetOh282esA4m',
      'https://drive.google.com/uc?export=view&id=1P95bT0oYu26gEeIWumxPXThwDuc--0lH',
      'https://drive.google.com/uc?export=view&id=1XwAwrzlKG2rHdkcwLHma3nl9WDM2SzDC'
    ],
    sizes: ['S-M','L-XL','Plus'],
    sku: 'AMK-001',
    stock: 20
  },
  {
    id: 'AMA02',
    title: 'Conjunto Amirah',
    price: 100000,
    currency: 'COP',
    category: 'Conjuntos',
    img: [
      'https://drive.google.com/uc?export=view&id=1fnX9U5V-B6B-W_C-6Vxq6Nckblw3e27H',
      'https://drive.google.com/uc?export=view&id=1ZlRIfHpsR_BJsgZZzWkSUVt6Gwve6MEF',
      'https://drive.google.com/uc?export=view&id=1zyz-UOSjtD8qFuTri4pRddu41rLTRvMo'
    ],
    sizes: ['S-M','L-XL'],
    sku: 'AMK-002',
    stock: 20
  },
  {
    id: 'AMA03',
    title: 'Conjunto Paris',
    price: 100000,
    currency: 'COP',
    category: 'Conjuntos',
    img: [
      'https://drive.google.com/uc?export=view&id=1IVbQ98RyHKjGfJVSm3yEfj9QLi9MQhDr',
      'https://drive.google.com/uc?export=view&id=12U3I7DotV5GPUHBInRwbl36oRiaQrVyp',
      'https://drive.google.com/uc?export=view&id=1tZ9B7DElYu3EYBbuaQaBwgRMC6qTjGsC',
      'https://drive.google.com/uc?export=view&id=1AP8ISzsdwo_jOjzcjZrwzXVNlGhizbqI',
      'https://drive.google.com/uc?export=view&id=1lxVs1ZXSgLSfa8mar1hSPaoS-3mwXAX5'
    ],
    sizes: ['Talla Única'],
    sku: 'AMK-003',
    stock: 20
  },
  {
    id: 'AMA04',
    title: 'Pantalón Carpier',
    price: 100000,
    currency: 'COP',
    category: 'Pantalones',
    img: [
      'https://drive.google.com/uc?export=view&id=1c8N7XbTtxclqPbxe9DWs_dVi6kqPFcM1',
      'https://drive.google.com/uc?export=view&id=10-Gcb8IFwRQGE70508p1vaHBl2UGUbO3',
      'https://drive.google.com/uc?export=view&id=1cHWxGSSmSphuDOHN0XkFLyNJsRRrJWNa',
      'https://drive.google.com/uc?export=view&id=1vaWuTdPfgaZXtWWH7tyNXNvcXT1L2t0h',
      'https://drive.google.com/uc?export=view&id=1W25YVdPu2nLkEvVndcfM_xKvN5YJ8d-H'
    ],
    sizes: ['S-M','L-XL'],
    sku: 'AMK-004',
    stock: 20
  }
];

// Estado
let cart = [];

// Referencias DOM (asegúrate que tu index.html tiene estos IDs)
const productsEl = document.getElementById('products');
const searchEl = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');
const cartEl = document.getElementById('cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const viewCartBtn = document.getElementById('view-cart');
const closeCartBtn = document.getElementById('close-cart');
const whatsappBtn = document.getElementById('whatsapp-pay');
const customerNameEl = document.getElementById('customer-name');
const customerPhoneEl = document.getElementById('customer-phone');

// Helper
function formatCurrency(n){ return 'COP ' + n.toLocaleString('es-CO'); }

// Renderiza listado de productos (usa la primera imagen del array como miniatura)
function renderProducts(list){
  if(!productsEl) return console.warn('Elemento #products no encontrado');
  productsEl.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    const thumb = Array.isArray(p.img) ? p.img[0] : (p.img || '');
    card.innerHTML = `
      <img src="${thumb}" alt="${escapeHtml(p.title)}" />
      <h3>${escapeHtml(p.title)}</h3>
      <p class="desc">${escapeHtml(p.category)}</p>
      <div class="price">${formatCurrency(p.price)}</div>
      <div class="card-actions">
        <button class="btn primary add-btn" data-id="${p.id}">Agregar</button>
        <button class="btn outline view-btn" data-id="${p.id}">Ver</button>
      </div>`;
    productsEl.appendChild(card);
  });

  // listeners
  document.querySelectorAll('.add-btn').forEach(b=> b.addEventListener('click', e=> {
    const id = e.currentTarget.dataset.id;
    const product = PRODUCTS.find(x=>x.id===id);
    // si tiene tallas, agrega con talla por defecto (primera)
    const size = product.sizes && product.sizes.length ? product.sizes[0] : '';
    addToCartWithSize(id, size);
  }));
  document.querySelectorAll('.view-btn').forEach(b=> b.addEventListener('click', e=>{
    const id = e.currentTarget.dataset.id;
    showDetail(id);
  }));
}

// Agregar al carrito (con control por talla)
function addToCartWithSize(id, selectedSize){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  // buscar entry por id + talla
  const exists = cart.find(i=> i.id===id && i.selectedSize === selectedSize);
  if(exists){
    exists.qty += 1;
  } else {
    cart.push({
      id: p.id,
      title: p.title,
      price: p.price,
      currency: p.currency,
      selectedSize: selectedSize || (p.sizes && p.sizes[0]) || '',
      qty: 1,
      img: Array.isArray(p.img) ? p.img[0] : p.img
    });
  }
  updateCartUI();
  toast('Agregado al carrito');
}

// Remover item (por id+talla)
function removeFromCart(uniqueIndex){
  // uniqueIndex will be numeric index in cart array (we use index in rendering)
  cart.splice(uniqueIndex,1);
  updateCartUI();
}

// Cambiar cantidad (por index)
function changeQty(index, delta){
  if(!cart[index]) return;
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  updateCartUI();
}

function updateCartUI(){
  if(!cartCountEl || !cartItemsEl || !cartTotalEl) return;
  cartCountEl.textContent = cart.reduce((s,i)=> s + i.qty, 0);
  cartItemsEl.innerHTML = '';
  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" />
      <div style="flex:1">
        <div style="font-weight:700">${escapeHtml(item.title)}</div>
        <div style="font-size:13px;color:#666">Talla: ${escapeHtml(item.selectedSize)}</div>
        <div class="qty" style="margin-top:8px">
          <button class="btn qty-minus" data-idx="${idx}">-</button>
          <span style="padding:0 8px">${item.qty}</span>
          <button class="btn qty-plus" data-idx="${idx}">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div>${formatCurrency(item.price * item.qty)}</div>
        <button class="btn remove-btn" data-idx="${idx}" style="color:red">Eliminar</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  // attach qty/remove listeners
  document.querySelectorAll('.qty-minus').forEach(b=> b.addEventListener('click', e=>{
    changeQty(Number(e.currentTarget.dataset.idx), -1);
  }));
  document.querySelectorAll('.qty-plus').forEach(b=> b.addEventListener('click', e=>{
    changeQty(Number(e.currentTarget.dataset.idx), +1);
  }));
  document.querySelectorAll('.remove-btn').forEach(b=> b.addEventListener('click', e=>{
    removeFromCart(Number(e.currentTarget.dataset.idx));
  }));

  cartTotalEl.textContent = formatCurrency(cart.reduce((s,i)=> s + i.price * i.qty, 0));
}

// Mostrar / ocultar carrito
function showCart(){ if(cartEl) cartEl.classList.remove('hidden'); }
function hideCart(){ if(cartEl) cartEl.classList.add('hidden'); }

if(viewCartBtn) viewCartBtn.addEventListener('click', showCart);
if(closeCartBtn) closeCartBtn.addEventListener('click', hideCart);

// Búsqueda y filtros
document.querySelectorAll('.btn-filter').forEach(b=> b.addEventListener('click', ()=>{
  const cat = b.dataset.category;
  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p=> p.category === cat);
  renderProducts(filtered);
}));

if(searchEl) searchEl.addEventListener('input', ()=>{
  const q = searchEl.value.toLowerCase().trim();
  const filtered = PRODUCTS.filter(p=> p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  renderProducts(filtered);
});

// Mostrar detalle con carrusel (modal dinámico)
function showDetail(id){
  const p = PRODUCTS.find(x=> x.id===id);
  if(!p) return;
  // modal wrapper
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.left = 0; overlay.style.top = 0; overlay.style.right = 0; overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.zIndex = 9999;
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  // modal box
  const box = document.createElement('div');
  box.style.width = '92%';
  box.style.maxWidth = '720px';
  box.style.background = '#fff';
  box.style.borderRadius = '12px';
  box.style.padding = '16px';
  box.style.position = 'relative';
  // carousel elements
  let idx = 0;
  const images = Array.isArray(p.img) ? p.img : [p.img || ''];
  const imgEl = document.createElement('img');
  imgEl.src = images[idx];
  imgEl.style.width = '100%';
  imgEl.style.height = '360px';
  imgEl.style.objectFit = 'cover';
  imgEl.style.borderRadius = '8px';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.style.position = 'absolute';
  prevBtn.style.left = '12px';
  prevBtn.style.top = '50%';
  prevBtn.style.transform = 'translateY(-50%)';
  prevBtn.style.padding = '8px 10px';
  prevBtn.style.borderRadius = '6px';
  prevBtn.style.border = '0';
  prevBtn.style.background = 'rgba(255,255,255,0.9)';

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.style.position = 'absolute';
  nextBtn.style.right = '12px';
  nextBtn.style.top = '50%';
  nextBtn.style.transform = 'translateY(-50%)';
  nextBtn.style.padding = '8px 10px';
  nextBtn.style.borderRadius = '6px';
  nextBtn.style.border = '0';
  nextBtn.style.background = 'rgba(255,255,255,0.9)';

  prevBtn.addEventListener('click', ()=> {
    idx = (idx - 1 + images.length) % images.length;
    imgEl.src = images[idx];
  });
  nextBtn.addEventListener('click', ()=> {
    idx = (idx + 1) % images.length;
    imgEl.src = images[idx];
  });

  // Title, price, sizes
  const title = document.createElement('h3');
  title.textContent = p.title;
  title.style.marginTop = '12px';
  const price = document.createElement('div');
  price.textContent = formatCurrency(p.price);
  price.style.fontWeight = '700';
  price.style.marginTop = '6px';
  const sizesWrap = document.createElement('div');
  sizesWrap.style.marginTop = '8px';
  if(p.sizes && p.sizes.length){
    const select = document.createElement('select');
    select.style.padding = '8px';
    p.sizes.forEach(s => {
      const o = document.createElement('option');
      o.value = s;
      o.textContent = s;
      select.appendChild(o);
    });
    sizesWrap.appendChild(document.createTextNode('Talla: '));
    sizesWrap.appendChild(select);
    // add button uses select.value
    var selectedSizeSelect = select;
  } else {
    sizesWrap.textContent = '';
    var selectedSizeSelect = null;
  }

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Agregar al carrito';
  addBtn.className = 'btn primary';
  addBtn.style.marginTop = '12px';
  addBtn.addEventListener('click', ()=>{
    const sel = selectedSizeSelect ? selectedSizeSelect.value : (p.sizes && p.sizes[0]) || '';
    addToCartWithSize(p.id, sel);
    document.body.removeChild(overlay);
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Cerrar';
  closeBtn.className = 'btn secondary';
  closeBtn.style.marginTop = '8px';
  closeBtn.addEventListener('click', ()=> document.body.removeChild(overlay));

  // append
  box.appendChild(imgEl);
  box.appendChild(prevBtn);
  box.appendChild(nextBtn);
  box.appendChild(title);
  box.appendChild(price);
  box.appendChild(sizesWrap);
  box.appendChild(addBtn);
  box.appendChild(closeBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// Simple toast
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position='fixed';t.style.bottom='20px';t.style.left='50%';t.style.transform='translateX(-50%)';
  t.style.background='#000';t.style.color='#fff';t.style.padding='8px 12px';t.style.borderRadius='8px';t.style.zIndex=10000;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(),1500);
}

// Escape HTML (básico)
function escapeHtml(text){
  if(!text) return '';
  return text.replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[m]; });
}

// WhatsApp checkout
if(whatsappBtn){
  whatsappBtn.addEventListener('click', ()=>{
    const name = customerNameEl ? customerNameEl.value.trim() : '';
    const phone = customerPhoneEl ? customerPhoneEl.value.trim() : '';
    if(!name || !phone){ alert('Por favor ingresa tu nombre y teléfono'); return; }
    if(cart.length === 0){ alert('Tu carrito está vacío'); return; }
    const itemsText = cart.map(i=> `${i.qty} x ${i.title} ${i.selectedSize ? '('+i.selectedSize+')' : ''} - COP ${i.price.toLocaleString()}`).join('%0A');
    const total = cart.reduce((s,i)=> s + i.price * i.qty, 0).toLocaleString();
    const message = `Hola, soy ${encodeURIComponent(name)}%0AMe interesa el pedido:%0A${itemsText}%0ATotal: COP ${total}%0AMi teléfono: ${encodeURIComponent(phone)}%0A¿Cómo coordinamos el pago y envío?`;
    const url = `https://wa.me/${shopNumber}?text=${message}`;
    window.open(url, '_blank');
  });
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts(PRODUCTS);
  updateCartUI();
});
