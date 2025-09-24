// Configuración y banderas
const CONFIG = {
  minPackageUsd: 10,
  ticketPriceUsd: 1,
  maxTicketNumber: 99999,
  discount: { enabled: true, code: 'PROMO50', percent: 50 },
};

// Claves localStorage
const KEYS = {
  raffles: 'ld_raffles',
  users: 'ld_users',
  orders: 'ld_orders',
  assignments: 'ld_assignments',
  admins: 'ld_admins',
  blockedNumbers: 'ld_blocked_numbers',
};

// Estado en memoria
const state = {
  currentView: '#home',
  currentRaffleId: null,
};

// Utilidades
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const fmt = (n) => new Intl.NumberFormat('es-ES').format(n);
const id = () => Math.random().toString(36).slice(2, 10);
const nowIso = () => new Date().toISOString();

function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initData() {
  if (!readLS(KEYS.raffles, null)) {
    const sample = [
      {
        id: id(),
        title: 'iPhone 15 Pro',
        description: 'Participa por un iPhone 15 Pro 128GB. Envío incluido.',
        image: 'https://images.unsplash.com/photo-1670272502292-7c0e59101cf9?q=80&w=1200&auto=format&fit=crop',
        drawDate: new Date(Date.now() + 1000*60*60*24*7).toISOString(),
        totalTickets: 99999,
        soldPercent: Math.floor(Math.random()*60)+10,
        active: true,
      },
      {
        id: id(),
        title: 'PlayStation 5',
        description: 'Consola PS5 con control adicional y 1 juego.',
        image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8b?q=80&w=1200&auto=format&fit=crop',
        drawDate: new Date(Date.now() + 1000*60*60*24*14).toISOString(),
        totalTickets: 99999,
        soldPercent: Math.floor(Math.random()*60)+10,
        active: true,
      },
    ];
    writeLS(KEYS.raffles, sample);
  }
  if (!readLS(KEYS.users, null)) writeLS(KEYS.users, []);
  if (!readLS(KEYS.orders, null)) writeLS(KEYS.orders, []);
  if (!readLS(KEYS.assignments, null)) writeLS(KEYS.assignments, []);
  if (!readLS(KEYS.admins, null)) writeLS(KEYS.admins, [ { id: id(), name: 'Admin 1' }, { id: id(), name: 'Admin 2' } ]);
  if (!readLS(KEYS.blockedNumbers, null)) writeLS(KEYS.blockedNumbers, {}); // por sorteo: { raffleId: { '00001': true } }
}

// Ruteo sencillo por hash
function navigate(route) {
  state.currentView = route;
  $$('.view').forEach(v => v.classList.remove('active'));
  if (route === '#home') $('#view-home').classList.add('active');
  if (route === '#detail') $('#view-detail').classList.add('active');
  if (route === '#purchase') $('#view-purchase').classList.add('active');
  if (route === '#admin') $('#view-admin').classList.add('active');
  if (route === '#lookup') $('#view-lookup').classList.add('active');
}

function setupNav() {
  $$('#year').forEach?.(() => {});
  $('#year').textContent = new Date().getFullYear();
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });
  $$('.back').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.route)));
  window.addEventListener('hashchange', () => {
    const r = location.hash || '#home';
    navigate(r);
  });
}

