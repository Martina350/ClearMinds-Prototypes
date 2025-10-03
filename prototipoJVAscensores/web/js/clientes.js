// clientes.js - lógica para clientes y edificios

let data;

document.addEventListener('DOMContentLoaded', async () => {
    data = await window.loadMock();
    renderClientes();
    renderEdificios();
    populateEdificiosSelects();

    // Eventos
    document.getElementById('search-clientes').addEventListener('input', renderClientes);
    document.getElementById('add-cliente').addEventListener('click', () => showAddClienteModal());
    document.getElementById('add-edificio').addEventListener('click', () => showAddEdificioModal());
    document.getElementById('calc-dist').addEventListener('click', calculateDistance);
});

function renderClientes() {
    const search = document.getElementById('search-clientes').value.toLowerCase();
    const tbody = document.getElementById('clientes-table');
    tbody.innerHTML = '';
    data.clientes.filter(c => c.nombre.toLowerCase().includes(search)).forEach(cliente => {
        const edificiosCount = data.edificios.filter(e => e.clienteId === cliente.id).length;
        const row = `
            <tr>
                <td class="p-2">${cliente.nombre}</td>
                <td class="p-2">${cliente.email}</td>
                <td class="p-2">${cliente.contacto}</td>
                <td class="p-2">${edificiosCount}</td>
                <td class="p-2">
                    <button class="text-blue-600 mr-2" onclick="editCliente('${cliente.id}')">Editar</button>
                    <button class="text-red-600" onclick="deleteCliente('${cliente.id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function renderEdificios() {
    const tbody = document.getElementById('edificios-table');
    tbody.innerHTML = '';
    data.edificios.forEach(edificio => {
        const cliente = data.clientes.find(c => c.id === edificio.clienteId);
        const ventanasStr = edificio.ventanas.map(v => `${v.dia} ${v.desde}-${v.hasta}`).join(', ');
        const row = `
            <tr>
                <td class="p-2">${edificio.direccion}</td>
                <td class="p-2">${cliente ? cliente.nombre : 'N/A'}</td>
                <td class="p-2">${edificio.lat}, ${edificio.lng}</td>
                <td class="p-2">${ventanasStr}</td>
                <td class="p-2">${edificio.duracionMin} min</td>
                <td class="p-2">
                    <button class="text-blue-600 mr-2" onclick="editEdificio('${edificio.id}')">Editar</button>
                    <button class="text-red-600" onclick="deleteEdificio('${edificio.id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function populateEdificiosSelects() {
    const selects = ['edif1', 'edif2'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Seleccionar Edificio</option>';
        data.edificios.forEach(e => {
            select.innerHTML += `<option value="${e.id}">${e.direccion}</option>`;
        });
    });
}

function showAddClienteModal() {
    const content = `
        <form id="cliente-form">
            <input type="text" name="nombre" placeholder="Nombre" class="border p-2 w-full mb-2" required>
            <input type="email" name="email" placeholder="Email" class="border p-2 w-full mb-2" required>
            <input type="text" name="contacto" placeholder="Contacto" class="border p-2 w-full mb-2" required>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        </form>
    `;
    window.showModal('Agregar Cliente', content);
    document.getElementById('cliente-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const cliente = {
            id: 'cli-' + Date.now(),
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            contacto: formData.get('contacto')
        };
        data.clientes.push(cliente);
        window.updateState({ clientes: data.clientes });
        renderClientes();
        window.closeModal();
        window.showToast('Cliente agregado', 'success');
    });
}

function showAddEdificioModal() {
    const clienteOptions = data.clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    const content = `
        <form id="edificio-form">
            <select name="clienteId" class="border p-2 w-full mb-2" required>
                <option value="">Seleccionar Cliente</option>${clienteOptions}
            </select>
            <input type="text" name="direccion" placeholder="Dirección" class="border p-2 w-full mb-2" required>
            <input type="number" step="0.0001" name="lat" placeholder="Latitud" class="border p-2 w-full mb-2" required>
            <input type="number" step="0.0001" name="lng" placeholder="Longitud" class="border p-2 w-full mb-2" required>
            <input type="text" name="dia" placeholder="Día (ej: Lun-Vie)" class="border p-2 w-full mb-2" required>
            <input type="text" name="desde" placeholder="Desde (HH:mm)" class="border p-2 w-full mb-2" required>
            <input type="text" name="hasta" placeholder="Hasta (HH:mm)" class="border p-2 w-full mb-2" required>
            <input type="number" name="duracionMin" placeholder="Duración min" class="border p-2 w-full mb-2" required>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
        </form>
    `;
    window.showModal('Agregar Edificio', content);
    document.getElementById('edificio-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const edificio = {
            id: 'edi-' + Date.now(),
            clienteId: formData.get('clienteId'),
            direccion: formData.get('direccion'),
            lat: parseFloat(formData.get('lat')),
            lng: parseFloat(formData.get('lng')),
            ventanas: [{ dia: formData.get('dia'), desde: formData.get('desde'), hasta: formData.get('hasta') }],
            duracionMin: parseInt(formData.get('duracionMin'))
        };
        data.edificios.push(edificio);
        window.updateState({ edificios: data.edificios });
        renderEdificios();
        populateEdificiosSelects();
        window.closeModal();
        window.showToast('Edificio agregado', 'success');
    });
}

