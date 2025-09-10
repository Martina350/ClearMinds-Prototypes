// Sistema de Gestión de Referidos
// Variables globales
let currentUser = null;
let currentRole = null;
const COMISION_POR_ESTUDIANTE = 10; // $10 por estudiante inscrito

// Datos de ejemplo para el prototipo
const DEMO_DATA = {
    docentes: [
        { id: 1, usuario: 'docente1', password: '123', nombre: 'María García' },
        { id: 2, usuario: 'docente2', password: '123', nombre: 'Carlos López' },
        { id: 3, usuario: 'docente3', password: '123', nombre: 'Ana Martínez' }
    ],
    admin: { usuario: 'admin', password: 'admin123', nombre: 'Administrador' },
    estudiantes: [
        {
            id: 1,
            nombre: 'Juan Pérez',
            cedula: '12345678',
            asignatura: 'matematicas',
            fecha: '2024-01-15',
            docenteId: 1,
            estado: 'inscrito'
        },
        {
            id: 2,
            nombre: 'Sofía Rodríguez',
            cedula: '87654321',
            asignatura: 'ingles',
            fecha: '2024-01-16',
            docenteId: 1,
            estado: 'pendiente'
        },
        {
            id: 3,
            nombre: 'Diego González',
            cedula: '11223344',
            asignatura: 'programacion',
            fecha: '2024-01-17',
            docenteId: 2,
            estado: 'inscrito'
        }
    ],
    pagos: [
        {
            id: 1,
            docenteId: 1,
            monto: 20,
            fecha: '2024-01-20',
            estudiantes: 2,
            estado: 'pagado'
        }
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadData();
});

