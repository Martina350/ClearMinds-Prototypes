// Datos mock iniciales (si no existen en localStorage)
const initialMock = {
  users: [
    { id: 'u1', email: 'admin@fivoduc.test', password: 'admin', role: 'admin', name: 'Admin Fivoduc' },
    { id: 'u2', email: 'docente@fivoduc.test', password: 'docente', role: 'teacher', name: 'María Torres' },
    { id: 'u3', email: 'alumno1@fivoduc.test', password: 'alumno', role: 'student', name: 'Luis Pérez', studentId: 's1' },
    { id: 'u4', email: 'padre1@fivoduc.test', password: 'padre', role: 'parent', name: 'Sr. Pérez', childStudentId: 's1' },
    { id: 'u5', email: 'finanzas@fivoduc.test', password: 'finanzas', role: 'finance', name: 'Gabriela Ríos' },
  ],
  groups: [
    { id: 'g1', name: 'Grupo A', subject: 'Inglés', modality: 'virtual', teacherId: 'u2' },
    { id: 'g2', name: 'Grupo B', subject: 'Matemáticas', modality: 'presencial', teacherId: 'u2' },
  ],
  students: [
    { id: 's1', fullName: 'Luis Pérez', document: '12345678', groupId: 'g1', status: 'matriculado' },
  ],
  attendance: [
    // { id: 'a1', studentId: 's1', groupId: 'g1', date: '2025-09-15', present: true }
  ],
  grades: [
    // { id: 'gr1', studentId: 's1', groupId: 'g1', activity: 'Quiz 1', score: 18 }
  ],
  assignments: [
    // { id:'as1', groupId:'g1', title:'Práctica 1', due:'2025-09-30', submissions:[{studentId:'s1', url:'#'}] }
  ],
  payments: [
    { id: 'p1', studentId: 's1', type: 'Matrícula', amount: 120, status: 'pagado', date: '2025-09-01' },
    { id: 'p2', studentId: 's1', type: 'Mensualidad', amount: 80, status: 'pendiente', date: '2025-09-10' },
  ],
  feedback: [
    // { id:'f1', parentId:'u4', studentId:'s1', message:'Excelente clase', date:'2025-09-12' }
  ],
  virtualLinks: [
    { id:'vl1', groupId:'g1', url:'https://meet.example.com/grupoA', label:'Link clase virtual' }
  ]
};

const storageKey = 'fivoduc.mock.v1';
function loadData(){
  const raw = localStorage.getItem(storageKey);
  if(!raw){
    localStorage.setItem(storageKey, JSON.stringify(initialMock));
    return structuredClone(initialMock);
  }
  try{ return JSON.parse(raw); } catch(e){
    console.error('Error parse data, resetting', e);
    localStorage.setItem(storageKey, JSON.stringify(initialMock));
    return structuredClone(initialMock);
  }
}
function saveData(db){ localStorage.setItem(storageKey, JSON.stringify(db)); }
function uid(prefix){ return `${prefix}_${Math.random().toString(36).slice(2,9)}`; }

// Estado de sesión simple
let state = {
  db: loadData(),
  currentUser: null,
  selectedRole: null,
};

// Utilidades UI
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
function showToast(type, title, msg){
  const wrap = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<div><div class="title">${title}</div><div>${msg||''}</div></div>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.remove(); }, 3500);
}
function openModal(title, bodyHTML, onConfirm){
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = bodyHTML;
  $('#modal').classList.remove('hidden');
  const confirmBtn = $('#modal-confirm');
  const cancel = ()=> $('#modal').classList.add('hidden');
  $('#modal-close').onclick = cancel; $('#modal-cancel').onclick = cancel;
  confirmBtn.onclick = ()=>{ if(onConfirm) onConfirm(); cancel(); };
}
function switchView(id){
  $$('.view').forEach(v=>v.classList.add('hidden'));
  $(id).classList.remove('hidden');
}
function setActiveSection(section){
  $$('.section').forEach(s=>s.classList.add('hidden'));
  if(section) section.classList.remove('hidden');
}

// Login
let selectedRole = null;
$$('.role-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    selectedRole = btn.dataset.role;
    $$('.role-btn').forEach(b=> b.style.outline = 'none');
    btn.style.outline = '3px solid rgba(0,0,0,.15)';
  });
});

