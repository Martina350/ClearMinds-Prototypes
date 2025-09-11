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
        { id: 3, usuario: 'docente3', password: '123', nombre: 'Ana Martínez' },
        { id: 4, usuario: 'docente4', password: '123', nombre: 'Roberto Silva' },
        { id: 5, usuario: 'docente5', password: '123', nombre: 'Laura Fernández' },
        { id: 6, usuario: 'docente6', password: '123', nombre: 'Miguel Torres' }
    ],
    admin: { usuario: 'admin', password: 'admin123', nombre: 'Administrador' },
    estudiantes: [
        {
            id: 1,
            nombreCompleto: 'Juan Jose Pérez Alvarado',
            cedula: '12345678',
            colegio: 'Colegio San José',
            curso: 'matematicas',
            telefono: '+56912345678',
            email: 'juan.perez@email.com',
            fecha: '2024-09-01',
            docenteId: 1,
            estado: 'inscrito'
        },
        {
            id: 2,
            nombreCompleto: 'Sofía Daniela Rodríguez Andrade',
            cedula: '87654321',
            colegio: 'Instituto Nacional',
            curso: 'ingles',
            telefono: '+56987654321',
            email: 'sofia.rodriguez@email.com',
            fecha: '2024-09-03',
            docenteId: 1,
            estado: 'referido'
        },
        {
            id: 3,
            nombreCompleto: 'Diego Zamir González Torres',
            cedula: '11223344',
            colegio: 'Liceo Manuel Barros Borgoño',
            curso: 'programacion',
            telefono: '+56911223344',
            email: 'diego.gonzalez@email.com',
            fecha: '2024-09-05',
            docenteId: 1,
            estado: 'inscrito'
        },
        {
            id: 4,
            nombreCompleto: 'Julian Antonio Sanchez Flores',
            cedula: '55667788',
            colegio: 'Colegio San Patricio',
            curso: 'robotica',
            telefono: '+56955667788',
            email: 'julian.sanchez@email.com',
            fecha: '2024-09-10',
            docenteId: 1,
            estado: 'referido'
        },
        {
            id: 5,
            nombreCompleto: 'Valentina Morales Castro',
            cedula: '99887766',
            colegio: 'Liceo Técnico',
            curso: 'ingles',
            telefono: '+56999887766',
            email: 'valentina.morales@email.com',
            fecha: '2024-10-05',
            docenteId: 2,
            estado: 'inscrito'
        },
        {
            id: 6,
            nombreCompleto: 'Sebastián Herrera Ruiz',
            cedula: '55443322',
            colegio: 'Colegio Bilingüe',
            curso: 'matematicas',
            telefono: '+56955443322',
            email: 'sebastian.herrera@email.com',
            fecha: '2024-10-12',
            docenteId: 2,
            estado: 'inscrito'
        },
        {
            id: 7,
            nombreCompleto: 'Camila Vega Díaz',
            cedula: '11223399',
            colegio: 'Instituto Tecnológico',
            curso: 'programacion',
            telefono: '+56911223399',
            email: 'camila.vega@email.com',
            fecha: '2024-11-03',
            docenteId: 3,
            estado: 'referido'
        },
        {
            id: 8,
            nombreCompleto: 'Andrés Castillo Muñoz',
            cedula: '77665544',
            colegio: 'Colegio Científico',
            curso: 'robotica',
            telefono: '+56977665544',
            email: 'andres.castillo@email.com',
            fecha: '2024-11-15',
            docenteId: 3,
            estado: 'inscrito'
        },
        {
            id: 9,
            nombreCompleto: 'Isabella Rojas Paredes',
            cedula: '33445566',
            colegio: 'Liceo Artístico',
            curso: 'lenguaje',
            telefono: '+56933445566',
            email: 'isabella.rojas@email.com',
            fecha: '2024-12-01',
            docenteId: 4,
            estado: 'inscrito'
        },
        {
            id: 10,
            nombreCompleto: 'Matías Espinoza López',
            cedula: '88990011',
            colegio: 'Colegio Deportivo',
            curso: 'matematicas',
            telefono: '+56988990011',
            email: 'matias.espinoza@email.com',
            fecha: '2024-12-08',
            docenteId: 4,
            estado: 'referido'
        },
        {
            id: 11,
            nombreCompleto: 'Sofía Mendoza Torres',
            cedula: '22334455',
            colegio: 'Instituto Musical',
            curso: 'ingles',
            telefono: '+56922334455',
            email: 'sofia.mendoza@email.com',
            fecha: '2024-12-20',
            docenteId: 5,
            estado: 'inscrito'
        },
        {
            id: 12,
            nombreCompleto: 'Nicolás Fuentes Ramos',
            cedula: '66778899',
            colegio: 'Colegio Técnico',
            curso: 'programacion',
            telefono: '+56966778899',
            email: 'nicolas.fuentes@email.com',
            fecha: '2025-01-05',
            docenteId: 5,
            estado: 'inscrito'
        },
        {
            id: 13,
            nombreCompleto: 'Amanda Jiménez Soto',
            cedula: '44556677',
            colegio: 'Liceo Humanista',
            curso: 'robotica',
            telefono: '+56944556677',
            email: 'amanda.jimenez@email.com',
            fecha: '2025-01-12',
            docenteId: 6,
            estado: 'referido'
        },
        {
            id: 14,
            nombreCompleto: 'Diego Morales Vargas',
            cedula: '88991122',
            colegio: 'Colegio Integral',
            curso: 'lenguaje',
            telefono: '+56988991122',
            email: 'diego.morales@email.com',
            fecha: '2025-01-18',
            docenteId: 6,
            estado: 'inscrito'
        }
    ],
    pagos: [
        {
            id: 1,
            docenteId: 1,
            monto: 20,
            fecha: '2024-09-20',
            estudiantes: 2,
            estado: 'pagado'
        },
        {
            id: 2,
            docenteId: 2,
            monto: 20,
            fecha: '2024-10-15',
            estudiantes: 2,
            estado: 'pagado'
        },
        {
            id: 3,
            docenteId: 3,
            monto: 10,
            fecha: '2024-11-25',
            estudiantes: 1,
            estado: 'pagado'
        },
        {
            id: 4,
            docenteId: 4,
            monto: 10,
            fecha: '2024-12-10',
            estudiantes: 1,
            estado: 'pagado'
        },
        {
            id: 5,
            docenteId: 5,
            monto: 20,
            fecha: '2024-12-30',
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
    // Solo inicializar datos si no existen
    if (!localStorage.getItem('referidosData')) {
        localStorage.setItem('referidosData', JSON.stringify(DEMO_DATA));
    }
    
    // Establecer fecha actual en los formularios si existen
    const estudianteFecha = document.getElementById('estudianteFecha');
    const pagoFecha = document.getElementById('pagoFecha');
    
    if (estudianteFecha) {
        estudianteFecha.value = new Date().toISOString().split('T')[0];
    }
    if (pagoFecha) {
        pagoFecha.value = new Date().toISOString().split('T')[0];
    }
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
    
    // Filtros automáticos para docente
    document.addEventListener('change', function(e) {
        if (e.target.id === 'filtroEstado' || e.target.id === 'filtroCurso' || e.target.id === 'filtroFecha') {
            filtrarReferidos();
        }
    });
    
    // Mostrar/ocultar campo "Otro" en materia
    document.addEventListener('change', function(e) {
        if (e.target.id === 'estudianteCurso') {
            const cursoOtroField = document.getElementById('estudianteCursoOtro');
            if (e.target.value === 'otro') {
                cursoOtroField.style.display = 'block';
                cursoOtroField.required = true;
            } else {
                cursoOtroField.style.display = 'none';
                cursoOtroField.required = false;
                cursoOtroField.value = '';
            }
        }
    });
    
    // Solo permitir números en cédula
    document.addEventListener('input', function(e) {
        if (e.target.id === 'estudianteCedula') {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
        }
    });
    
    // Solo permitir números en teléfono
    document.addEventListener('input', function(e) {
        if (e.target.id === 'estudianteTelefono') {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
        }
    });
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
    try {
        localStorage.setItem('referidosData', JSON.stringify(data));
        console.log('Datos guardados exitosamente en localStorage');
        return true;
    } catch (error) {
        console.error('Error al guardar datos:', error);
        showNotification('Error al guardar los datos', 'error');
        return false;
    }
}

// Obtener datos actuales
function getData() {
    try {
        const data = localStorage.getItem('referidosData');
        if (data) {
            const parsedData = JSON.parse(data);
            console.log('Datos cargados desde localStorage:', parsedData);
            return parsedData;
        } else {
            console.log('No hay datos en localStorage, usando DEMO_DATA');
            return DEMO_DATA;
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return DEMO_DATA;
    }
}

// Mostrar formulario de administrador
function showAdminLogin() {
    const docenteForm = document.getElementById('docenteLogin');
    const adminForm = document.getElementById('adminLogin');
    const adminAccessLink = document.querySelector('.admin-access-link');
    
    docenteForm.classList.remove('active');
    adminForm.classList.add('active');
    adminAccessLink.style.display = 'none';
}

// Mostrar formulario de docente
function showDocenteLogin() {
    const docenteForm = document.getElementById('docenteLogin');
    const adminForm = document.getElementById('adminLogin');
    const adminAccessLink = document.querySelector('.admin-access-link');
    
    adminForm.classList.remove('active');
    docenteForm.classList.add('active');
    adminAccessLink.style.display = 'block';
}

// Manejar login de docente
function handleDocenteLogin(e) {
    e.preventDefault();
    
    try {
        const usuario = document.getElementById('docenteUsuario').value;
        const password = document.getElementById('docentePassword').value;
        
        console.log('Intentando login con:', usuario, password);
        
        const data = getData();
        console.log('Datos cargados:', data);
        
        if (!data || !data.docentes) {
            console.error('Error: No se pudieron cargar los datos');
            showNotification('Error al cargar los datos', 'error');
            return;
        }
        
        const docente = data.docentes.find(d => d.usuario === usuario && d.password === password);
        console.log('Docente encontrado:', docente);
        
        if (docente) {
            currentUser = docente;
            currentRole = 'docente';
            console.log('Redirigiendo al dashboard del docente');
            
            // Verificar que el elemento existe antes de intentar mostrarlo
            const dashboardElement = document.getElementById('docenteDashboard');
            if (dashboardElement) {
                showScreen('docenteDashboard');
                loadDocenteDashboard();
                showNotification('Bienvenido, ' + docente.nombre, 'success');
            } else {
                console.error('Error: No se encontró el elemento docenteDashboard');
                showNotification('Error: No se encontró el dashboard', 'error');
            }
        } else {
            console.log('Credenciales incorrectas');
            showNotification('Credenciales incorrectas', 'error');
        }
    } catch (error) {
        console.error('Error en handleDocenteLogin:', error);
        showNotification('Error en el login', 'error');
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
    const comisionTotalGenerada = inscritos.length * COMISION_POR_ESTUDIANTE;
    const pagosDocente = data.pagos.filter(p => p.docenteId === docenteId);
    const comisionPagada = pagosDocente.reduce((sum, p) => sum + p.monto, 0);
    const comisionPendiente = comisionTotalGenerada - comisionPagada;
    
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
    
    // Crear gráfico de evolución mensual
    createMonthlyChart(estudiantesDocente);
}

// Cargar tabla de referidos
function loadReferidosTable(estudiantes) {
    const tbody = document.getElementById('referidosTableBody');
    tbody.innerHTML = '';
    
    console.log('Cargando tabla de referidos con estudiantes:', estudiantes);
    
    estudiantes.forEach(estudiante => {
        const row = document.createElement('tr');
        const nombreCompleto = estudiante.nombreCompleto || 'Nombre no disponible';
        const comision = estudiante.estado === 'inscrito' ? COMISION_POR_ESTUDIANTE : 0;
        const materia = estudiante.curso || 'No especificada';
        
        console.log('Procesando estudiante:', estudiante.nombreCompleto);
        
        row.innerHTML = `
            <td>${nombreCompleto}</td>
            <td><span class="status ${estudiante.estado}">${estudiante.estado}</span></td>
            <td>${materia}</td>
            <td>${formatDate(estudiante.fecha)}</td>
            <td>$${comision}</td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar tabla de pagos
function loadPagosTable(pagos) {
    const tbody = document.getElementById('pagosTableBody');
    tbody.innerHTML = '';
    
    const data = getData();
    const docenteId = currentUser.id;
    
    // Obtener todos los estudiantes inscritos del docente
    const estudiantesInscritos = data.estudiantes.filter(e => e.docenteId === docenteId && e.estado === 'inscrito');
    
    // Calcular comisión total generada
    const comisionTotalGenerada = estudiantesInscritos.length * COMISION_POR_ESTUDIANTE;
    
    // Calcular comisión total pagada
    const comisionTotalPagada = pagos.reduce((sum, p) => sum + p.monto, 0);
    
    // Calcular saldo pendiente
    const saldoPendiente = comisionTotalGenerada - comisionTotalPagada;
    
    // Debug: Log de valores
    console.log('Debug Pagos:', {
        comisionTotalGenerada,
        comisionTotalPagada,
        saldoPendiente,
        docenteId
    });
    
    // Actualizar los elementos del resumen con validaciones
    const saldoPendienteMonto = document.getElementById('saldoPendienteMonto');
    const totalPagadoMonto = document.getElementById('totalPagadoMonto');
    
    console.log('Elementos encontrados:', {
        saldoPendienteMonto: !!saldoPendienteMonto,
        totalPagadoMonto: !!totalPagadoMonto
    });
    
    if (saldoPendienteMonto && typeof saldoPendiente === 'number') {
        saldoPendienteMonto.textContent = '$' + saldoPendiente;
    }
    
    if (totalPagadoMonto && typeof comisionTotalPagada === 'number') {
        totalPagadoMonto.textContent = '$' + comisionTotalPagada;
    }
    
    // Actualizar el saldo actual en la interfaz (elemento original si existe)
    const saldoMontoElement = document.querySelector('#docentePagosContent .saldo-monto');
    if (saldoMontoElement && typeof saldoPendiente === 'number') {
        saldoMontoElement.textContent = '$' + saldoPendiente;
    }
    
    // Generar registros de pagos por mes
    const pagosPorMes = {};
    
    // Agrupar pagos por mes
    pagos.forEach(pago => {
        const fecha = new Date(pago.fecha);
        const mesAño = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        
        if (!pagosPorMes[mesAño]) {
            pagosPorMes[mesAño] = {
                mes: mesAño,
                inscritos: 0,
                comision: 0,
                estado: 'Pagado',
                fechaAbono: formatDate(pago.fecha)
            };
        }
        
        pagosPorMes[mesAño].inscritos += pago.estudiantes;
        pagosPorMes[mesAño].comision += pago.monto;
    });
    
    // Agregar registro de saldo pendiente si existe
    if (saldoPendiente > 0) {
        const mesActual = new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        const estudiantesYaPagados = pagos.reduce((sum, p) => sum + p.estudiantes, 0);
        const estudiantesPendientes = estudiantesInscritos.length - estudiantesYaPagados;
        
        pagosPorMes[mesActual] = {
            mes: mesActual,
            inscritos: estudiantesPendientes,
            comision: saldoPendiente,
            estado: 'Pendiente',
            fechaAbono: '--'
        };
    }
    
    // Convertir a array y ordenar por fecha
    const pagosArray = Object.values(pagosPorMes).sort((a, b) => {
        const fechaA = new Date(a.mes + ' 1');
        const fechaB = new Date(b.mes + ' 1');
        return fechaB - fechaA;
    });
    
    // Si no hay pagos, mostrar mensaje
    if (pagosArray.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
                No hay registros de pagos disponibles
            </td>
        `;
        tbody.appendChild(row);
        return;
    }
    
    // Mostrar los pagos
    pagosArray.forEach((pago, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pago.mes}</td>
            <td>${pago.inscritos}</td>
            <td>$${pago.comision}</td>
            <td><span class="status ${pago.estado.toLowerCase()}">${pago.estado}</span></td>
            <td>${pago.fechaAbono}</td>
        `;
        
        // Agregar evento de clic para mostrar detalles si es un pago realizado
        if (pago.estado === 'Pagado') {
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => mostrarDetallePago(pago, index));
            row.title = 'Hacer clic para ver detalles del pago';
        }
        
        tbody.appendChild(row);
    });
}

// Manejar envío de referido
function handleReferidoSubmit(e) {
    e.preventDefault();
    console.log('Formulario enviado');
    
    // Obtener datos del formulario
    const nombre = document.getElementById('estudianteNombre').value.trim();
    const cedula = document.getElementById('estudianteCedula').value.trim();
    const curso = document.getElementById('estudianteCurso').value;
    const cursoOtro = document.getElementById('estudianteCursoOtro').value.trim();
    const telefono = document.getElementById('estudianteTelefono').value.trim();
    
    console.log('Datos del formulario:', { nombre, cedula, curso, cursoOtro, telefono });
    
    // Validaciones básicas
    if (!nombre) {
        showNotification('Por favor, ingrese el nombre completo', 'error');
        return;
    }
    
    if (!cedula) {
        showNotification('Por favor, ingrese la cédula/pasaporte', 'error');
        return;
    }
    
    // Validar cédula (máximo 10 números)
    const cedulaRegex = /^\d{1,10}$/;
    if (!cedulaRegex.test(cedula)) {
        showNotification('La cédula debe contener máximo 10 números', 'error');
        return;
    }
    
    if (!curso) {
        showNotification('Por favor, seleccione una materia', 'error');
        return;
    }
    
    // Si selecciona "Otro", validar que ingrese la materia
    if (curso === 'otro' && !cursoOtro) {
        showNotification('Por favor, especifique la materia', 'error');
        return;
    }
    
    if (!telefono) {
        showNotification('Por favor, ingrese el teléfono', 'error');
        return;
    }
    
    // Validar teléfono (máximo 9 números después del 593)
    const telefonoRegex = /^\d{1,9}$/;
    if (!telefonoRegex.test(telefono)) {
        showNotification('El teléfono debe contener máximo 9 números', 'error');
        return;
    }
    
    const data = getData();
    console.log('Datos actuales:', data);
    console.log('Usuario actual:', currentUser);
    
    // Determinar el curso final (si es "otro", usar el valor personalizado)
    const cursoFinal = curso === 'otro' ? cursoOtro : curso;
    
    const nuevoEstudiante = {
        id: Date.now(),
        nombre: nombre,
        apellido: '', // No disponible en el formulario actual
        nombreCompleto: nombre,
        cedula: cedula,
        colegio: '', // No disponible en el formulario actual
        curso: cursoFinal,
        telefono: `593${telefono}`, // Agregar prefijo 593
        email: '', // No disponible en el formulario actual
        fecha: new Date().toISOString().split('T')[0],
        docenteId: currentUser.id,
        estado: 'referido'
    };
    
    console.log('Nuevo estudiante:', nuevoEstudiante);
    
    data.estudiantes.push(nuevoEstudiante);
    saveData(data);
    console.log('Datos guardados:', data);
    
    // Limpiar formulario
    document.getElementById('referidoForm').reset();
    
    // Ocultar campo "Otro" si estaba visible
    const cursoOtroField = document.getElementById('estudianteCursoOtro');
    cursoOtroField.style.display = 'none';
    cursoOtroField.required = false;
    cursoOtroField.value = '';
    
    // Mostrar mensaje de éxito
    showNotification('Estudiante registrado exitosamente', 'success');
    
    // Recargar la tabla de referidos para mostrar el nuevo estudiante
    if (typeof loadDocenteDashboard === 'function') {
        loadDocenteDashboard();
    }
    
    // Si estamos en el panel de administrador, recargar también esa vista
    if (currentRole === 'admin') {
        loadAdminDashboard();
    }
}

// Configurar event listeners del administrador
function setupAdminEventListeners() {
    // Filtros automáticos para administrador
    const filtroReferidoEstado = document.getElementById('filtroReferidoEstado');
    const filtroReferidoDocente = document.getElementById('filtroReferidoDocente');
    const filtroReferidoCurso = document.getElementById('filtroReferidoCurso');
    const filtroReferidoMes = document.getElementById('filtroReferidoMes');
    
    if (filtroReferidoEstado) {
        filtroReferidoEstado.addEventListener('change', filtrarReferidosAdmin);
    }
    if (filtroReferidoDocente) {
        filtroReferidoDocente.addEventListener('change', filtrarReferidosAdmin);
    }
    if (filtroReferidoCurso) {
        filtroReferidoCurso.addEventListener('change', filtrarReferidosAdmin);
    }
    if (filtroReferidoMes) {
        filtroReferidoMes.addEventListener('change', filtrarReferidosAdmin);
    }
}

// Cargar dashboard del administrador
function loadAdminDashboard() {
    if (currentRole !== 'admin') return;
    
    const data = getData();
    
    // Calcular métricas generales
    const totalDocentesActivos = data.docentes.filter(d => 
        data.estudiantes.some(e => e.docenteId === d.id)
    ).length;
    const totalAlumnosReferidos = data.estudiantes.length;
    const totalAlumnosInscritos = data.estudiantes.filter(e => e.estado === 'inscrito').length;
    const totalComisionesGeneradas = totalAlumnosInscritos * COMISION_POR_ESTUDIANTE;
    const totalComisionesPagadas = data.pagos.reduce((sum, p) => sum + p.monto, 0);
    const totalComisionesPendientes = totalComisionesGeneradas - totalComisionesPagadas;
    
    // Actualizar métricas
    document.getElementById('totalDocentesActivos').textContent = totalDocentesActivos;
    document.getElementById('totalAlumnosReferidos').textContent = totalAlumnosReferidos;
    document.getElementById('totalAlumnosInscritos').textContent = totalAlumnosInscritos;
    document.getElementById('totalComisionesGeneradas').textContent = '$' + totalComisionesGeneradas;
    document.getElementById('totalComisionesPagadas').textContent = '$' + totalComisionesPagadas;
    document.getElementById('totalComisionesPendientes').textContent = '$' + totalComisionesPendientes;
    
    // Cargar selectores de docentes
    loadDocenteSelectors(data.docentes);
    
    // Cargar gráficos
    createMonthlyInscritosChart(data.estudiantes);
    createCursosChart(data.estudiantes);
    
    // Cargar tablas
    loadDocentesTable(data);
    loadReferidosAdminTable(data);
    loadPagosPendientesTable(data);
    loadHistorialPagosTable(data);
    
    // Configurar event listeners después de cargar el DOM
    setupAdminEventListeners();
}

// Navegación por pestañas del administrador
function showAdminTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    const targetTab = document.getElementById('admin' + tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Content');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
    
    // Recargar datos si es necesario
    if (tabName === 'dashboard') {
        loadAdminDashboard();
    } else if (tabName === 'referidos') {
        // Configurar event listeners para la pestaña de referidos
        setupAdminEventListeners();
    }
}

// Navegación por pestañas del docente
function showDocenteTab(tabName) {
    // Ocultar todas las pestañas del docente
    document.querySelectorAll('#docenteDashboard .admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover clase active de todos los botones del docente
    document.querySelectorAll('#docenteDashboard .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    const targetTab = document.getElementById('docente' + tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Content');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
    
    // Recargar datos si es necesario
    if (tabName === 'dashboard') {
        loadDocenteDashboard();
    } else if (tabName === 'referidos') {
        // Recargar tabla de referidos cuando se accede a esa pestaña
        const data = getData();
        const docenteId = currentUser.id;
        const estudiantesDocente = data.estudiantes.filter(e => e.docenteId === docenteId);
        loadReferidosTable(estudiantesDocente);
    } else if (tabName === 'pagos') {
        // Recargar tabla de pagos cuando se accede a esa pestaña
        const data = getData();
        const pagosDocente = data.pagos.filter(p => p.docenteId === currentUser.id);
        loadPagosTable(pagosDocente);
    }
}

// Cargar selectores de docentes
function loadDocenteSelectors(docentes) {
    const selectors = ['filtroDocente', 'pagoDocente', 'filtroReferidoDocente'];
    
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            selector.innerHTML = selectorId === 'filtroReferidoDocente' ? 
            '<option value="">Todos los docentes</option>' : 
            '<option value="">Seleccionar docente</option>';
        
        docentes.forEach(docente => {
            const option = document.createElement('option');
            option.value = docente.id;
            option.textContent = docente.nombre;
            selector.appendChild(option);
        });
        }
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

// Cargar tabla de docentes para administrador
function loadDocentesTable(data) {
    const tbody = document.getElementById('docentesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.docentes.forEach(docente => {
        const estudiantesDocente = data.estudiantes.filter(e => e.docenteId === docente.id);
        const inscritos = estudiantesDocente.filter(e => e.estado === 'inscrito');
        const comisionGenerada = inscritos.length * COMISION_POR_ESTUDIANTE;
        const pagosDocente = data.pagos.filter(p => p.docenteId === docente.id);
        const comisionPagada = pagosDocente.reduce((sum, p) => sum + p.monto, 0);
        const saldoPendiente = comisionGenerada - comisionPagada;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${docente.nombre}</td>
            <td>${estudiantesDocente.length}</td>
            <td>${inscritos.length}</td>
            <td>$${comisionGenerada}</td>
            <td>$${comisionPagada}</td>
            <td>$${saldoPendiente}</td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar tabla de referidos para administrador
function loadReferidosAdminTable(data) {
    const tbody = document.getElementById('referidosAdminTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Verificar que hay estudiantes
    if (!data.estudiantes || data.estudiantes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
                No hay estudiantes registrados
            </td>
        `;
        tbody.appendChild(row);
        return;
    }
    
    data.estudiantes.forEach(estudiante => {
        // Asegurar que el estudiante tenga la estructura correcta
        const estudianteCompleto = {
            id: estudiante.id,
            nombreCompleto: estudiante.nombreCompleto || estudiante.nombre || 'Nombre no disponible',
            curso: estudiante.curso || 'No especificado',
            estado: estudiante.estado || 'referido',
            fecha: estudiante.fecha || new Date().toISOString().split('T')[0],
            docenteId: estudiante.docenteId || 1
        };
        
        const docente = data.docentes.find(d => d.id === estudianteCompleto.docenteId);
        const comision = estudianteCompleto.estado === 'inscrito' ? COMISION_POR_ESTUDIANTE : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${estudianteCompleto.nombreCompleto}</td>
            <td>${docente ? docente.nombre : 'N/A'}</td>
            <td>${getAsignaturaNombre(estudianteCompleto.curso)}</td>
            <td><span class="status ${estudianteCompleto.estado}">${estudianteCompleto.estado}</span></td>
            <td>${formatDate(estudianteCompleto.fecha)}</td>
            <td>$${comision}</td>
            <td>
                ${estudianteCompleto.estado === 'referido' ? `
                    <div class="action-buttons">
                        <button class="btn-inscribir" onclick="marcarComoInscrito(${estudianteCompleto.id})">
                            <i class="fas fa-check"></i> Inscribir
                        </button>
                        <button class="btn-rechazar" onclick="rechazarEstudiante(${estudianteCompleto.id})">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    </div>
                ` : `
                    <span class="status inscrito">Ya Inscrito</span>
                `}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar tabla de pagos pendientes
function loadPagosPendientesTable(data) {
    const tbody = document.getElementById('pagosPendientesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Verificar que hay docentes
    if (!data.docentes || data.docentes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
                No hay docentes registrados
            </td>
        `;
        tbody.appendChild(row);
        return;
    }
    
    data.docentes.forEach(docente => {
        const estudiantesDocente = data.estudiantes.filter(e => e.docenteId === docente.id);
        const inscritos = estudiantesDocente.filter(e => e.estado === 'inscrito');
        const comisionGenerada = inscritos.length * COMISION_POR_ESTUDIANTE;
        const pagosDocente = data.pagos.filter(p => p.docenteId === docente.id);
        const comisionPagada = pagosDocente.reduce((sum, p) => sum + p.monto, 0);
        const pendiente = comisionGenerada - comisionPagada;
        
        console.log(`Docente: ${docente.nombre}`, {
            estudiantes: estudiantesDocente.length,
            inscritos: inscritos.length,
            comisionGenerada,
            comisionPagada,
            pendiente
        });
        
        const row = document.createElement('tr');
        
        // Solo mostrar docentes que tienen estudiantes inscritos
        if (inscritos.length > 0) {
            if (pendiente > 0) {
                // Docente con pagos pendientes
                row.innerHTML = `
                    <td>${docente.nombre}</td>
                    <td>${inscritos.length}</td>
                    <td>$${comisionGenerada}</td>
                    <td><span class="status pendiente">Pendiente</span></td>
                    <td>
                        <button class="btn-registrar-pago" onclick="abrirModalPago(${docente.id}, '${docente.nombre}', ${pendiente})">
                            <i class="fas fa-money-bill-wave"></i> Registrar Pago
                        </button>
                    </td>
                `;
            } else {
                // Docente completamente pagado
                row.innerHTML = `
                    <td>${docente.nombre}</td>
                    <td>${inscritos.length}</td>
                    <td>$${comisionGenerada}</td>
                    <td><span class="status pagado">Pagado</span></td>
                    <td>
                        <span class="status inscrito">Completamente Pagado</span>
                    </td>
                `;
            }
            tbody.appendChild(row);
        }
    });
    
    // Si no hay filas, mostrar mensaje
    if (tbody.children.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
                No hay docentes con estudiantes inscritos
            </td>
        `;
        tbody.appendChild(row);
    }
}

// Cargar historial de pagos
function loadHistorialPagosTable(data) {
    const tbody = document.getElementById('historialPagosTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.pagos.forEach(pago => {
        const docente = data.docentes.find(d => d.id === pago.docenteId);
        const fecha = new Date(pago.fecha);
        const mesAño = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${mesAño}</td>
            <td>${docente ? docente.nombre : 'N/A'}</td>
            <td>$${pago.monto}</td>
            <td>${formatDate(pago.fecha)}</td>
            <td>
                <button class="action-btn check" onclick="descargarComprobante(${pago.id})">
                    <i class="fas fa-download"></i>
                </button>
            </td>
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

// Filtrar referidos
function filtrarReferidos() {
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroCurso = document.getElementById('filtroCurso').value;
    const filtroFecha = document.getElementById('filtroFecha').value;
    
    const data = getData();
    let estudiantesFiltrados = data.estudiantes.filter(e => e.docenteId === currentUser.id);
    
    if (filtroEstado) {
        estudiantesFiltrados = estudiantesFiltrados.filter(e => e.estado === filtroEstado);
    }
    
    if (filtroCurso) {
        estudiantesFiltrados = estudiantesFiltrados.filter(e => e.curso === filtroCurso);
    }
    
    if (filtroFecha) {
        estudiantesFiltrados = estudiantesFiltrados.filter(e => e.fecha === filtroFecha);
    }
    
    loadReferidosTable(estudiantesFiltrados);
}

// Limpiar filtros de referidos
function limpiarFiltrosReferidos() {
    document.getElementById('filtroEstado').value = '';
    document.getElementById('filtroCurso').value = '';
    document.getElementById('filtroFecha').value = '';
    loadDocenteDashboard();
    showNotification('Filtros limpiados', 'info');
}

// Crear gráfico de evolución mensual para docente
function createMonthlyChart(estudiantes) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;
    
    // Destruir gráfico existente si existe
    if (window.monthlyChartInstance) {
        window.monthlyChartInstance.destroy();
    }
    
    // Datos de ejemplo para los últimos 6 meses
    const meses = ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'];
    const datosInscritos = [2, 4, 3, 6, 5, 10]; // Datos de ejemplo
    const datosReferidos = [5, 7, 4, 8, 6, 12]; // Datos de ejemplo
    
    window.monthlyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [
                {
                    label: 'Inscritos',
                    data: datosInscritos,
                    borderColor: '#ffa617',
                    backgroundColor: 'rgba(255, 166, 23, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Referidos',
                    data: datosReferidos,
                    borderColor: '#4524aa',
                    backgroundColor: 'rgba(69, 36, 170, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Open Sans',
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Open Sans',
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Open Sans',
                            size: 11
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 6,
                    hoverRadius: 8
                }
            }
        }
    });
}

// Crear gráfico de inscritos por mes para administrador
function createMonthlyInscritosChart(estudiantes) {
    const ctx = document.getElementById('monthlyInscritosChart');
    if (!ctx) return;
    
    // Destruir gráfico existente si existe
    if (window.monthlyInscritosChartInstance) {
        window.monthlyInscritosChartInstance.destroy();
    }
    
    // Datos de ejemplo para los 12 meses
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const datosInscritos = [5, 8, 12, 15, 18, 22, 25, 28, 30, 35, 40, 45]; // Datos de ejemplo
    
    window.monthlyInscritosChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [
                {
                    label: 'Alumnos Inscritos',
                    data: datosInscritos,
                    backgroundColor: 'rgba(69, 36, 170, 0.8)',
                    borderColor: '#4524aa',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Open Sans',
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Open Sans',
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Open Sans',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Crear gráfico de distribución por curso
function createCursosChart(estudiantes) {
    const ctx = document.getElementById('cursosChart');
    if (!ctx) return;
    
    // Destruir gráfico existente si existe
    if (window.cursosChartInstance) {
        window.cursosChartInstance.destroy();
    }
    
    // Calcular distribución por curso
    const cursos = ['Inglés', 'Matemáticas', 'Robótica', 'Programación', 'Lenguaje', 'Otro'];
    const datos = [25, 30, 15, 20, 10, 5]; // Datos de ejemplo
    const colores = [
        'rgba(69, 36, 170, 0.8)',
        'rgba(255, 166, 23, 0.8)',
        'rgba(40, 167, 69, 0.8)',
        'rgba(220, 53, 69, 0.8)',
        'rgba(23, 162, 184, 0.8)',
        'rgba(111, 66, 193, 0.8)'
    ];
    
    window.cursosChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: cursos,
            datasets: [
                {
                    data: datos,
                    backgroundColor: colores,
                    borderColor: colores.map(color => color.replace('0.8', '1')),
                    borderWidth: 2,
                    hoverOffset: 10
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Open Sans',
                            size: 12
                        }
                    }
                }
            }
        }
    });
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
    // Generar fecha aleatoria de 2025
    const year = 2025;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const newDate = new Date(year, month - 1, day);
    return newDate.toLocaleDateString('es-ES');
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

// ========================================
// FUNCIONES ESPECÍFICAS DEL DOCENTE
// ========================================

// Mostrar detalle de pago del docente
function mostrarDetallePago(pago, index) {
    const data = getData();
    const docenteId = currentUser.id;
    
    // Obtener estudiantes inscritos del docente para ese período
    const estudiantesInscritos = data.estudiantes.filter(e => e.docenteId === docenteId && e.estado === 'inscrito');
    
    let mensaje = `Detalle del Pago - ${pago.mes}\n\n`;
    mensaje += `Total de estudiantes inscritos: ${pago.inscritos}\n`;
    mensaje += `Comisión por estudiante: $${COMISION_POR_ESTUDIANTE}\n`;
    mensaje += `Total pagado: $${pago.comision}\n`;
    mensaje += `Fecha de pago: ${pago.fechaAbono}\n\n`;
    
    if (pago.estado === 'Pagado') {
        mensaje += `Estudiantes incluidos en este pago:\n`;
        // Mostrar algunos estudiantes como ejemplo
        estudiantesInscritos.slice(0, 5).forEach(estudiante => {
            mensaje += `- ${estudiante.nombreCompleto || estudiante.nombre} (${getAsignaturaNombre(estudiante.curso)})\n`;
        });
        
        if (estudiantesInscritos.length > 5) {
            mensaje += `... y ${estudiantesInscritos.length - 5} estudiantes más\n`;
        }
    }
    
    alert(mensaje);
}

// ========================================
// FUNCIONES ESPECÍFICAS DEL ADMINISTRADOR
// ========================================

// Marcar estudiante como inscrito
function marcarComoInscrito(estudianteId) {
    const data = getData();
    const estudiante = data.estudiantes.find(e => e.id === estudianteId);
    
    if (estudiante) {
        estudiante.estado = 'inscrito';
        saveData(data);
        loadAdminDashboard();
        showNotification('Estudiante marcado como inscrito', 'success');
    }
}

// Rechazar estudiante
function rechazarEstudiante(estudianteId) {
    if (confirm('¿Está seguro de que desea rechazar este estudiante?')) {
        const data = getData();
        data.estudiantes = data.estudiantes.filter(e => e.id !== estudianteId);
        saveData(data);
        loadAdminDashboard();
        showNotification('Estudiante rechazado', 'info');
    }
}

// Abrir modal de pago
function abrirModalPago(docenteId, docenteNombre, monto) {
    const data = getData();
    const docente = data.docentes.find(d => d.id === docenteId);
    const estudiantesInscritos = data.estudiantes.filter(e => e.docenteId === docenteId && e.estado === 'inscrito');
    
    // Llenar datos del modal
    document.getElementById('pagoModalDocente').value = docenteNombre;
    document.getElementById('pagoModalMonto').value = '$' + monto;
    document.getElementById('pagoModalFecha').value = new Date().toISOString().split('T')[0];
    
    // Llenar detalle de alumnos
    const detalleContainer = document.getElementById('pagoModalDetalle');
    detalleContainer.innerHTML = '';
    
    estudiantesInscritos.forEach(estudiante => {
        const item = document.createElement('div');
        item.className = 'pago-detalle-item';
        item.innerHTML = `
            <span>${estudiante.nombreCompleto || estudiante.nombre} - ${getAsignaturaNombre(estudiante.curso)}</span>
            <strong>$${COMISION_POR_ESTUDIANTE}</strong>
        `;
        detalleContainer.appendChild(item);
    });
    
    // Mostrar modal
    document.getElementById('pagoModal').classList.add('active');
    
    // Guardar datos para el formulario
    window.currentPagoData = {
        docenteId: docenteId,
        monto: monto,
        estudiantes: estudiantesInscritos.length
    };
}

// Cerrar modal de pago
function closePagoModal() {
    document.getElementById('pagoModal').classList.remove('active');
    document.getElementById('pagoModalForm').reset();
    window.currentPagoData = null;
}

// Manejar envío del modal de pago
function handlePagoModalSubmit(e) {
    e.preventDefault();
    
    if (!window.currentPagoData) return;
    
    const data = getData();
    const nuevoPago = {
        id: Date.now(),
        docenteId: window.currentPagoData.docenteId,
        monto: window.currentPagoData.monto,
        fecha: document.getElementById('pagoModalFecha').value,
        estudiantes: window.currentPagoData.estudiantes,
        estado: 'pagado',
        comprobante: document.getElementById('pagoModalComprobante').files[0]?.name || 'Sin comprobante'
    };
    
    data.pagos.push(nuevoPago);
    saveData(data);
    
    closePagoModal();
    loadAdminDashboard();
    showNotification('Pago registrado correctamente', 'success');
}

// Ver detalle del docente
function verDetalleDocente(docenteId) {
    const data = getData();
    const docente = data.docentes.find(d => d.id === docenteId);
    const estudiantesDocente = data.estudiantes.filter(e => e.docenteId === docenteId);
    
    let mensaje = `Detalle del Docente: ${docente.nombre}\n\n`;
    mensaje += `Total Referidos: ${estudiantesDocente.length}\n`;
    mensaje += `Total Inscritos: ${estudiantesDocente.filter(e => e.estado === 'inscrito').length}\n\n`;
    mensaje += `Estudiantes:\n`;
    
    estudiantesDocente.forEach(estudiante => {
        mensaje += `- ${estudiante.nombreCompleto || estudiante.nombre} (${estudiante.estado})\n`;
    });
    
    alert(mensaje);
}

// Descargar comprobante
function descargarComprobante(pagoId) {
    showNotification('Funcionalidad de descarga en desarrollo', 'info');
}


// Filtrar referidos del administrador
function filtrarReferidosAdmin() {
    const filtroEstado = document.getElementById('filtroReferidoEstado')?.value || '';
    const filtroDocente = document.getElementById('filtroReferidoDocente')?.value || '';
    const filtroCurso = document.getElementById('filtroReferidoCurso')?.value || '';
    const filtroMes = document.getElementById('filtroReferidoMes')?.value || '';
    
    const data = getData();
    let estudiantesFiltrados = data.estudiantes || [];
    
    console.log('Filtros aplicados:', { filtroEstado, filtroDocente, filtroCurso, filtroMes });
    console.log('Estudiantes antes del filtrado:', estudiantesFiltrados.length);
    
    // Aplicar filtros
    if (filtroEstado) {
        estudiantesFiltrados = estudiantesFiltrados.filter(e => {
            const estado = e.estado || 'referido';
            return estado === filtroEstado;
        });
    }
    
    if (filtroDocente) {
        estudiantesFiltrados = estudiantesFiltrados.filter(e => {
            const docenteId = e.docenteId || 1;
            return docenteId == filtroDocente;
        });
    }
    
    if (filtroCurso) {
        estudiantesFiltrados = estudiantesFiltrados.filter(e => {
            const curso = e.curso || '';
            return curso === filtroCurso;
        });
    }
    
    if (filtroMes) {
        estudiantesFiltrados = estudiantesFiltrados.filter(e => {
            const fecha = e.fecha || new Date().toISOString().split('T')[0];
            const fechaEstudiante = new Date(fecha);
            const mesAñoEstudiante = fechaEstudiante.getFullYear() + '-' + String(fechaEstudiante.getMonth() + 1).padStart(2, '0');
            return mesAñoEstudiante === filtroMes;
        });
    }
    
    console.log('Estudiantes después del filtrado:', estudiantesFiltrados.length);
    
    loadReferidosAdminTable({ ...data, estudiantes: estudiantesFiltrados });
    showNotification('Filtros aplicados', 'info');
}

// Limpiar filtros de referidos del administrador
function limpiarFiltrosReferidosAdmin() {
    const filtroEstado = document.getElementById('filtroReferidoEstado');
    const filtroDocente = document.getElementById('filtroReferidoDocente');
    const filtroCurso = document.getElementById('filtroReferidoCurso');
    const filtroMes = document.getElementById('filtroReferidoMes');
    
    if (filtroEstado) filtroEstado.value = '';
    if (filtroDocente) filtroDocente.value = '';
    if (filtroCurso) filtroCurso.value = '';
    if (filtroMes) filtroMes.value = '';
    
    // Recargar todos los estudiantes
    const data = getData();
    loadReferidosAdminTable(data);
    showNotification('Filtros limpiados', 'info');
}

// Configurar event listeners adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para el formulario del modal de pago
    const pagoModalForm = document.getElementById('pagoModalForm');
    if (pagoModalForm) {
        pagoModalForm.addEventListener('submit', handlePagoModalSubmit);
    }
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('pagoModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePagoModal();
            }
        });
    }
});
