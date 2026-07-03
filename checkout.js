// ============================================================
//  GlamBaddie.co — Lógica de Checkout
//  Lee el carrito guardado por catalogo.js (localStorage) y arma:
//   1) Resumen del pedido
//   2) Formulario de entrega (ciudad, dirección, teléfono...)
//   3) Cálculo de envío vía Inter Rapidísimo (gratis en Bosa)
//   4) Pago por Nequi (QR)
// ============================================================

const WHATSAPP_NUMBER = "573189653717"; // mismo número que usa el resto del sitio

// ------------------------------------------------------------
//  Tarifas de envío (Inter Rapidísimo, ya incluyen el seguro)
//  Ajusta estos valores o las listas de departamentos según
//  cambien las tarifas reales de la transportadora.
// ------------------------------------------------------------
const TARIFAS = {
  local:        8800,   // Bogotá (fuera de Bosa)
  regional:     12500,  // Cundinamarca, Boyacá, Meta, Tolima...
  metropolitano:18500,  // Capitales / áreas metropolitanas grandes
  municipal:    20900,  // Resto de municipios del país
};
const RECARGO_PRO = 5000; // Entrega programada por franja horaria (Bogotá/Soacha)

// Localidades de Bogotá D.C. — Bosa tiene envío gratis
const LOCALIDADES_BOGOTA = [
  "Bosa", "Kennedy", "Usaquén", "Suba", "Chapinero", "Engativá",
  "Fontibón", "Bosa (Terminal)", "Ciudad Bolívar", "San Cristóbal",
  "Rafael Uribe Uribe", "Tunjuelito", "Puente Aranda", "Barrios Unidos",
  "Teusaquillo", "Los Mártires", "Antonio Nariño", "Santa Fe", "Candelaria",
  "Usme", "Sumapaz",
];

// Departamentos cercanos a Bogotá => tarifa "Regional"
const DEPTOS_REGIONAL = ["Cundinamarca", "Boyacá", "Meta", "Tolima"];

// Departamentos con ciudades capitales grandes => "Nacional Metropolitano"
const DEPTOS_METROPOLITANO = [
  "Antioquia", "Valle del Cauca", "Atlántico", "Santander", "Bolívar",
  "Risaralda", "Caldas", "Quindío", "Norte de Santander", "Huila",
  "Nariño", "Cesar", "Magdalena", "Cauca",
];

// El resto de departamentos => "Nacional Municipal"
const TODOS_LOS_DEPARTAMENTOS = [
  "Bogotá D.C.", "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar",
  "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó",
  "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira",
  "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo",
  "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre",
  "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
];

let cart = [];
let shippingCost = 0;
let proExtra = 0;

// ------------------------------------------------------------
//  Carrito (mismo storage que catalogo.js)
// ------------------------------------------------------------
function loadCart() {
  const s = localStorage.getItem('glambaddie_cart');
  cart = s ? JSON.parse(s) : [];
}

function getCartTotal() {
  return cart.reduce((sum, i) => {
    const p = PRODUCTOS.find(x => x.id === i.id);
    return sum + (p ? p.precio * i.cantidad : 0);
  }, 0);
}

function renderOrderSummary() {
  const wrap = document.getElementById('summaryItems');
  const emptyMsg = document.getElementById('emptyCartMsg');

  if (cart.length === 0) {
    wrap.innerHTML = '';
    emptyMsg.style.display = 'block';
    document.getElementById('checkoutForm').style.display = 'none';
    updateTotals();
    return;
  }
  emptyMsg.style.display = 'none';
  document.getElementById('checkoutForm').style.display = '';

  wrap.innerHTML = cart.map(i => {
    const p = PRODUCTOS.find(x => x.id === i.id);
    if (!p) return '';
    const img = p.img ? p.img.trim() : '';
    return `
      <div class="summary-item">
        <div class="summary-item-imgwrap">
          <img class="summary-item-img" src="${img}" alt="${p.nombre}" loading="lazy">
          <span class="summary-item-qty">${i.cantidad}</span>
        </div>
        <div class="summary-item-info">
          <div class="summary-item-name">${p.nombre}</div>
          <div class="summary-item-cat">${p.categoria === 'lentes' ? 'Lente de contacto' : 'Accesorio'}</div>
        </div>
        <div class="summary-item-price">$${(p.precio * i.cantidad).toLocaleString()}</div>
      </div>`;
  }).join('');
}

