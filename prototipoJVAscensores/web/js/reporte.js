// reporte.js - lógica para generar reporte de OT

document.addEventListener('DOMContentLoaded', async () => {
    const otId = window.location.hash.slice(1);
    if (!otId) {
        document.getElementById('report-content').innerHTML = '<p>OT no especificada.</p>';
        return;
    }

    const data = await window.loadMock();
    const ot = data.ots.find(o => o.id === otId);
    if (!ot) {
        document.getElementById('report-content').innerHTML = '<p>OT no encontrada.</p>';
        return;
    }

    const edificio = data.edificios.find(e => e.id === ot.edificioId);
    const cliente = edificio ? data.clientes.find(c => c.id === edificio.clienteId) : null;
    const tecnico = data.tecnicos.find(t => t.id === ot.tecnicoId);
    const plantilla = data.plantillas.find(p => p.id === ot.plantillaId);

    // Horas reales
    const llegada = ot.eventos.find(e => e.tipo === 'llegada');
    const salida = ot.eventos.find(e => e.tipo === 'salida');
    const horaLlegada = llegada ? new Date(llegada.timestamp).toLocaleString('es') : 'N/A';
    const horaSalida = salida ? new Date(salida.timestamp).toLocaleString('es') : 'N/A';
    const ubicacion = llegada ? `${llegada.lat?.toFixed(4)}, ${llegada.lng?.toFixed(4)}` : 'N/A';

    // Checklist
    const checklistHtml = plantilla ? plantilla.items.map(item => `
        <div class="flex items-center mb-2">
            <input type="checkbox" disabled class="mr-2">
            <span>${item.texto} (${item.obligatorio ? 'Obligatorio' : 'Opcional'})</span>
        </div>
    `).join('') : 'N/A';

    const content = `
        <div class="text-center mb-8">
            <img src="assets/logo.png" alt="Logo" class="mx-auto w-32" onerror="this.style.display='none'">
            <h1 class="text-2xl font-bold">Reporte de Servicio</h1>
        </div>
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-4">Datos del Servicio</h2>
            <p><strong>OT ID:</strong> ${ot.id}</p>
            <p><strong>Tipo:</strong> ${ot.tipo}</p>
            <p><strong>Cliente:</strong> ${cliente ? cliente.nombre : 'N/A'}</p>
            <p><strong>Edificio:</strong> ${edificio ? edificio.direccion : 'N/A'}</p>
            <p><strong>Técnico:</strong> ${tecnico ? tecnico.nombre : 'N/A'}</p>
            <p><strong>Hora de Llegada:</strong> ${horaLlegada}</p>
            <p><strong>Hora de Salida:</strong> ${horaSalida}</p>
            <p><strong>Ubicación Aproximada:</strong> ${ubicacion}</p>
        </div>
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-4">Checklist</h2>
            ${checklistHtml}
            <p><strong>Observaciones:</strong> Ninguna</p>
        </div>
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-4">Firma del Cliente</h2>
            <img src="assets/placeholder-signature.png" alt="Firma" class="border w-64 h-32" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDI1NiAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5GaXJtYSBkZWwgQ2xpZW50ZTwvdGV4dD4KPHN2Zz4=';">
        </div>
    `;

    document.getElementById('report-content').innerHTML = content;

    // Eventos
    document.getElementById('print-btn').addEventListener('click', () => window.print());
    document.getElementById('email-btn').addEventListener('click', () => {
        window.showToast('Reporte enviado por correo al cliente', 'success');
    });
});