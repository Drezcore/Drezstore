// Datos de productos (puedes editar fácilmente)
const PRODUCTS = [
  { id: 'p001', title: 'Vestido Floral AMARAK', price: 149000, currency: 'COP', category: 'Vestidos', img: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=60', sizes: ['S','M','L'] },
  { id: 'p002', title: 'Blusa Seda AMARAK', price: 89000, currency: 'COP', category: 'Blusas', img: 'https://images.unsplash.com/photo-1520975913333-2a3f3a7b2c7c?auto=format&fit=crop&w=801&q=60', sizes: ['S','M','L'] },
  { id: 'p003', title: 'Pantalón Lino AMARAK', price: 120000, currency: 'COP', category: 'Pantalones', img: 'https://images.unsplash.com/photo-1520975913333-2a3f3a7b2c7c?auto=format&fit=crop&w=802&q=60', sizes: ['30','32','34'] },
  { id: 'p004', title: 'Falda Midi AMARAK', price: 99000, currency: 'COP', category: 'Faldas', img: 'https://images.unsplash.com/photo-1520975913333-2a3f3a7b2c7c?auto=format&fit=crop&w=803&q=60', sizes: ['S','M','L'] }
];

// Estado
let cart = [];

// Helpers DOM
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

function formatCurrency(n){ return 'COP ' + n.toLocaleString('es-CO'); }

function renderProducts(list){
  productsEl.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p class="desc">${p.category}</p>
      <div class="price">${formatCurrency(p.price)}</div>
      <div class="card-actions">
        <button class="btn primary" data-id="${p.id}">Agregar</button>
        <button class="btn outline" data-id="${p.id}" data-detail="true">Ver</button>
      </div>`;
    productsEl.appendChild(card);
  });
  // attach events
  document.querySelectorAll('.btn.primary').forEach(b=> b.addEventListener('click', ()=> addToCart(b.dataset.id)));
  document.querySelectorAll('button[data-detail]').forEach(b=> b.addEventListener('click', (e)=> showDetail(e.target.dataset.id)));
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty += 1; } else { cart.push({ ...p, qty: 1, selectedSize: p.sizes? p.sizes[0] : '' }); }
  updateCartUI();
  toast('Agregado al carrito');
}

function removeFromCart(id){
  cart = cart.filter(i=> i.id !== id);
  updateCartUI();
}

function changeQty(id, delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  updateCartUI();
}

function updateCartUI(){
  cartCountEl.textContent = cart.reduce((s,i)=> s + i.qty, 0);
  cartItemsEl.innerHTML = '';
  cart.forEach(i=>{
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${i.img}" />
      <div style="flex:1">
        <div style="font-weight:700">${i.title}</div>
        <div class="qty">
          <button onclick="changeQty('${i.id}', -1)" class="btn">-</button>
          <span style="padding:0 8px">${i.qty}</span>
          <button onclick="changeQty('${i.id}', 1)" class="btn">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div>${formatCurrency(i.price * i.qty)}</div>
        <button onclick="removeFromCart('${i.id}')" class="btn" style="color:red">Eliminar</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  cartTotalEl.textContent = formatCurrency(cart.reduce((s,i)=> s + i.price * i.qty, 0));
}

function showCart(){ cartEl.classList.remove('hidden'); }
function hideCart(){ cartEl.classList.add('hidden'); }

viewCartBtn.addEventListener('click', showCart);
closeCartBtn.addEventListener('click', hideCart);

document.querySelectorAll('.btn-filter').forEach(b=> b.addEventListener('click', ()=>{
  const cat = b.dataset.category;
  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p=> p.category === cat);
  renderProducts(filtered);
}));

searchEl.addEventListener('input', ()=>{
  const q = searchEl.value.toLowerCase().trim();
  const filtered = PRODUCTS.filter(p=> p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  renderProducts(filtered);
});

function showDetail(id){
  const p = PRODUCTS.find(x=> x.id===id);
  alert(`${p.title}\n\n${p.category}\nPrecio: ${formatCurrency(p.price)}`);
}

function toast(msg){
  // simple toast
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position='fixed';t.style.bottom='20px';t.style.left='50%';t.style.transform='translateX(-50%)';
  t.style.background='#000';t.style.color='#fff';t.style.padding='8px 12px';t.style.borderRadius='8px';t.style.zIndex=1000;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(),1500);
}

// Whatsapp checkout
whatsappBtn.addEventListener('click', ()=>{
  const name = customerNameEl.value.trim();
  const phone = customerPhoneEl.value.trim();
  if(!name || !phone){ alert('Por favor ingresa tu nombre y teléfono'); return; }
  if(cart.length === 0){ alert('Tu carrito está vacío'); return; }
  const itemsText = cart.map(i=> `${i.qty} x ${i.title} (${i.selectedSize || ''}) - COP ${i.price.toLocaleString()}`).join('%0A');
  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0).toLocaleString();
  const message = `Hola, soy ${encodeURIComponent(name)}%0AMe interesa el pedido:%0A${itemsText}%0ATotal: COP ${total}%0AMi teléfono: ${encodeURIComponent(phone)}%0A¿Cómo coordinamos el pago y envío?`;
  // Número de la tienda: reemplaza con tu número (sin + ni 00), ejemplo 573001234567
  const shopNumber = '573507692564';
  const url = `https://wa.me/${shopNumber}?text=${message}`;
  window.open(url, '_blank');
});

// Init
renderProducts(PRODUCTS);
updateCartUI();