$('#login-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('#email').value.trim();
  const password = $('#password').value.trim();
  const user = state.db.users.find(u=> u.email===email && u.password===password && (!selectedRole || u.role===selectedRole));
  if(!user){ showToast('error','Acceso denegado','Credenciales o rol inválido.'); return; }
  state.currentUser = user; state.selectedRole = user.role;
  $('#current-role-title').textContent = `Panel ${roleLabel(user.role)}`;
  buildSidebar(user.role);
  renderDashboard(user.role);
  switchView('#view-app');
});

$('#btn-logout').addEventListener('click', ()=>{
  state.currentUser = null; state.selectedRole = null; selectedRole = null;
  switchView('#view-login');
  showToast('info','Sesión cerrada','Vuelve a ingresar para continuar.');
});

$('#btn-toggle-sidebar').addEventListener('click', ()=>{
  $('#sidebar').classList.toggle('open');
});

$('#btn-open-notifications').addEventListener('click', ()=>{
  const pending = state.db.payments.filter(p=>p.status==='pendiente').length;
  showToast('info','Notificaciones',`${pending} pagos pendientes en el sistema.`);
});

function roleLabel(r){
  return {admin:'Administrador',teacher:'Docente',student:'Estudiante',parent:'Padre',finance:'Finanzas'}[r] || r;
}

// Sidebar dinámico por rol
function buildSidebar(role){
  const menu = $('#menu');
  menu.innerHTML = '';
  function addItem(key, label, icon){
    const it = document.createElement('div');
    it.className = 'nav-item'; it.dataset.key = key;
    it.innerHTML = `<span>${icon}</span><span>${label}</span>`;
    it.addEventListener('click', ()=> onNav(key, it));
    menu.appendChild(it);
  }
  const baseDash = ()=> addItem('dashboard','Inicio','🏠');
  baseDash();
  if(role==='admin'){
    addItem('students','Estudiantes','🧑‍🎓');
    addItem('attendance','Asistencias','🗓️');
    addItem('grades','Calificaciones','✅');
    addItem('finance','Finanzas','💳');
    addItem('feedback','Feedback','💬');
  } else if(role==='teacher'){
    addItem('attendance','Asistencias','🗓️');
    addItem('grades','Calificaciones','✅');
    addItem('assignments','Prácticas','📎');
  } else if(role==='student'){
    addItem('grades','Mis Calificaciones','📊');
    addItem('attendance','Mi Asistencia','🗓️');
    addItem('assignments','Tareas','📎');
  } else if(role==='parent'){
    addItem('grades','Progreso académico','📊');
    addItem('attendance','Asistencia','🗓️');
    addItem('finance','Pagos','💳');
    addItem('feedback','Enviar feedback','💬');
  } else if(role==='finance'){
    addItem('finance','Dashboard financiero','💳');
  }
  menu.firstChild && menu.firstChild.classList.add('active');
}

function onNav(key, el){
  $$('#menu .nav-item').forEach(n=> n.classList.remove('active'));
  el.classList.add('active');
  setActiveSection(null);
  if(key==='dashboard'){ renderDashboard(state.selectedRole); return; }
  if(key==='students'){ renderStudentsSection(); return; }
  if(key==='attendance'){ renderAttendanceSection(); return; }
  if(key==='grades'){ renderGradesSection(); return; }
  if(key==='assignments'){ renderAssignmentsSection(); return; }
  if(key==='finance'){ renderFinanceSection(); return; }
  if(key==='feedback'){ renderFeedbackSection(); return; }
}

