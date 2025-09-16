const products = [
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
    price: 95000,
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

function renderProducts(category = 'all') {
  const catalogo = document.getElementById('catalogo');
  catalogo.innerHTML = '';

  const filtered = category === 'all' ? products : products.filter(p => p.category === category);

  filtered.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';

    div.innerHTML = `
      <div class="carousel">
        <img src="${p.img[0]}" alt="${p.title}" id="img-${p.id}">
      </div>
      <h3>${p.title}</h3>
      <p><strong>${p.price.toLocaleString()} ${p.currency}</strong></p>
      <p>Tallas: ${p.sizes.join(', ')}</p>
      <button onclick="orderWhatsApp('${p.title}', ${p.price})">Comprar</button>
    `;

    catalogo.appendChild(div);
  });
}

function filterCategory(cat) {
  renderProducts(cat);
}

function orderWhatsApp(product, price) {
  const phone = '573507692564';
  const url = `https://wa.me/${phone}?text=Hola,%20quiero%20comprar%20${product}%20por%20${price.toLocaleString()}%20COP`;
  window.open(url, '_blank');
}

renderProducts();
