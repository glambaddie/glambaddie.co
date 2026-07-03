// ============================================================
//  GlamBaddie.co — Catálogo de Productos
//  Añade nuevos productos aquí sin tocar el HTML.
// ============================================================

// PRODUCTOS ahora vive en productos.js (cargado antes que este archivo en el HTML)
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
    const mediaHtml = `<img class="card-img"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231a0835'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23ffffff80' font-size='14'%3EGlambaddie.co%3C/text%3E%3C/svg%3E"
          data-src="${img}" alt="${p.nombre}" loading="lazy">`;
    card.innerHTML = `
      <div class="card-img-wrap">
        ${mediaHtml}
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

  // El botón del carrito ahora lleva a checkout.html (ver index.html),
  // que lee el carrito desde localStorage y arma el resumen del pedido,
  // el cálculo de envío y el pago por Nequi.
}

// ============================================================
//  Modal de producto
// ============================================================
function openModal(id) {
  const p = PRODUCTOS.find(x => x.id === id);
  if (!p) return;

  const modalImg   = document.getElementById('modalImg');
  const modalVideo = document.getElementById('modalVideo');

  if (p.video) {
    modalImg.style.display = 'none';
    if (modalVideo) {
      modalVideo.src           = p.video;
      modalVideo.style.display = 'block';
      modalVideo.play().catch(() => {});
    }
  } else {
    if (modalVideo) { modalVideo.pause(); modalVideo.style.display = 'none'; modalVideo.src = ''; }
    modalImg.style.display = '';
    modalImg.src           = normalizeImg(p.img);
  }

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
  const modalVideo = document.getElementById('modalVideo');
  if (modalVideo) modalVideo.pause();
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
