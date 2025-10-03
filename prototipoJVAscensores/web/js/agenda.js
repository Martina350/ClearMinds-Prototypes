// agenda.js - lógica para agenda y rutas

let data;
let currentDate = '2025-10-03';

document.addEventListener('DOMContentLoaded', async () => {
    data = await window.loadMock();
    document.getElementById('load-agenda').addEventListener('click', () => {
        currentDate = document.getElementById('agenda-date').value;
        loadAgenda(currentDate);
    });
    loadAgenda(currentDate);
});

function loadAgenda(date) {
    const content = document.getElementById('agenda-content');
    content.innerHTML = '';

    // Group OTs by tecnico for the date
    const dayOts = data.ots.filter(ot => ot.programada.startsWith(date));
    const byTecnico = {};
    data.tecnicos.forEach(tec => {
        byTecnico[tec.id] = dayOts.filter(ot => ot.tecnicoId === tec.id);
    });

    Object.keys(byTecnico).forEach(tecId => {
        const tec = data.tecnicos.find(t => t.id === tecId);
        const ots = byTecnico[tecId];
        const section = document.createElement('div');
        section.className = 'mb-8 bg-white p-4 rounded shadow';
        section.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">${tec.nombre}</h3>
            <div class="mb-2">
                <button class="bg-green-600 text-white px-3 py-1 rounded mr-2" onclick="optimizeRoute('${tecId}')">Optimizar Ruta</button>
                <button class="bg-purple-600 text-white px-3 py-1 rounded" onclick="suggestCandidates('${tecId}')">Sugerir Candidatos</button>
            </div>
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="p-2 text-left">Edificio</th>
                        <th class="p-2 text-left">Hora</th>
                        <th class="p-2 text-left">Estado</th>
                        <th class="p-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody id="ots-${tecId}">
                    ${renderOtsTable(ots)}
                </tbody>
            </table>
        `;
        content.appendChild(section);
    });
}

function renderOtsTable(ots) {
    return ots.map(ot => {
        const edificio = data.edificios.find(e => e.id === ot.edificioId);
        const hora = new Date(ot.programada).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
        return `
            <tr>
                <td class="p-2">${edificio ? edificio.direccion : 'N/A'}</td>
                <td class="p-2">${hora}</td>
                <td class="p-2">${ot.estado}</td>
                <td class="p-2">
                    <button class="text-red-600 mr-2" onclick="cancelOt('${ot.id}')">Cancelar</button>
                    <button class="text-blue-600" onclick="reassignOt('${ot.id}')">Reasignar</button>
                </td>
            </tr>
        `;
    }).join('');
}

function optimizeRoute(tecId) {
    const ots = data.ots.filter(ot => ot.tecnicoId === tecId && ot.programada.startsWith(currentDate));
    if (ots.length < 2) {
        window.showToast('No hay suficientes OTs para optimizar', 'error');
        return;
    }
    // Enrich with edificio
    const enriched = ots.map(ot => ({
        ...ot,
        edificio: data.edificios.find(e => e.id === ot.edificioId)
    }));
    const optimized = window.optimizeRoute(enriched);
    // Update order in data (sort by optimized order, but since no order field, perhaps update programada times)
    // For simplicity, just reorder the array
    const tecOts = data.ots.filter(ot => ot.tecnicoId === tecId && ot.programada.startsWith(currentDate));
    tecOts.sort((a, b) => {
        const idxA = optimized.findIndex(o => o.id === a.id);
        const idxB = optimized.findIndex(o => o.id === b.id);
        return idxA - idxB;
    });
    // Update tbody
    document.getElementById(`ots-${tecId}`).innerHTML = renderOtsTable(tecOts);
    window.updateState({ ots: data.ots });
    window.showToast('Ruta optimizada', 'success');
}

function suggestCandidates(tecId) {
    const ots = data.ots.filter(ot => ot.tecnicoId === tecId && ot.programada.startsWith(currentDate));
    if (ots.length === 0) {
        window.showToast('No hay OTs para este técnico', 'error');
        return;
    }
    // Use last OT position or average
    const lastOt = ots[ots.length - 1];
    const edificio = data.edificios.find(e => e.id === lastOt.edificioId);
    const punto = edificio ? { lat: edificio.lat, lng: edificio.lng } : { lat: 0, lng: 0 };
    const candidatos = window.sugerirCandidatos(punto, data.edificios.filter(e => !ots.some(ot => ot.edificioId === e.id)), 5);
    const content = candidatos.map(c => {
        const ed = data.edificios.find(e => e.id === c.edificioId);
        return `<div>${ed.direccion} - Dist: ${Math.round(c.distanciaM)}m, Score: ${c.score.toFixed(2)}</div>`;
    }).join('');
    window.showModal('Candidatos Sugeridos', content);
}

function cancelOt(otId) {
    const ot = data.ots.find(o => o.id === otId);
    if (ot) {
        ot.estado = 'cancelada';
        ot.eventos.push({ tipo: 'cancelada', timestamp: new Date().toISOString() });
        window.updateState({ ots: data.ots });
        loadAgenda(currentDate);
        window.showToast('OT cancelada', 'success');
    }
}

function reassignOt(otId) {
    const tecOptions = data.tecnicos.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');
    const content = `
        <select id="new-tecnico" class="border p-2 w-full mb-2">${tecOptions}</select>
        <button onclick="doReassign('${otId}')" class="bg-blue-600 text-white px-4 py-2 rounded">Reasignar</button>
    `;
    window.showModal('Reasignar OT', content);
}

function doReassign(otId) {
    const newTecId = document.getElementById('new-tecnico').value;
    const ot = data.ots.find(o => o.id === otId);
    if (ot) {
        ot.tecnicoId = newTecId;
        window.updateState({ ots: data.ots });
        loadAgenda(currentDate);
        window.closeModal();
        window.showToast('OT reasignada', 'success');
    }
}

// Exponer
window.optimizeRoute = optimizeRoute;
window.suggestCandidates = suggestCandidates;
window.cancelOt = cancelOt;
window.reassignOt = reassignOt;
window.doReassign = doReassign;