// ------------------------------------------------------------
//  Cálculo de envío
// ------------------------------------------------------------
function poblarDepartamentos() {
  const sel = document.getElementById('departamento');
  sel.innerHTML = '<option value="" disabled selected>Selecciona tu departamento</option>' +
    TODOS_LOS_DEPARTAMENTOS.map(d => `<option value="${d}">${d}</option>`).join('');
}

function poblarLocalidadesBogota() {
  const sel = document.getElementById('localidadBogota');
  sel.innerHTML = '<option value="" disabled selected>Selecciona tu localidad</option>' +
    LOCALIDADES_BOGOTA.map(l => `<option value="${l}">${l}</option>`).join('') +
    '<option value="Otra">Otra localidad de Bogotá</option>';
}

function esBogota() {
  return document.getElementById('departamento').value === 'Bogotá D.C.';
}

function esSoacha() {
  const dep = document.getElementById('departamento').value;
  const ciudad = document.getElementById('ciudad').value.trim().toLowerCase();
  return dep === 'Cundinamarca' && ciudad.includes('soacha');
}

function esBosa() {
  return esBogota() && document.getElementById('localidadBogota').value === 'Bosa';
}

function calcularEnvio() {
  const dep = document.getElementById('departamento').value;
  const zonaProWrap = document.getElementById('zonaProWrap');
  const bogotaFields = document.getElementById('bogotaLocalidadWrap');
  const ciudadWrap = document.getElementById('ciudadWrap');

  if (!dep) {
    shippingCost = 0;
    document.getElementById('shippingLabel').textContent = 'Selecciona tu departamento';
    document.getElementById('shippingValue').textContent = '—';
    updateTotals();
    return;
  }

  bogotaFields.style.display = esBogota() ? '' : 'none';
  ciudadWrap.style.display = esBogota() ? 'none' : '';

  let label = '';
  if (esBogota()) {
    if (esBosa()) {
      shippingCost = 0;
      label = '🎉 Envío gratis (Bosa)';
    } else {
      shippingCost = TARIFAS.local;
      label = 'Envío Local (Bogotá)';
    }
  } else if (DEPTOS_REGIONAL.includes(dep)) {
    shippingCost = TARIFAS.regional;
    label = 'Envío Regional' + (esSoacha() ? ' (Soacha)' : '');
  } else if (DEPTOS_METROPOLITANO.includes(dep)) {
    shippingCost = TARIFAS.metropolitano;
    label = 'Nacional Metropolitano';
  } else {
    shippingCost = TARIFAS.municipal;
    label = 'Nacional Municipal';
  }

  // Entrega PRO solo disponible en Bogotá o Soacha
  const proDisponible = esBogota() || esSoacha();
  zonaProWrap.style.display = proDisponible ? '' : 'none';
  if (!proDisponible) {
    document.getElementById('proCheckbox').checked = false;
    proExtra = 0;
  }

  document.getElementById('shippingLabel').textContent = label + ' · Inter Rapidísimo';
  document.getElementById('shippingValue').textContent =
    shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString()}`;

  actualizarPro();
  updateTotals();
}

function actualizarPro() {
  const checked = document.getElementById('proCheckbox').checked;
  const franjaWrap = document.getElementById('franjaWrap');
  franjaWrap.style.display = checked ? '' : 'none';
  proExtra = checked ? RECARGO_PRO : 0;
  updateTotals();
}

function updateTotals() {
  const subtotal = getCartTotal();
  const total = subtotal + shippingCost + proExtra;
  const dep = document.getElementById('departamento').value;

  document.getElementById('subtotalValue').textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById('shippingSummaryValue').textContent =
    !dep ? 'Por calcular' : (shippingCost === 0 ? 'Gratis 🎉' : `$${shippingCost.toLocaleString()}`);
  document.getElementById('proRow').style.display = proExtra > 0 ? '' : 'none';
  document.getElementById('proValue').textContent = `$${proExtra.toLocaleString()}`;
  document.getElementById('totalValue').textContent = `$${total.toLocaleString()} COP`;

  const btn = document.getElementById('confirmBtn');
  if (btn) btn.disabled = cart.length === 0;
}

// ------------------------------------------------------------
//  Confirmar pedido → WhatsApp (con resumen completo + pago Nequi)
// ------------------------------------------------------------
function construirMensajePedido() {
  const nombre    = document.getElementById('nombre').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const detalle   = document.getElementById('detalleDireccion').value.trim();
  const dep       = document.getElementById('departamento').value;
  const ciudad    = esBogota()
    ? `Bogotá D.C. - ${document.getElementById('localidadBogota').value}`
    : document.getElementById('ciudad').value.trim();
  const telefono  = document.getElementById('telefono').value.trim();
  const franja    = document.getElementById('franja') ? document.getElementById('franja').value : '';

  const items = cart.map(i => {
    const p = PRODUCTOS.find(x => x.id === i.id);
    return p ? `• ${p.nombre} x${i.cantidad} ($${(p.precio * i.cantidad).toLocaleString()})` : '';
  }).filter(Boolean).join('\n');

  const subtotal = getCartTotal();
  const total = subtotal + shippingCost + proExtra;

  let msg = `Hola Glambaddie.co! 💖 Quiero confirmar mi pedido pagado por Nequi:\n\n`;
  msg += `${items}\n\n`;
  msg += `Subtotal: $${subtotal.toLocaleString()}\n`;
  msg += `Envío (${dep === 'Bogotá D.C.' ? 'Bogotá' : dep}): ${shippingCost === 0 ? 'Gratis' : '$' + shippingCost.toLocaleString()}\n`;
  if (proExtra > 0) msg += `Entrega PRO (${franja}): $${proExtra.toLocaleString()}\n`;
  msg += `TOTAL: $${total.toLocaleString()} COP\n\n`;
  msg += `📍 Entrega a:\n${nombre} ${apellidos}\n${direccion}${detalle ? ' - ' + detalle : ''}\n${ciudad}, ${dep}\nTel: ${telefono}\n\n`;
  msg += `Ya realicé el pago por Nequi, adjunto el comprobante 🧾`;

  return encodeURIComponent(msg);
}

function validarFormulario() {
  const requeridos = ['nombre', 'apellidos', 'direccion', 'telefono'];
  for (const id of requeridos) {
    if (!document.getElementById(id).value.trim()) return false;
  }
  if (!document.getElementById('departamento').value) return false;
  if (esBogota() && !document.getElementById('localidadBogota').value) return false;
  if (!esBogota() && !document.getElementById('ciudad').value.trim()) return false;
  if (document.getElementById('proCheckbox').checked && !document.getElementById('franja').value) return false;
  return true;
}

function confirmarPedido() {
  if (cart.length === 0) return;
  if (!validarFormulario()) {
    document.getElementById('formError').style.display = 'block';
    document.getElementById('formError').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  document.getElementById('formError').style.display = 'none';
  const texto = construirMensajePedido();
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, '_blank');
}

// ------------------------------------------------------------
//  Init
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderOrderSummary();
  poblarDepartamentos();
  poblarLocalidadesBogota();
  updateTotals();

  document.getElementById('departamento').addEventListener('change', calcularEnvio);
  document.getElementById('localidadBogota').addEventListener('change', calcularEnvio);
  document.getElementById('ciudad').addEventListener('input', calcularEnvio);
  document.getElementById('proCheckbox').addEventListener('change', actualizarPro);
  document.getElementById('confirmBtn').addEventListener('click', confirmarPedido);

  document.getElementById('copyNequiBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(NEQUI_PHONE_PLACEHOLDER).then(() => {
      const btn = document.getElementById('copyNequiBtn');
      const original = btn.textContent;
      btn.textContent = '¡Copiado! ✅';
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });
});

// ⚠️ Reemplaza este número por tu número real de Nequi
const NEQUI_PHONE_PLACEHOLDER = "300 000 0000";
