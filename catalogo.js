// ============================================================
//  GlamBaddie.co — Catálogo de Productos
//  Añade nuevos productos aquí sin tocar el HTML.
// ============================================================

const PRODUCTOS = [
  { id:2,  nombre:"Hybrid Kitten Green",  categoria:"lentes",     precio:35000, descripcion:"Lente de contacto verde con matices amarillos, efecto natural y vibrante.",                                                     especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"lente-hybrid-kitten-green.jpeg", nuevo:false },
  { id:3,  nombre:"Millennial Spice",     categoria:"lentes",     precio:35000, descripcion:"Lente de contacto gris con efecto moderno y elegante.",                                                                          especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"lente-millennial-spice.jpeg",    nuevo:false },
  { id:4,  nombre:"Sugar Strike",         categoria:"lentes",     precio:35000, descripcion:"Lente de contacto marrón claro con efecto cálido.",                                                                              especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"lente-sugar-strike.jpeg",        nuevo:false },
  { id:6,  nombre:"Tiffany",              categoria:"lentes",     precio:35000, descripcion:"Lente de contacto azul con matices amarillos.",                                                                                  especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"lente-tiffany.jpeg",             nuevo:false },
  { id:7,  nombre:"Blackspot Blue",       categoria:"lentes",     precio:35000, descripcion:"Azul profundo con efecto elegante.",                                                                                             especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"blackspot-blue.jpg",             nuevo:true  },
  { id:8,  nombre:"Mermaid Green",        categoria:"lentes",     precio:35000, descripcion:"Verde vibrante con degradado oscuro.",                                                                                           especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"mermaid-gree.jpg",               nuevo:true  },
  { id:9,  nombre:"Pattaya Green",        categoria:"lentes",     precio:35000, descripcion:"Verde intenso que ilumina la mirada.",                                                                                           especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"pattaya-green.jpg",              nuevo:true  },
  { id:10, nombre:"Agua Multipropósito 120ml", categoria:"accesorios", precio:16000, descripcion:"Ideal para limpiar, desinfectar y conservar tus lentes.",                                                                  especificaciones:["120ml","Multipropósito","Lentes blandos"],            img:"75866.jpg",                      nuevo:true  },
  { id:11, nombre:"Pola Green",           categoria:"lentes",     precio:35000, descripcion:"Lente de contacto verde natural con acabado suave y luminoso. Ideal para un look fresco y vibrante.",                           especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"pola-green.jpeg",                nuevo:true  },
  { id:12, nombre:"Mood Brown",           categoria:"lentes",     precio:35000, descripcion:"Lente de contacto marrón intenso con aro oscuro. Efecto profundo y natural para una mirada irresistible.",                     especificaciones:["DIA: 14.2mm","B.C: 8.6mm","Agua: 38%","6 meses"],   img:"mood-brown.jpeg",                nuevo:true  },
  { id:13, nombre:"Russian Grey",         categoria:"lentes",     precio:35000, descripcion:"Lente de contacto gris azulado con matices verdes. Efecto místico y elegante para una mirada única e irresistible.",           especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"Russian-Grey.jpg",               nuevo:true  },
  { id:14, nombre:"OMG Gray",             categoria:"lentes",     precio:35000, descripcion:"Lente de contacto gris natural con aro oscuro pronunciado. Diseño EYESHARE que amplía y profundiza la mirada.",               especificaciones:["DIA: 14.0mm","Agua: 38%"],                            img:"OMG-Gray.jpg",                   nuevo:true  },
  { id:15, nombre:"Makabaka Purple",      categoria:"lentes",     precio:35000, descripcion:"Lente de contacto lila con efecto degradado suave. Tono púrpura romántico que transforma la mirada con estilo.",               especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"],              img:"Makabaka-Purple.jpg",            nuevo:true  },
];

// ============================================================
//  Estado de la app
// ============================================================
let cart         = [];
let currentCat   = "todos";
let searchTerm   = "";
let sortOrder    = "default";
let renderScheduled = false;

// ============================================================
//  Helpers
// ============================================================
function normalizeImg(src) {
  if (!src) return 'https://placehold.co/400x300?text=Glambaddie.co';
  return src.trim();
}

function getQty(id) {
  const i = cart.find(x => x.id === id);
  return i ? i.cantidad : 0;
}

function getFiltered() {
  let prods = PRODUCTOS.filter(p => {
    const matchCat    = currentCat === "todos" || p.categoria === currentCat || (currentCat === "nuevos" && p.nuevo);
    const matchSearch = !searchTerm || p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });
  if (sortOrder === "price-asc")  prods.sort((a,b) => a.precio - b.precio);
  else if (sortOrder === "price-desc") prods.sort((a,b) => b.precio - a.precio);
  else if (sortOrder === "name")  prods.sort((a,b) => a.nombre.localeCompare(b.nombre));
  return prods;
}

// ============================================================
//  Renderizado de tarjetas
// ============================================================
function renderCardList(prods, gridEl) {
  if (prods.length === 0) {
    gridEl.innerHTML = `<div class="empty-state"><div class="empty-emoji">😢</div><h2>Sin resultados</h2><p>Intenta con otro filtro</p></div>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  prods.forEach(p => {
    const qty      = getQty(p.id);
    const img      = normalizeImg(p.img);
    const catLabel = p.categoria === 'lentes' ? 'LENTE DE CONTACTO' : 'ACCESORIO';
    const card     = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', p.id);
    card.setAttribute('onclick', `openModal(${p.id})`);
    card.innerHTML = `
      <div class="card-img-wrap">
        <img class="card-img"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231a0835'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23ffffff80' font-size='14'%3EGlambaddie.co%3C/text%3E%3C/svg%3E"
          data-src="${img}" alt="${p.nombre}" loading="lazy">
        ${p.nuevo ? '<span class="card-badge badge-new">🎁 Nuevo</span>' : ''}
        <div class="card-fav" onclick="event.stopPropagation();this.classList.toggle('active');this.innerText=this.classList.contains('active')?'❤️':'♡'">♡</div>
      </div>
      <div class="card-body">
        <div class="card-tag">${p.nuevo ? '🎁 NUEVO · ' : ''}${catLabel}</div>
        <h3>${p.nombre}</h3>
        <p class="card-desc">${p.descripcion.substring(0,60)}...</p>
        <div class="card-bottom">
          <div class="price-row"><span class="price">$${p.precio.toLocaleString()} COP</span></div>
          ${qty === 0
            ? `<button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">➕ Agregar</button>`
            : `<div class="qty-selector">
                 <button class="qty-btn" onclick="event.stopPropagation();updateQty(${p.id},-1)">−</button>
                 <span class="qty-display">${qty}</span>
                 <button class="qty-btn" onclick="event.stopPropagation();updateQty(${p.id},1)">+</button>
               </div>`}
        </div>
      </div>`;
    fragment.appendChild(card);
  });
  gridEl.innerHTML = '';
  gridEl.appendChild(fragment);

  // Lazy-load de imágenes
  const images   = gridEl.querySelectorAll('.card-img');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.target.dataset.src) {
        e.target.src = e.target.dataset.src;
        delete e.target.dataset.src;
        observer.unobserve(e.target);
      }
    });
  });
  images.forEach(img => observer.observe(img));
}

function renderProducts() {
  const lentes     = getFiltered().filter(p => p.categoria === 'lentes');
  const accesorios = getFiltered().filter(p => p.categoria === 'accesorios');
  renderCardList(lentes,     document.getElementById('gridLentes'));
  renderCardList(accesorios, document.getElementById('gridAccesorios'));
  document.getElementById('countLentes').innerText     = lentes.length     + ' producto' + (lentes.length     !== 1 ? 's' : '');
  document.getElementById('countAccesorios').innerText = accesorios.length + ' producto' + (accesorios.length !== 1 ? 's' : '');
}

function scheduleRender() {
  if (!renderScheduled) {
    renderScheduled = true;
    requestAnimationFrame(() => { renderProducts(); renderScheduled = false; });
  }
}

// ============================================================
//  Carrito
// ============================================================
function addToCart(id) {
  const ex = cart.find(x => x.id === id);
  ex ? ex.cantidad++ : cart.push({ id, cantidad: 1 });
  updateCartUI(); scheduleRender(); saveCart();
}

function updateQty(id, delta) {
  const idx = cart.findIndex(x => x.id === id);
  if (idx === -1) return;
  const nq = cart[idx].cantidad + delta;
  nq <= 0 ? cart.splice(idx, 1) : cart[idx].cantidad = nq;
  updateCartUI(); scheduleRender(); saveCart();
}

function removeFromCart(id) { cart = cart.filter(x => x.id !== id); updateCartUI(); scheduleRender(); saveCart(); }
function clearCart()        { cart = []; updateCartUI(); scheduleRender(); saveCart(); }
function saveCart()         { localStorage.setItem('glambaddie_cart', JSON.stringify(cart)); }
function loadCart()         { const s = localStorage.getItem('glambaddie_cart'); if (s) { cart = JSON.parse(s); updateCartUI(); } }

function updateCartUI() {
  const total = cart.reduce((s,i) => {
    const p = PRODUCTOS.find(x => x.id === i.id);
    return s + (p ? p.precio * i.cantidad : 0);
  }, 0);
  const count = cart.reduce((s,i) => s + i.cantidad, 0);

  document.getElementById('cartBadge').innerText   = count;
  document.getElementById('sidebarTotal').innerHTML = '$' + total.toLocaleString() + ' COP';

  const itemsEl = document.getElementById('sidebarCartItems');
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty-msg">Tu carrito está vacío 🥺</p>';
  } else {
    itemsEl.innerHTML = cart.map(i => {
      const p = PRODUCTOS.find(x => x.id === i.id);
      if (!p) return '';
      return `<div class="cart-item-row">
        <button class="cart-remove-btn" onclick="removeFromCart(${p.id})">✕</button>
        <span class="cart-item-name">${p.nombre} x${i.cantidad}</span>
        <span class="cart-item-subtotal">$${(p.precio * i.cantidad).toLocaleString()}</span>
      </div>`;
    }).join('');
    itemsEl.innerHTML += `<button class="cart-clear-btn" onclick="clearCart()">🗑️ Vaciar carrito</button>`;
  }

  const msg = cart.map(i => {
    const p = PRODUCTOS.find(x => x.id === i.id);
    return p ? `${p.nombre} x${i.cantidad} ($${(p.precio*i.cantidad).toLocaleString()})` : '';
  }).filter(Boolean).join('%0A');
  document.getElementById('waCheckoutBtn').href =
    `https://wa.me/573189653717?text=Hola%20Glambaddie.co!%20Quiero%20pedir:%0A${msg}%0ATotal:%20$${total.toLocaleString()}%20COP`;
}

// ============================================================
//  Modal de producto
// ============================================================
function openModal(id) {
  const p = PRODUCTOS.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalImg').src         = normalizeImg(p.img);
  document.getElementById('modalTag').innerText   = (p.categoria === 'lentes' ? 'LENTE DE CONTACTO' : 'ACCESORIO') + (p.nuevo ? ' · NUEVO' : '');
  document.getElementById('modalTitle').innerText = p.nombre;
  document.getElementById('modalDesc').innerText  = p.descripcion;
  document.getElementById('modalSpecs').innerHTML = p.especificaciones.map(s => `<span class="spec-pill">${s}</span>`).join('');
  document.getElementById('modalPrice').innerHTML = '$' + p.precio.toLocaleString() + ' COP';
  document.getElementById('modalWaBtn').href      =
    `https://wa.me/573189653717?text=Hola%20Glambaddie.co!%20Me%20interesa%20${encodeURIComponent(p.nombre)}%20($${p.precio.toLocaleString()}%20COP)`;
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
//  Sidebar
// ============================================================
function openSidebar()  {
  document.getElementById('sidebar').classList.add('active');
  document.getElementById('overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
//  Util
// ============================================================
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ============================================================
//  Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderProducts();

  document.getElementById('menuBtn').onclick      = openSidebar;
  document.getElementById('cartIconBtn').onclick  = openSidebar;
  document.getElementById('closeBtn').onclick     = closeSidebar;
  document.getElementById('overlay').onclick      = closeSidebar;
  document.getElementById('modalClose').onclick   = closeModal;
  document.getElementById('modalOverlay').onclick = (e) => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  };

  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      scheduleRender();
    };
  });

  document.querySelectorAll('.sidebar-nav a[data-cat], .footer-links a[data-cat]').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      currentCat = link.dataset.cat;
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      const active = document.querySelector(`.cat-pill[data-cat="${currentCat}"]`);
      if (active) active.classList.add('active');
      scheduleRender();
      closeSidebar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });

  document.getElementById('searchInput').addEventListener('input',
    debounce((e) => { searchTerm = e.target.value; scheduleRender(); }, 300)
  );
});

// Exports globales para los onclick del HTML
window.openModal      = openModal;
window.addToCart      = addToCart;
window.updateQty      = updateQty;
window.removeFromCart = removeFromCart;
window.clearCart      = clearCart;
window.closeModal     = closeModal;