// Inicializar la aplicación
function initializeApp() {
    // Limpiar datos existentes y empezar con datos frescos
    localStorage.removeItem('referidosData');
    localStorage.setItem('referidosData', JSON.stringify(DEMO_DATA));
    
    // Establecer fecha actual en el formulario
    document.getElementById('estudianteFecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('pagoFecha').value = new Date().toISOString().split('T')[0];
}

// Migrar datos de email a cedula
function migrateDataFromEmailToCedula() {
    const data = JSON.parse(localStorage.getItem('referidosData'));
    let needsUpdate = false;
    
    if (data && data.estudiantes) {
        data.estudiantes.forEach(estudiante => {
            if (estudiante.email && !estudiante.cedula) {
                // Generar cédula aleatoria para datos existentes
                estudiante.cedula = Math.floor(10000000 + Math.random() * 90000000).toString();
                delete estudiante.email;
                needsUpdate = true;
            }
        });
        
        if (needsUpdate) {
            saveData(data);
        }
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Login forms
    document.getElementById('docenteLogin').addEventListener('submit', handleDocenteLogin);
    document.getElementById('adminLogin').addEventListener('submit', handleAdminLogin);
    
    // Formulario de referido
    document.getElementById('referidoForm').addEventListener('submit', handleReferidoSubmit);
    
    // Formulario de pago
    document.getElementById('pagoForm').addEventListener('submit', handlePagoSubmit);
}

// Cargar datos desde localStorage
function loadData() {
    const data = JSON.parse(localStorage.getItem('referidosData'));
    if (data) {
        // Los datos se cargan automáticamente cuando se necesitan
        console.log('Datos cargados correctamente');
    }
}

// Guardar datos en localStorage
function saveData(data) {
    localStorage.setItem('referidosData', JSON.stringify(data));
}

// Obtener datos actuales
function getData() {
    return JSON.parse(localStorage.getItem('referidosData'));
}

// Cambiar pestaña de login
function switchLoginTab(tab) {
    const docenteForm = document.getElementById('docenteLogin');
    const adminForm = document.getElementById('adminLogin');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'docente') {
        docenteForm.classList.add('active');
        adminForm.classList.remove('active');
    } else {
        adminForm.classList.add('active');
        docenteForm.classList.remove('active');
    }
}

// Manejar login de docente
function handleDocenteLogin(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('docenteUsuario').value;
    const password = document.getElementById('docentePassword').value;
    
    const data = getData();
    const docente = data.docentes.find(d => d.usuario === usuario && d.password === password);
    
    if (docente) {
        currentUser = docente;
        currentRole = 'docente';
        showScreen('docenteDashboard');
        loadDocenteDashboard();
        showNotification('Bienvenido, ' + docente.nombre, 'success');
    } else {
        showNotification('Credenciales incorrectas', 'error');
    }
}

// Manejar login de administrador
function handleAdminLogin(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('adminUsuario').value;
    const password = document.getElementById('adminPassword').value;
    
    const data = getData();
    
    if (data.admin.usuario === usuario && data.admin.password === password) {
        currentUser = data.admin;
        currentRole = 'admin';
        showScreen('adminDashboard');
        loadAdminDashboard();
        showNotification('Bienvenido, Administrador', 'success');
    } else {
        showNotification('Credenciales incorrectas', 'error');
    }
}

// Mostrar pantalla específica
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Cerrar sesión
function logout() {
    currentUser = null;
    currentRole = null;
    showScreen('loginScreen');
    showNotification('Sesión cerrada correctamente', 'info');
}

// Cargar dashboard del docente
function loadDocenteDashboard() {
    if (currentRole !== 'docente') return;
    
    const data = getData();
    const docenteId = currentUser.id;
    
    // Filtrar estudiantes del docente
    const estudiantesDocente = data.estudiantes.filter(e => e.docenteId === docenteId);
    const inscritos = estudiantesDocente.filter(e => e.estado === 'inscrito');
    
    // Calcular comisiones
    const comisionPendiente = inscritos.length * COMISION_POR_ESTUDIANTE;
    const pagosDocente = data.pagos.filter(p => p.docenteId === docenteId);
    const comisionPagada = pagosDocente.reduce((sum, p) => sum + p.monto, 0);
    
    // Actualizar métricas
    document.getElementById('totalReferidos').textContent = estudiantesDocente.length;
    document.getElementById('totalInscritos').textContent = inscritos.length;
    document.getElementById('comisionPendiente').textContent = '$' + comisionPendiente;
    document.getElementById('comisionPagada').textContent = '$' + comisionPagada;
    document.getElementById('docenteNombre').textContent = currentUser.nombre;
    
    // Cargar tabla de referidos
    loadReferidosTable(estudiantesDocente);
    
    // Cargar historial de pagos
    loadPagosTable(pagosDocente);
}

// Cargar tabla de referidos
function loadReferidosTable(estudiantes) {
    const tbody = document.getElementById('referidosTableBody');
    tbody.innerHTML = '';
    
    estudiantes.forEach(estudiante => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${estudiante.nombre}</td>
            <td>${estudiante.cedula}</td>
            <td>${getAsignaturaNombre(estudiante.asignatura)}</td>
            <td>${formatDate(estudiante.fecha)}</td>
            <td><span class="status ${estudiante.estado}">${estudiante.estado}</span></td>
            <td>$${estudiante.estado === 'inscrito' ? COMISION_POR_ESTUDIANTE : 0}</td>
            <td>
                <button class="action-btn edit" onclick="toggleEstadoEstudiante(${estudiante.id})">
                    <i class="fas fa-${estudiante.estado === 'inscrito' ? 'undo' : 'check'}"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar tabla de pagos
function loadPagosTable(pagos) {
    const tbody = document.getElementById('pagosTableBody');
    tbody.innerHTML = '';
    
    pagos.forEach(pago => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(pago.fecha)}</td>
            <td>$${pago.monto}</td>
            <td>${pago.estudiantes}</td>
            <td><span class="status pagado">${pago.estado}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Manejar envío de referido
function handleReferidoSubmit(e) {
    e.preventDefault();
    
    const data = getData();
    const nuevoEstudiante = {
        id: Date.now(),
        nombre: document.getElementById('estudianteNombre').value,
        cedula: document.getElementById('estudianteCedula').value,
        asignatura: document.getElementById('estudianteAsignatura').value,
        fecha: document.getElementById('estudianteFecha').value,
        docenteId: currentUser.id,
        estado: 'pendiente'
    };
    
    data.estudiantes.push(nuevoEstudiante);
    saveData(data);
    
    // Limpiar formulario
    document.getElementById('referidoForm').reset();
    document.getElementById('estudianteFecha').value = new Date().toISOString().split('T')[0];
    
    // Recargar dashboard
    loadDocenteDashboard();
    
    showNotification('Estudiante referido registrado correctamente', 'success');
}

// Cargar dashboard del administrador
function loadAdminDashboard() {
    if (currentRole !== 'admin') return;
    
    const data = getData();
    
    // Calcular métricas generales
    const totalDocentes = data.docentes.length;
    const docentesActivos = data.docentes.filter(d => 
        data.estudiantes.some(e => e.docenteId === d.id)
    ).length;
    const totalReferidos = data.estudiantes.length;
    const totalComisiones = data.estudiantes
        .filter(e => e.estado === 'inscrito')
        .length * COMISION_POR_ESTUDIANTE;
    
    // Actualizar métricas
    document.getElementById('totalDocentes').textContent = totalDocentes;
    document.getElementById('docentesActivos').textContent = docentesActivos;
    document.getElementById('totalReferidosAdmin').textContent = totalReferidos;
    document.getElementById('totalComisiones').textContent = '$' + totalComisiones;
    
    // Cargar selectores de docentes
    loadDocenteSelectors(data.docentes);
    
    // Cargar tablas
    loadComisionesTable(data);
    loadEstudiantesTable(data.estudiantes);
}

// Cargar selectores de docentes
function loadDocenteSelectors(docentes) {
    const selectors = ['filtroDocente', 'pagoDocente'];
    
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        selector.innerHTML = selectorId === 'filtroDocente' ? 
            '<option value="">Todos los docentes</option>' : 
            '<option value="">Seleccionar docente</option>';
        
        docentes.forEach(docente => {
            const option = document.createElement('option');
            option.value = docente.id;
            option.textContent = docente.nombre;
            selector.appendChild(option);
        });
    });
}

// Cargar tabla de comisiones
function loadComisionesTable(data) {
    const tbody = document.getElementById('comisionesTableBody');
    tbody.innerHTML = '';
    
    data.docentes.forEach(docente => {
        const estudiantesDocente = data.estudiantes.filter(e => e.docenteId === docente.id);
        const inscritos = estudiantesDocente.filter(e => e.estado === 'inscrito');
        const comision = inscritos.length * COMISION_POR_ESTUDIANTE;
        const pagosDocente = data.pagos.filter(p => p.docenteId === docente.id);
        const totalPagado = pagosDocente.reduce((sum, p) => sum + p.monto, 0);
        const pendiente = comision - totalPagado;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${docente.nombre}</td>
            <td>${estudiantesDocente.length}</td>
            <td>${inscritos.length}</td>
            <td>$${comision}</td>
            <td>
                <span class="status ${pendiente > 0 ? 'pendiente' : 'pagado'}">
                    ${pendiente > 0 ? 'Pendiente: $' + pendiente : 'Pagado'}
                </span>
            </td>
            <td>${pagosDocente.length > 0 ? formatDate(pagosDocente[pagosDocente.length - 1].fecha) : '-'}</td>
            <td>
                ${pendiente > 0 ? `
                    <button class="action-btn check" onclick="marcarPago(${docente.id}, ${pendiente})">
                        <i class="fas fa-check"></i>
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar tabla de estudiantes
function loadEstudiantesTable(estudiantes) {
    const tbody = document.getElementById('estudiantesTableBody');
    tbody.innerHTML = '';
    
    const data = getData();
    
    estudiantes.forEach(estudiante => {
        const docente = data.docentes.find(d => d.id === estudiante.docenteId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${estudiante.nombre}</td>
            <td>${estudiante.cedula}</td>
            <td>${getAsignaturaNombre(estudiante.asignatura)}</td>
            <td>${formatDate(estudiante.fecha)}</td>
            <td>${docente ? docente.nombre : 'N/A'}</td>
            <td><span class="status ${estudiante.estado}">${estudiante.estado}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Manejar envío de pago
function handlePagoSubmit(e) {
    e.preventDefault();
    
    const data = getData();
    const nuevoPago = {
        id: Date.now(),
        docenteId: parseInt(document.getElementById('pagoDocente').value),
        monto: parseFloat(document.getElementById('pagoMonto').value),
        fecha: document.getElementById('pagoFecha').value,
        estudiantes: Math.floor(parseFloat(document.getElementById('pagoMonto').value) / COMISION_POR_ESTUDIANTE),
        estado: 'pagado'
    };
    
    data.pagos.push(nuevoPago);
    saveData(data);
    
    // Limpiar formulario
    document.getElementById('pagoForm').reset();
    document.getElementById('pagoFecha').value = new Date().toISOString().split('T')[0];
    
    // Recargar dashboard
    loadAdminDashboard();
    
    showNotification('Pago registrado correctamente', 'success');
}

// Marcar pago automáticamente
function marcarPago(docenteId, monto) {
    const data = getData();
    const nuevoPago = {
        id: Date.now(),
        docenteId: docenteId,
        monto: monto,
        fecha: new Date().toISOString().split('T')[0],
        estudiantes: Math.floor(monto / COMISION_POR_ESTUDIANTE),
        estado: 'pagado'
    };
    
    data.pagos.push(nuevoPago);
    saveData(data);
    
    loadAdminDashboard();
    showNotification('Pago marcado como realizado', 'success');
}

// Toggle estado de estudiante
function toggleEstadoEstudiante(estudianteId) {
    const data = getData();
    const estudiante = data.estudiantes.find(e => e.id === estudianteId);
    
    if (estudiante) {
        estudiante.estado = estudiante.estado === 'inscrito' ? 'pendiente' : 'inscrito';
        saveData(data);
        loadDocenteDashboard();
        
        const estado = estudiante.estado === 'inscrito' ? 'inscrito' : 'pendiente';
        showNotification(`Estudiante marcado como ${estado}`, 'info');
    }
}

// Filtrar comisiones
function filtrarComisiones() {
    const filtroDocente = document.getElementById('filtroDocente').value;
    const filtroEstado = document.getElementById('filtroEstado').value;
    
    const data = getData();
    let docentesFiltrados = data.docentes;
    
    // Filtrar por docente si se selecciona uno específico
    if (filtroDocente) {
        docentesFiltrados = docentesFiltrados.filter(d => d.id == filtroDocente);
    }
    
    // Cargar tabla con filtros aplicados
    loadComisionesTableFiltrada(data, docentesFiltrados, filtroEstado);
    showNotification('Filtros aplicados', 'info');
}

// Cargar tabla de comisiones con filtros
function loadComisionesTableFiltrada(data, docentes, filtroEstado) {
    const tbody = document.getElementById('comisionesTableBody');
    tbody.innerHTML = '';
    
    docentes.forEach(docente => {
        const estudiantesDocente = data.estudiantes.filter(e => e.docenteId === docente.id);
        const inscritos = estudiantesDocente.filter(e => e.estado === 'inscrito');
        const comision = inscritos.length * COMISION_POR_ESTUDIANTE;
        const pagosDocente = data.pagos.filter(p => p.docenteId === docente.id);
        const totalPagado = pagosDocente.reduce((sum, p) => sum + p.monto, 0);
        const pendiente = comision - totalPagado;
        
        // Aplicar filtro de estado
        if (filtroEstado === 'pendiente' && pendiente <= 0) return;
        if (filtroEstado === 'pagado' && pendiente > 0) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${docente.nombre}</td>
            <td>${estudiantesDocente.length}</td>
            <td>${inscritos.length}</td>
            <td>$${comision}</td>
            <td>
                <span class="status ${pendiente > 0 ? 'pendiente' : 'pagado'}">
                    ${pendiente > 0 ? 'Pendiente: $' + pendiente : 'Pagado'}
                </span>
            </td>
            <td>${pagosDocente.length > 0 ? formatDate(pagosDocente[pagosDocente.length - 1].fecha) : '-'}</td>
            <td>
                ${pendiente > 0 ? `
                    <button class="action-btn check" onclick="marcarPago(${docente.id}, ${pendiente})">
                        <i class="fas fa-check"></i>
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filtrar estudiantes
function filtrarEstudiantes() {
    const filtroAsignatura = document.getElementById('filtroAsignatura').value;
    
    const data = getData();
    let estudiantes = data.estudiantes;
    
    if (filtroAsignatura) {
        estudiantes = estudiantes.filter(e => e.asignatura === filtroAsignatura);
    }
    
    loadEstudiantesTable(estudiantes);
    showNotification('Filtros aplicados', 'info');
}

// Limpiar filtros de comisiones
function limpiarFiltrosComisiones() {
    document.getElementById('filtroDocente').value = '';
    document.getElementById('filtroEstado').value = '';
    loadAdminDashboard();
    showNotification('Filtros limpiados', 'info');
}

// Limpiar filtros de estudiantes
function limpiarFiltrosEstudiantes() {
    document.getElementById('filtroAsignatura').value = '';
    const data = getData();
    loadEstudiantesTable(data.estudiantes);
    showNotification('Filtros limpiados', 'info');
}

// Utilidades
function getAsignaturaNombre(asignatura) {
    const nombres = {
        'ingles': 'Inglés',
        'matematicas': 'Matemáticas',
        'robotica': 'Robótica',
        'programacion': 'Programación'
    };
    return nombres[asignatura] || asignatura;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funciones adicionales para funcionalidad completa
function exportData() {
    const data = getData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'referidos_data.json';
    link.click();
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                saveData(data);
                showNotification('Datos importados correctamente', 'success');
                if (currentRole === 'admin') {
                    loadAdminDashboard();
                } else if (currentRole === 'docente') {
                    loadDocenteDashboard();
                }
            } catch (error) {
                showNotification('Error al importar datos', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Funciones de reportes
function generarReporteMensual() {
    const data = getData();
    const mesActual = new Date().getMonth();
    const añoActual = new Date().getFullYear();
    
    const estudiantesMes = data.estudiantes.filter(e => {
        const fecha = new Date(e.fecha);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    });
    
    const reporte = {
        mes: mesActual + 1,
        año: añoActual,
        totalReferidos: estudiantesMes.length,
        totalInscritos: estudiantesMes.filter(e => e.estado === 'inscrito').length,
        comisionesGeneradas: estudiantesMes.filter(e => e.estado === 'inscrito').length * COMISION_POR_ESTUDIANTE
    };
    
    console.log('Reporte mensual:', reporte);
    showNotification('Reporte generado en consola', 'info');
}

// Inicializar funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Agregar funcionalidad de exportar/importar datos
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Exportar Datos';
    exportBtn.className = 'btn btn-secondary';
    exportBtn.onclick = exportData;
    
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.display = 'none';
    importInput.onchange = importData;
    
    const importBtn = document.createElement('button');
    importBtn.textContent = 'Importar Datos';
    importBtn.className = 'btn btn-secondary';
    importBtn.onclick = () => importInput.click();
    
    // Agregar botones a los dashboards
    setTimeout(() => {
        const adminHeader = document.querySelector('#adminDashboard .header-content');
        if (adminHeader) {
            adminHeader.appendChild(exportBtn);
            adminHeader.appendChild(importBtn);
            adminHeader.appendChild(importInput);
        }
    }, 100);
});