// Dashboards por rol: cards con KPIs simples
function renderDashboard(role){
  const wrap = $('#dashboard');
  wrap.innerHTML = '';
  const kpi = (title, subtitle, badge, badgeClass)=>{
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `<div class="badge ${badgeClass}">${badge}</div><div class="title">${title}</div><p class="subtitle">${subtitle}</p>`;
    wrap.appendChild(c);
  };
  const totalStudents = state.db.students.length;
  const pendingPayments = state.db.payments.filter(p=>p.status==='pendiente').length;
  const totalGroups = state.db.groups.length;
  if(role==='admin'){
    kpi('Estudiantes', `${totalStudents} registrados`, 'Académico', 'badge-blue');
    kpi('Grupos', `${totalGroups} activos`, 'Grupos', 'badge-purple');
    kpi('Pagos pendientes', `${pendingPayments}`, 'Finanzas', 'badge-yellow');
  } else if(role==='teacher'){
    const myGroups = state.db.groups.filter(g=> g.teacherId===state.currentUser.id).length;
    kpi('Mis grupos', `${myGroups}`, 'Docente', 'badge-green');
    kpi('Tareas', `${state.db.assignments.length}`, 'Prácticas', 'badge-orange');
  } else if(role==='student'){
    const myAtt = state.db.attendance.filter(a=> a.studentId===state.currentUser.studentId).length;
    kpi('Asistencias', `${myAtt}`, 'Mi progreso', 'badge-blue');
    kpi('Tareas', `${state.db.assignments.length}`, 'Mis tareas', 'badge-orange');
  } else if(role==='parent'){
    kpi('Reportes', 'Ver calificaciones y asistencia', 'Hijo', 'badge-green');
    kpi('Pagos', `${pendingPayments} pendientes`, 'Finanzas', 'badge-yellow');
  } else if(role==='finance'){
    const paid = state.db.payments.filter(p=>p.status==='pagado').reduce((a,b)=>a+b.amount,0);
    kpi('Ingresos', `$ ${paid}`, 'Finanzas', 'badge-green');
    kpi('Pendientes', `${pendingPayments}`, 'Alertas', 'badge-yellow');
  }
}

// Sección: Estudiantes (Admin)
function renderStudentsSection(){
  const sec = $('#section-students'); sec.innerHTML = '';
  setActiveSection(sec);
  const toolbar = document.createElement('div'); toolbar.className = 'toolbar';
  const search = document.createElement('input'); search.className='input'; search.placeholder='Buscar estudiante...';
  const addBtn = document.createElement('button'); addBtn.className='primary-btn'; addBtn.textContent='Nuevo estudiante';
  toolbar.append(search, addBtn);
  const table = document.createElement('div');
  table.innerHTML = buildStudentsTable(state.db.students);
  sec.append(toolbar, table);
  addBtn.addEventListener('click', ()=> openStudentModal());
  search.addEventListener('input', ()=>{
    const q = search.value.toLowerCase();
    table.innerHTML = buildStudentsTable(state.db.students.filter(s=> s.fullName.toLowerCase().includes(q)));
  });
}
function buildStudentsTable(rows){
  const groupName = id=> state.db.groups.find(g=>g.id===id)?.name || '-';
  const tr = rows.map(s=>`<tr>
    <td>${s.fullName}</td>
    <td>${s.document||''}</td>
    <td>${groupName(s.groupId)}</td>
    <td>${s.status||''}</td>
    <td style="text-align:right">
      <button class="secondary-btn" data-edit="${s.id}">Editar</button>
      <button class="secondary-btn" data-del="${s.id}">Eliminar</button>
    </td>
  </tr>`).join('');
  const html = `<div class="card"><h3 class="title">Estudiantes</h3>
    <table><thead><tr><th>Nombre</th><th>Documento</th><th>Grupo</th><th>Estado</th><th></th></tr></thead>
    <tbody>${tr || '<tr><td colspan="5">Sin registros</td></tr>'}</tbody></table></div>`;
  setTimeout(()=>{
    $$('#section-students [data-edit]').forEach(b=> b.addEventListener('click',()=> openStudentModal(b.dataset.edit)));
    $$('#section-students [data-del]').forEach(b=> b.addEventListener('click',()=> deleteStudent(b.dataset.del)));
  });
  return html;
}
function openStudentModal(id){
  const s = id ? state.db.students.find(x=>x.id===id) : { fullName:'', document:'', groupId: state.db.groups[0]?.id, status:'matriculado' };
  const body = `
    <div class="field"><label>Nombre completo</label><input id="st_name" class="input" value="${s.fullName||''}"></div>
    <div class="field"><label>Documento</label><input id="st_doc" class="input" value="${s.document||''}"></div>
    <div class="field"><label>Grupo</label>
      <select id="st_group" class="input">${state.db.groups.map(g=>`<option value="${g.id}" ${g.id===s.groupId?'selected':''}>${g.name} — ${g.subject}</option>`).join('')}</select>
    </div>
    <div class="field"><label>Estado</label>
      <select id="st_status" class="input">
        <option ${s.status==='matriculado'?'selected':''} value="matriculado">Matriculado</option>
        <option ${s.status==='retirado'?'selected':''} value="retirado">Retirado</option>
      </select>
    </div>
  `;
  openModal(id? 'Editar estudiante' : 'Nuevo estudiante', body, ()=>{
    const fullName = $('#st_name').value.trim();
    if(!fullName){ showToast('warn','Validación','El nombre es requerido.'); return; }
    const doc = $('#st_doc').value.trim();
    const groupId = $('#st_group').value; const status = $('#st_status').value;
    if(id){ Object.assign(s, { fullName, document:doc, groupId, status }); }
    else { state.db.students.push({ id: uid('s'), fullName, document:doc, groupId, status }); }
    saveData(state.db); renderStudentsSection(); showToast('success','Guardado','Estudiante registrado.');
  });
}
function deleteStudent(id){
  state.db.students = state.db.students.filter(s=> s.id!==id);
  saveData(state.db); renderStudentsSection(); showToast('info','Eliminado','Estudiante eliminado.');
}

