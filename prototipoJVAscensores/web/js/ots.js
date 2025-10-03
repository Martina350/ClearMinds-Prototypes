// ots.js - lógica para lista de OTs

let data;
let filteredOts = [];

document.addEventListener('DOMContentLoaded', async () => {
    data = await window.loadMock();
    populateFilters();
    renderOtsTable();

    // Eventos de filtro
    ['filter-estado', 'filter-cliente', 'filter-tecnico'].forEach(id => {
        document.getElementById(id).addEventListener('change', renderOtsTable);
    });
});

function populateFilters() {
    const clienteSelect = document.getElementById('filter-cliente');
    data.clientes.forEach(c => {
        clienteSelect.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });
    const tecnicoSelect = document.getElementById('filter-tecnico');
    data.tecnicos.forEach(t => {
        tecnicoSelect.innerHTML += `<option value="${t.id}">${t.nombre}</option>`;
    });
}

function renderOtsTable() {
    const estado = document.getElementById('filter-estado').value;
    const cliente = document.getElementById('filter-cliente').value;
    const tecnico = document.getElementById('filter-tecnico').value;

    filteredOts = data.ots.filter(ot => {
        const edificio = data.edificios.find(e => e.id === ot.edificioId);
        const cliId = edificio ? edificio.clienteId : '';
        return (!estado || ot.estado === estado) &&
               (!cliente || cliId === cliente) &&
               (!tecnico || ot.tecnicoId === tecnico);
    });

    const tbody = document.getElementById('ots-table');
    tbody.innerHTML = filteredOts.map(ot => {
        const edificio = data.edificios.find(e => e.id === ot.edificioId);
        const tec = data.tecnicos.find(t => t.id === ot.tecnicoId);
        const fecha = new Date(ot.programada).toLocaleDateString('es');
        return `
            <tr>
                <td class="p-2">${ot.id}</td>
                <td class="p-2">${ot.tipo}</td>
                <td class="p-2">${edificio ? edificio.direccion : 'N/A'}</td>
                <td class="p-2">${tec ? tec.nombre : 'N/A'}</td>
                <td class="p-2">${ot.estado}</td>
                <td class="p-2">${fecha}</td>
                <td class="p-2">
                    <button class="text-blue-600 mr-2" onclick="viewDetalle('${ot.id}')">Ver Detalle</button>
                    <button class="text-green-600" onclick="viewReporte('${ot.id}')">Ver Reporte</button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewDetalle(otId) {
    const ot = data.ots.find(o => o.id === otId);
    if (!ot) return;
    const eventosStr = ot.eventos.map(e => `${e.tipo}: ${new Date(e.timestamp).toLocaleString('es')}`).join('<br>');
    window.showModal('Detalle de OT', `<div>${eventosStr}</div>`);
}

function viewReporte(otId) {
    window.location.href = 'reporte.html#' + otId;
}

// Exponer
window.viewDetalle = viewDetalle;
window.viewReporte = viewReporte;