function editCliente(id) {
    const cliente = data.clientes.find(c => c.id === id);
    if (!cliente) return;
    // Similar to add, prefill
    const content = `
        <form id="cliente-form">
            <input type="text" name="nombre" value="${cliente.nombre}" class="border p-2 w-full mb-2" required>
            <input type="email" name="email" value="${cliente.email}" class="border p-2 w-full mb-2" required>
            <input type="text" name="contacto" value="${cliente.contacto}" class="border p-2 w-full mb-2" required>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Actualizar</button>
        </form>
    `;
    window.showModal('Editar Cliente', content);
    document.getElementById('cliente-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        cliente.nombre = formData.get('nombre');
        cliente.email = formData.get('email');
        cliente.contacto = formData.get('contacto');
        window.updateState({ clientes: data.clientes });
        renderClientes();
        window.closeModal();
        window.showToast('Cliente actualizado', 'success');
    });
}

function deleteCliente(id) {
    if (confirm('¿Eliminar cliente?')) {
        data.clientes = data.clientes.filter(c => c.id !== id);
        window.updateState({ clientes: data.clientes });
        renderClientes();
        window.showToast('Cliente eliminado', 'success');
    }
}

function editEdificio(id) {
    const edificio = data.edificios.find(e => e.id === id);
    if (!edificio) return;
    const clienteOptions = data.clientes.map(c => `<option value="${c.id}" ${c.id === edificio.clienteId ? 'selected' : ''}>${c.nombre}</option>`).join('');
    const v = edificio.ventanas[0] || {};
    const content = `
        <form id="edificio-form">
            <select name="clienteId" class="border p-2 w-full mb-2" required>
                ${clienteOptions}
            </select>
            <input type="text" name="direccion" value="${edificio.direccion}" class="border p-2 w-full mb-2" required>
            <input type="number" step="0.0001" name="lat" value="${edificio.lat}" class="border p-2 w-full mb-2" required>
            <input type="number" step="0.0001" name="lng" value="${edificio.lng}" class="border p-2 w-full mb-2" required>
            <input type="text" name="dia" value="${v.dia || ''}" class="border p-2 w-full mb-2" required>
            <input type="text" name="desde" value="${v.desde || ''}" class="border p-2 w-full mb-2" required>
            <input type="text" name="hasta" value="${v.hasta || ''}" class="border p-2 w-full mb-2" required>
            <input type="number" name="duracionMin" value="${edificio.duracionMin}" class="border p-2 w-full mb-2" required>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Actualizar</button>
        </form>
    `;
    window.showModal('Editar Edificio', content);
    document.getElementById('edificio-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        edificio.clienteId = formData.get('clienteId');
        edificio.direccion = formData.get('direccion');
        edificio.lat = parseFloat(formData.get('lat'));
        edificio.lng = parseFloat(formData.get('lng'));
        edificio.ventanas = [{ dia: formData.get('dia'), desde: formData.get('desde'), hasta: formData.get('hasta') }];
        edificio.duracionMin = parseInt(formData.get('duracionMin'));
        window.updateState({ edificios: data.edificios });
        renderEdificios();
        populateEdificiosSelects();
        window.closeModal();
        window.showToast('Edificio actualizado', 'success');
    });
}

function deleteEdificio(id) {
    if (confirm('¿Eliminar edificio?')) {
        data.edificios = data.edificios.filter(e => e.id !== id);
        window.updateState({ edificios: data.edificios });
        renderEdificios();
        populateEdificiosSelects();
        window.showToast('Edificio eliminado', 'success');
    }
}

function calculateDistance() {
    const id1 = document.getElementById('edif1').value;
    const id2 = document.getElementById('edif2').value;
    if (!id1 || !id2 || id1 === id2) {
        document.getElementById('dist-result').textContent = 'Selecciona dos edificios diferentes.';
        return;
    }
    const e1 = data.edificios.find(e => e.id === id1);
    const e2 = data.edificios.find(e => e.id === id2);
    if (!e1 || !e2) return;
    const dist = window.haversine({ lat: e1.lat, lng: e1.lng }, { lat: e2.lat, lng: e2.lng });
    document.getElementById('dist-result').textContent = `Distancia: ${Math.round(dist)} metros.`;
}

// Exponer funciones globales
window.editCliente = editCliente;
window.deleteCliente = deleteCliente;
window.editEdificio = editEdificio;
window.deleteEdificio = deleteEdificio;