// Sección: Asistencias
function renderAttendanceSection(){
  const sec = $('#section-attendance'); sec.innerHTML=''; setActiveSection(sec);
  const isTeacher = state.selectedRole==='teacher' || state.selectedRole==='admin';
  const myGroupId = state.selectedRole==='teacher' ? state.db.groups.find(g=> g.teacherId===state.currentUser.id)?.id : null;
  const groups = state.selectedRole==='teacher' ? state.db.groups.filter(g=> g.teacherId===state.currentUser.id) : state.db.groups;
  const groupOptions = groups.map(g=> `<option value="${g.id}" ${g.id===myGroupId?'selected':''}>${g.name} — ${g.subject}</option>`).join('');
  const body = document.createElement('div'); body.className='card';
  body.innerHTML = `
    <h3 class="title">Registro de asistencia</h3>
    <div class="toolbar">
      <select id="att_group" class="input">${groupOptions}</select>
      <input id="att_date" class="input" type="date" />
      ${isTeacher? '<button id="att_save" class="primary-btn">Guardar lista</button>' : ''}
    </div>
    <div id="att_table"></div>
  `;
  sec.appendChild(body);
  const renderTable = ()=>{
    const gid = $('#att_group').value; const date = $('#att_date').value || new Date().toISOString().slice(0,10);
    const students = state.db.students.filter(s=> s.groupId===gid);
    const existing = state.db.attendance.filter(a=> a.groupId===gid && a.date===date);
    const rows = students.map(st=>{
      const rec = existing.find(a=> a.studentId===st.id);
      const checked = rec? rec.present : false;
      return `<tr><td>${st.fullName}</td><td style="text-align:right"><input type="checkbox" data-st="${st.id}" ${checked?'checked':''}></td></tr>`;
    }).join('');
    $('#att_table').innerHTML = `<table><thead><tr><th>Estudiante</th><th style="text-align:right">Presente</th></tr></thead><tbody>${rows}</tbody></table>`;
  };
  $('#att_group').addEventListener('change', renderTable);
  $('#att_date').addEventListener('change', renderTable);
  $('#att_date').value = new Date().toISOString().slice(0,10);
  renderTable();
  const save = ()=>{
    const gid = $('#att_group').value; const date = $('#att_date').value;
    // remove old
    state.db.attendance = state.db.attendance.filter(a=> !(a.groupId===gid && a.date===date));
    // add new
    $$('#att_table [data-st]').forEach(input=>{
      state.db.attendance.push({ id: uid('a'), studentId: input.dataset.st, groupId: gid, date, present: input.checked });
    });
    saveData(state.db); showToast('success','Asistencia registrada','Se guardó la lista.');
  };
  const btn = $('#att_save'); if(btn) btn.addEventListener('click', save);
}