// Render Landing
function renderRaffles() {
  const raffles = readLS(KEYS.raffles, []);
  const container = $('#raffles-list');
  container.innerHTML = '';
  raffles.filter(r => r.active).forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${r.image}" alt="${r.title}" />
      <h3>${r.title}</h3>
      <p class="muted">Sortea: ${new Date(r.drawDate).toLocaleDateString()}</p>
      <div class="progress" aria-label="Progreso">
        <div class="progress-bar" style="width:${r.soldPercent}%"></div>
      </div>
      <p class="muted">${r.soldPercent}% de tickets vendidos</p>
      <button class="secondary" data-id="${r.id}">Ver detalles</button>
    `;
    card.querySelector('button').addEventListener('click', () => openDetail(r.id));
    container.appendChild(card);
  });
}

function openDetail(raffleId) {
  state.currentRaffleId = raffleId;
  const raffles = readLS(KEYS.raffles, []);
  const r = raffles.find(x => x.id === raffleId);
  if (!r) return;
  $('#detail-title').textContent = r.title;
  $('#detail-image').src = r.image;
  $('#detail-date').textContent = new Date(r.drawDate).toLocaleString();
  $('#detail-desc').textContent = r.description;
  $('#detail-progress-bar').style.width = r.soldPercent + '%';
  $('#detail-progress-text').textContent = `${r.soldPercent}% de tickets vendidos`;
  $('#btn-buy').onclick = () => navigate('#purchase');
  navigate('#detail');
}

// Compra
function generateOrderCode() {
  return 'LD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
}

function handleGenerateOrder() {
  const code = generateOrderCode();
  $('#order-code').textContent = code;
  showBanner(`Código de orden generado: ${code}`);
}

function calcTicketsFromAmount(amountUsd, discountCode) {
  const price = CONFIG.ticketPriceUsd;
  const hasPromo = CONFIG.discount.enabled && discountCode?.trim().toUpperCase() === CONFIG.discount.code;
  const effectiveAmount = hasPromo ? amountUsd * (1 - CONFIG.discount.percent/100) : amountUsd;
  const tickets = Math.floor(effectiveAmount / price);
  return { tickets, hasPromo };
}

function handlePurchaseSubmit(e) {
  e.preventDefault();
  const raffleId = state.currentRaffleId;
  if (!raffleId) { showBanner('Selecciona un sorteo.'); return; }
  const firstname = $('#input-firstname').value.trim();
  const lastname = $('#input-lastname').value.trim();
  const docId = $('#input-id').value.trim();
  const email = $('#input-email').value.trim().toLowerCase();
  const phone = $('#input-phone').value.trim();
  const amount = parseInt($('#input-amount').value, 10) || 0;
  const discountCode = $('#input-discount').value.trim();

  if (amount < CONFIG.minPackageUsd) {
    showBanner(`Compra mínima ${CONFIG.minPackageUsd} USD (paquetes de 10).`);
    return;
  }

  let orderCode = $('#order-code').textContent;
  if (!orderCode || orderCode === '—') {
    orderCode = generateOrderCode();
    $('#order-code').textContent = orderCode;
  }

  const { tickets, hasPromo } = calcTicketsFromAmount(amount, discountCode);
  if (tickets < 10) { // mínimo 10 tickets porque mínimo 10 USD y 1 USD por ticket (sin promo debe ser >=10; con promo 10 USD -> 5 tickets, pero requerimos mínimo 10 tickets efectivos)
    showBanner('Debes comprar al menos 10 tickets. Ajusta el monto.');
    return;
  }

  // Guardar usuario si no existe
  const users = readLS(KEYS.users, []);
  let user = users.find(u => u.email === email);
  if (!user) {
    user = { id: id(), firstname, lastname, docId, email, phone, createdAt: nowIso(), purchases: 0 };
    users.push(user);
    writeLS(KEYS.users, users);
  }

  // Crear orden pendiente
  const orders = readLS(KEYS.orders, []);
  const file = $('#input-proof').files?.[0];
  const fakeProofName = file ? file.name : null;
  const order = {
    id: id(),
    orderCode,
    raffleId,
    userId: user.id,
    amountUsd: amount,
    requestedTickets: tickets,
    discountApplied: hasPromo,
    status: 'pending', // pending|validated|rejected
    proofFilename: fakeProofName,
    createdAt: nowIso(),
  };
  orders.push(order);
  writeLS(KEYS.orders, orders);

  $('#purchase-msg').hidden = false;
  $('#purchase-msg').textContent = 'Orden enviada. Un administrador validará tu pago. Guarda tu código de orden.';
  showBanner('Orden enviada. Espera validación.');
  navigate('#home');
}

// Asignación de números únicos (00001 - 99999)
function generateUniqueNumbers(raffleId, count) {
  const blocked = readLS(KEYS.blockedNumbers, {});
  const map = blocked[raffleId] || {};
  const results = [];
  const max = CONFIG.maxTicketNumber;
  let guard = 0;
  while (results.length < count && guard < 200000) {
    guard++;
    const n = Math.floor(Math.random()*max) + 1;
    const code = String(n).padStart(5, '0');
    if (!map[code]) {
      map[code] = true;
      results.push(code);
    }
  }
  blocked[raffleId] = map;
  writeLS(KEYS.blockedNumbers, blocked);
  return results;
}

// Admin
function renderAdmin() {
  // selector admins
  const admins = readLS(KEYS.admins, []);
  const sel = $('#admin-selector');
  sel.innerHTML = admins.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

  // pagos pendientes
  const orders = readLS(KEYS.orders, []);
  const users = readLS(KEYS.users, []);
  const raffles = readLS(KEYS.raffles, []);
  const wrap = $('#pending-orders');
  const pending = orders.filter(o => o.status === 'pending');
  if (pending.length === 0) {
    wrap.innerHTML = '<p class="muted">No hay pagos pendientes.</p>';
  } else {
    wrap.innerHTML = `<table>
      <thead><tr>
        <th>Fecha</th><th>Orden</th><th>Usuario</th><th>Sorteo</th><th>Monto</th><th>Tickets</th><th>Comprobante</th><th>Acciones</th>
      </tr></thead>
      <tbody>
        ${pending.map(o => {
          const u = users.find(x => x.id === o.userId);
          const r = raffles.find(x => x.id === o.raffleId);
          return `<tr>
            <td>${new Date(o.createdAt).toLocaleString()}</td>
            <td>${o.orderCode}</td>
            <td>${u ? `${u.firstname} ${u.lastname}` : '—'}</td>
            <td>${r ? r.title : '—'}</td>
            <td>$${fmt(o.amountUsd)}</td>
            <td>${o.requestedTickets}</td>
            <td>${o.proofFilename ?? '—'}</td>
            <td>
              <button class="primary" data-act="validate" data-id="${o.id}">Validar</button>
              <button class="back" data-act="reject" data-id="${o.id}">Rechazar</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
    wrap.querySelectorAll('button').forEach(b => b.addEventListener('click', onAdminOrderAction));
  }

  // sorteos
  const adminRaffles = $('#admin-raffles');
  adminRaffles.innerHTML = `<table>
    <thead><tr><th>Título</th><th>Fecha</th><th>% Vendido</th><th>Activo</th><th>Acciones</th></tr></thead>
    <tbody>
      ${raffles.map(r => `<tr>
        <td>${r.title}</td>
        <td>${new Date(r.drawDate).toLocaleDateString()}</td>
        <td>${r.soldPercent}%</td>
        <td>${r.active ? 'Sí' : 'No'}</td>
        <td>
          <button class="secondary" data-ra="${r.id}" data-act="toggle">${r.active ? 'Cerrar' : 'Abrir'}</button>
          <button class="back" data-ra="${r.id}" data-act="edit">Editar</button>
        </td>
      </tr>`).join('')}
    </tbody>
  </table>`;
  adminRaffles.querySelectorAll('button').forEach(b => b.addEventListener('click', onAdminRaffleAction));
}

function onAdminRaffleAction(e) {
  const idRa = e.currentTarget.getAttribute('data-ra');
  const act = e.currentTarget.getAttribute('data-act');
  const raffles = readLS(KEYS.raffles, []);
  const r = raffles.find(x => x.id === idRa);
  if (!r) return;
  if (act === 'toggle') {
    r.active = !r.active;
    writeLS(KEYS.raffles, raffles);
    renderRaffles();
    renderAdmin();
  } else if (act === 'edit') {
    const title = prompt('Título', r.title) ?? r.title;
    const description = prompt('Descripción', r.description) ?? r.description;
    const drawDate = prompt('Fecha sorteo (YYYY-MM-DD)', r.drawDate.slice(0,10)) ?? r.drawDate;
    r.title = title; r.description = description; r.drawDate = new Date(drawDate).toISOString();
    writeLS(KEYS.raffles, raffles);
    renderRaffles();
    renderAdmin();
  }
}

function onAdminOrderAction(e) {
  const idOrder = e.currentTarget.getAttribute('data-id');
  const act = e.currentTarget.getAttribute('data-act');
  const orders = readLS(KEYS.orders, []);
  const order = orders.find(o => o.id === idOrder);
  if (!order) return;
  if (act === 'reject') {
    order.status = 'rejected';
    writeLS(KEYS.orders, orders);
    renderAdmin();
    showBanner('Orden rechazada.');
    return;
  }
  if (act === 'validate') {
    order.status = 'validated';
    writeLS(KEYS.orders, orders);

    // Asignar números
    const numbers = generateUniqueNumbers(order.raffleId, order.requestedTickets);

    // Guardar asignaciones
    const assigns = readLS(KEYS.assignments, []);
    assigns.push({
      id: id(),
      raffleId: order.raffleId,
      orderId: order.id,
      userId: order.userId,
      numbers,
      createdAt: nowIso(),
    });
    writeLS(KEYS.assignments, assigns);

    // Incrementar compras de usuario y simular correo
    const users = readLS(KEYS.users, []);
    const u = users.find(x => x.id === order.userId);
    if (u) { u.purchases = (u.purchases || 0) + 1; writeLS(KEYS.users, users); }

    renderAdmin();
    showBanner(`Pago validado. ${numbers.length} tickets asignados. Recibirás tus números por correo.`);

    // Mostrar promoción si aplica
    if (CONFIG.discount.enabled) {
      alert(`Promoción: usa el código ${CONFIG.discount.code} para ${CONFIG.discount.percent}% de descuento en tu próxima compra.`);
    }
  }
}

// Export CSV
function exportCSV() {
  const users = readLS(KEYS.users, []);
  const orders = readLS(KEYS.orders, []);
  const assigns = readLS(KEYS.assignments, []);

  const rows = [
    ['Nombre','Apellido','Cédula','Correo','Teléfono','Orden','Sorteo','Monto','Tickets solicitados','Descuento','Estado','Tickets asignados','Fecha'],
  ];
  orders.forEach(o => {
    const u = users.find(x => x.id === o.userId);
    const asg = assigns.find(a => a.orderId === o.id);
    rows.push([
      u?.firstname ?? '', u?.lastname ?? '', u?.docId ?? '', u?.email ?? '', u?.phone ?? '',
      o.orderCode, o.raffleId, String(o.amountUsd), String(o.requestedTickets), o.discountApplied ? 'Sí' : 'No', o.status,
      asg ? asg.numbers.join(' ') : '', new Date(o.createdAt).toLocaleString()
    ]);
  });
  const csv = rows.map(r => r.map(cell => '"' + String(cell).replaceAll('"','""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reporte_llave_dorada.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Crear sorteo
function createRaffle() {
  const title = prompt('Título del sorteo'); if (!title) return;
  const description = prompt('Descripción') || '';
  const image = prompt('URL de imagen') || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop';
  const drawDate = prompt('Fecha sorteo (YYYY-MM-DD)', new Date(Date.now()+1000*60*60*24*7).toISOString().slice(0,10)) || new Date().toISOString().slice(0,10);
  const raffles = readLS(KEYS.raffles, []);
  raffles.push({ id: id(), title, description, image, drawDate: new Date(drawDate).toISOString(), totalTickets: 99999, soldPercent: Math.floor(Math.random()*60)+5, active: true });
  writeLS(KEYS.raffles, raffles);
  renderRaffles();
  renderAdmin();
}

// Lookup por correo
function onLookupSubmit(e) {
  e.preventDefault();
  const email = $('#lookup-email').value.trim().toLowerCase();
  const users = readLS(KEYS.users, []);
  const u = users.find(x => x.email === email);
  const assigns = readLS(KEYS.assignments, []);
  const raffles = readLS(KEYS.raffles, []);
  const container = $('#lookup-results');
  container.innerHTML = '';
  if (!u) {
    container.innerHTML = '<p class="muted">No se encontraron compras para este correo.</p>';
    return;
  }
  const my = assigns.filter(a => a.userId === u.id);
  if (my.length === 0) {
    container.innerHTML = '<p class="muted">Aún no tienes números asignados.</p>';
    return;
  }
  my.forEach(a => {
    const r = raffles.find(x => x.id === a.raffleId);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${r ? r.title : 'Sorteo'}</h3>
      <p class="muted">Asignados el ${new Date(a.createdAt).toLocaleString()}</p>
      <div class="numbers">${a.numbers.map(n => `<span class="num">${n}</span>`).join(' ')}</div>
    `;
    container.appendChild(card);
  });
}

// Banner notificaciones
let bannerTimer = null;
function showBanner(text, ms = 4000) {
  const b = $('#banner');
  b.textContent = text;
  b.hidden = false;
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => { b.hidden = true; }, ms);
}

// Eventos iniciales
function setupEvents() {
  $('#btn-generate-order').addEventListener('click', handleGenerateOrder);
  $('#purchase-form').addEventListener('submit', handlePurchaseSubmit);
  $('#btn-export').addEventListener('click', exportCSV);
  $('#btn-create-raffle').addEventListener('click', createRaffle);
  $('#lookup-form').addEventListener('submit', onLookupSubmit);
}

function boot() {
  initData();
  setupNav();
  setupEvents();
  renderRaffles();
  renderAdmin();
  navigate(location.hash || '#home');
}

document.addEventListener('DOMContentLoaded', boot);