// Sección: Calificaciones
function renderGradesSection(){
  const sec = $('#section-grades'); sec.innerHTML=''; setActiveSection(sec);
  const isTeacher = state.selectedRole==='teacher' || state.selectedRole==='admin';
  const myGroups = state.selectedRole==='teacher' ? state.db.groups.filter(g=> g.teacherId===state.currentUser.id) : state.db.groups;
  const groupOptions = myGroups.map(g=> `<option value="${g.id}">${g.name} — ${g.subject}</option>`).join('');
  const body = document.createElement('div'); body.className='card';
  body.innerHTML = `
    <h3 class="title">Calificaciones</h3>
    <div class="toolbar">
      <select id="gr_group" class="input">${groupOptions}</select>
      ${isTeacher? '<input id="gr_activity" class="input" placeholder="Actividad (p.ej. Quiz 1)">':''}
      ${isTeacher? '<button id="gr_save" class="primary-btn">Guardar</button>':''}
    </div>
    <div id="gr_table"></div>
  `;
  sec.appendChild(body);
  const renderTable = ()=>{
    const gid = $('#gr_group').value || myGroups[0]?.id; const activity = $('#gr_activity')?.value || 'Actividad';
    const students = state.db.students.filter(s=> s.groupId===gid);
    const rows = students.map(st=>{
      const current = state.db.grades.find(g=> g.studentId===st.id && g.groupId===gid && g.activity===activity)?.score || '';
      const inputCell = isTeacher ? `<input class="input" style="width:90px" data-st="${st.id}" value="${current}">` : `<strong>${current||'-'}</strong>`;
      return `<tr><td>${st.fullName}</td><td style="text-align:right">${inputCell}</td></tr>`;
    }).join('');
    $('#gr_table').innerHTML = `<table><thead><tr><th>Estudiante</th><th style="text-align:right">Puntaje</th></tr></thead><tbody>${rows}</tbody></table>`;
  };
  $('#gr_group').addEventListener('change', renderTable);
  if($('#gr_activity')) $('#gr_activity').addEventListener('input', renderTable);
  renderTable();
  const save = ()=>{
    const gid = $('#gr_group').value; const activity = $('#gr_activity').value || 'Actividad';
    // remove existing of same activity
    state.db.grades = state.db.grades.filter(g=> !(g.groupId===gid && g.activity===activity));
    $$('#gr_table [data-st]').forEach(input=>{
      const score = Number(input.value||0);
      state.db.grades.push({ id: uid('gr'), studentId: input.dataset.st, groupId: gid, activity, score });
    });
    saveData(state.db); showToast('success','Calificaciones guardadas',`Actividad: ${activity}`);
  };
  const btn = $('#gr_save'); if(btn) btn.addEventListener('click', save);
}

// Sección: Prácticas / Tareas
function renderAssignmentsSection(){
  const sec = $('#section-assignments'); sec.innerHTML=''; setActiveSection(sec);
  const role = state.selectedRole;
  const body = document.createElement('div'); body.className='card';
  if(role==='teacher' || role==='admin'){
    body.innerHTML = `
      <h3 class="title">Prácticas</h3>
      <div class="toolbar">
        <select id="as_group" class="input">${state.db.groups.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select>
        <input id="as_title" class="input" placeholder="Título de la práctica">
        <input id="as_due" class="input" type="date">
        <button id="as_create" class="primary-btn">Crear</button>
      </div>
      <div id="as_list"></div>
    `;
    sec.appendChild(body);
    const renderList = ()=>{
      const list = state.db.assignments.map(a=>`<div class="card" style="margin-top:10px">
        <div class="title">${a.title}</div>
        <p class="subtitle">Entrega: ${a.due || '-'}</p>
        <p>${(a.submissions||[]).length} entregas</p>
      </div>`).join('');
      $('#as_list').innerHTML = list || '<p>No hay prácticas.</p>';
    };
    $('#as_create').addEventListener('click',()=>{
      const groupId = $('#as_group').value; const title = $('#as_title').value.trim(); const due = $('#as_due').value;
      if(!title){ showToast('warn','Validación','Ingresa un título.'); return; }
      state.db.assignments.push({ id: uid('as'), groupId, title, due, submissions: [] });
      saveData(state.db); renderList(); showToast('success','Práctica creada', title);
    });
    renderList();
  } else if(role==='student'){
    body.innerHTML = `
      <h3 class="title">Mis tareas</h3>
      <div id="as_list"></div>
    `;
    sec.appendChild(body);
    const myGroup = state.db.students.find(s=> s.id===state.currentUser.studentId)?.groupId;
    const myAssignments = state.db.assignments.filter(a=> a.groupId===myGroup);
    const list = myAssignments.map(a=>`<div class="card" style="margin-top:10px">
      <div class="title">${a.title}</div>
      <p class="subtitle">Entrega: ${a.due || '-'}</p>
      <div class="toolbar">
        <input class="input" placeholder="URL de archivo" data-url="${a.id}">
        <button class="secondary-btn" data-send="${a.id}">Enviar</button>
      </div>
    </div>`).join('');
    $('#as_list').innerHTML = list || '<p>No hay tareas.</p>';
    $$('[data-send]').forEach(btn=> btn.addEventListener('click',()=>{
      const id = btn.dataset.send; const input = $(`[data-url="${id}"]`);
      const url = input.value.trim(); if(!url){ showToast('warn','Validación','Ingresa la URL.'); return; }
      const a = state.db.assignments.find(x=> x.id===id);
      a.submissions = a.submissions || []; a.submissions.push({ studentId: state.currentUser.studentId, url });
      saveData(state.db); showToast('success','Entregado','Se envió tu práctica.'); input.value='';
    }));
    // Link de clase virtual
    const myLink = state.db.virtualLinks.find(v=> v.groupId===myGroup);
    if(myLink){
      const linkCard = document.createElement('div'); linkCard.className='card';
      linkCard.innerHTML = `<div class="title">${myLink.label}</div><a href="${myLink.url}" target="_blank" class="secondary-btn">Unirme a la clase</a>`;
      sec.appendChild(linkCard);
    }
  }
}

// Sección: Finanzas
function renderFinanceSection(){
  const sec = $('#section-finance'); sec.innerHTML=''; setActiveSection(sec);
  const body = document.createElement('div'); body.className='card';
  const list = state.db.payments.map(p=>`<tr>
    <td>${p.type}</td><td>$ ${p.amount}</td><td>${p.date}</td><td>${p.status}</td>
    <td style="text-align:right">${p.status==='pendiente' ? `<button class="secondary-btn" data-pay="${p.id}">Marcar pagado</button>`:''}</td>
  </tr>`).join('');
  body.innerHTML = `
    <h3 class="title">Pagos y alertas</h3>
    <table><thead><tr><th>Concepto</th><th>Monto</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
    <tbody>${list}</tbody></table>
  `;
  sec.appendChild(body);
  $$('[data-pay]').forEach(btn=> btn.addEventListener('click',()=>{
    const id = btn.dataset.pay; const p = state.db.payments.find(x=> x.id===id); p.status='pagado';
    saveData(state.db); renderFinanceSection(); showToast('success','Pago registrado','El estado fue actualizado.');
  }));
}

// Sección: Feedback
function renderFeedbackSection(){
  const sec = $('#section-feedback'); sec.innerHTML=''; setActiveSection(sec);
  const role = state.selectedRole;
  const body = document.createElement('div'); body.className='card';
  if(role==='parent'){
    body.innerHTML = `
      <h3 class="title">Enviar retroalimentación</h3>
      <div class="field"><label>Mensaje</label><textarea id="fb_msg" class="input" rows="4" placeholder="Escribe tu retroalimentación privada..."></textarea></div>
      <button id="fb_send" class="primary-btn">Enviar</button>
    `;
    sec.appendChild(body);
    $('#fb_send').addEventListener('click',()=>{
      const msg = $('#fb_msg').value.trim(); if(!msg){ showToast('warn','Validación','Escribe un mensaje.'); return; }
      state.db.feedback.push({ id: uid('f'), parentId: state.currentUser.id, studentId: state.currentUser.childStudentId, message: msg, date: new Date().toISOString().slice(0,10) });
      saveData(state.db); showToast('success','Enviado','Gracias por tu retroalimentación.'); $('#fb_msg').value='';
    });
  } else {
    // Vista de feedback para admin/docente
    const items = state.db.feedback.map(f=> `<div class="card" style="margin-top:10px"><div class="title">${f.date}</div><p>${f.message}</p></div>`).join('');
    body.innerHTML = `<h3 class="title">Retroalimentación recibida</h3>${items || '<p>No hay mensajes.</p>'}`;
    sec.appendChild(body);
  }
}

// Inicial
switchView('#view-login');


