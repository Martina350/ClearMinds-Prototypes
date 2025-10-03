// plantillas.js - lógica para plantillas de checklist

let data;

document.addEventListener('DOMContentLoaded', async () => {
    data = await window.loadMock();
    renderPlantillas();

    document.getElementById('add-plantilla').addEventListener('click', () => showAddPlantillaModal());
});

function renderPlantillas() {
    const tbody = document.getElementById('plantillas-table');
    tbody.innerHTML = '';
    data.plantillas.forEach(plantilla => {
        const cliente = plantilla.clienteId ? data.clientes.find(c => c.id === plantilla.clienteId)?.nombre : 'General';
        const itemsStr = plantilla.items.map(item => `${item.texto} (${item.obligatorio ? 'Obligatorio' : 'Opcional'})`).join('<br>');
        const row = `
            <tr>
                <td class="p-2">${plantilla.nombre}</td>
                <td class="p-2">${cliente}</td>
                <td class="p-2">${itemsStr}</td>
                <td class="p-2">
                    <button class="text-blue-600 mr-2" onclick="editPlantilla('${plantilla.id}')">Editar</button>
                    <button class="text-red-600" onclick="deletePlantilla('${plantilla.id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function showAddPlantillaModal() {
    const clienteOptions = '<option value="">General</option>' + data.clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    const content = `
        <form id="plantilla-form">
            <input type="text" name="nombre" placeholder="Nombre de la plantilla" class="border p-2 w-full mb-2" required>
            <select name="clienteId" class="border p-2 w-full mb-2">
                ${clienteOptions}
            </select>
            <h4 class="font-semibold mb-2">Ítems del Checklist</h4>
            <div id="items-list" class="mb-2"></div>
            <div class="flex gap-2 mb-2">
                <input type="text" id="item-text" placeholder="Texto del ítem" class="border p-2 flex-1">
                <label><input type="checkbox" id="item-obligatorio"> Obligatorio</label>
                <button type="button" id="add-item" class="bg-gray-600 text-white px-2 py-1 rounded">Agregar Ítem</button>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar Plantilla</button>
        </form>
    `;
    window.showModal('Agregar Plantilla', content);
    const items = [];
    document.getElementById('add-item').addEventListener('click', () => {
        const text = document.getElementById('item-text').value.trim();
        const obligatorio = document.getElementById('item-obligatorio').checked;
        if (text) {
            items.push({ id: 'it-' + Date.now(), texto: text, obligatorio });
            renderItemsList(items);
            document.getElementById('item-text').value = '';
            document.getElementById('item-obligatorio').checked = false;
        }
    });
    document.getElementById('plantilla-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const plantilla = {
            id: 'pl-' + Date.now(),
            nombre: formData.get('nombre'),
            clienteId: formData.get('clienteId') || null,
            items: items
        };
        data.plantillas.push(plantilla);
        window.updateState({ plantillas: data.plantillas });
        renderPlantillas();
        window.closeModal();
        window.showToast('Plantilla agregada', 'success');
    });
}

function renderItemsList(items) {
    const list = document.getElementById('items-list');
    list.innerHTML = items.map(item => `<div class="flex justify-between p-1 bg-gray-100 rounded mb-1">
        <span>${item.texto} (${item.obligatorio ? 'Obl' : 'Opt'})</span>
        <button type="button" onclick="removeItem('${item.id}')" class="text-red-600">X</button>
    </div>`).join('');
    window.removeItem = (id) => {
        const index = items.findIndex(i => i.id === id);
        if (index > -1) items.splice(index, 1);
        renderItemsList(items);
    };
}

function editPlantilla(id) {
    const plantilla = data.plantillas.find(p => p.id === id);
    if (!plantilla) return;
    const clienteOptions = '<option value="">General</option>' + data.clientes.map(c => `<option value="${c.id}" ${c.id === plantilla.clienteId ? 'selected' : ''}>${c.nombre}</option>`).join('');
    const content = `
        <form id="plantilla-form">
            <input type="text" name="nombre" value="${plantilla.nombre}" class="border p-2 w-full mb-2" required>
            <select name="clienteId" class="border p-2 w-full mb-2">
                ${clienteOptions}
            </select>
            <h4 class="font-semibold mb-2">Ítems del Checklist</h4>
            <div id="items-list" class="mb-2"></div>
            <div class="flex gap-2 mb-2">
                <input type="text" id="item-text" placeholder="Texto del ítem" class="border p-2 flex-1">
                <label><input type="checkbox" id="item-obligatorio"> Obligatorio</label>
                <button type="button" id="add-item" class="bg-gray-600 text-white px-2 py-1 rounded">Agregar Ítem</button>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Actualizar Plantilla</button>
        </form>
    `;
    window.showModal('Editar Plantilla', content);
    let items = [...plantilla.items];
    renderItemsList(items);
    document.getElementById('add-item').addEventListener('click', () => {
        const text = document.getElementById('item-text').value.trim();
        const obligatorio = document.getElementById('item-obligatorio').checked;
        if (text) {
            items.push({ id: 'it-' + Date.now(), texto: text, obligatorio });
            renderItemsList(items);
            document.getElementById('item-text').value = '';
            document.getElementById('item-obligatorio').checked = false;
        }
    });
    document.getElementById('plantilla-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        plantilla.nombre = formData.get('nombre');
        plantilla.clienteId = formData.get('clienteId') || null;
        plantilla.items = items;
        window.updateState({ plantillas: data.plantillas });
        renderPlantillas();
        window.closeModal();
        window.showToast('Plantilla actualizada', 'success');
    });
}

function deletePlantilla(id) {
    if (confirm('¿Eliminar plantilla?')) {
        data.plantillas = data.plantillas.filter(p => p.id !== id);
        window.updateState({ plantillas: data.plantillas });
        renderPlantillas();
        window.showToast('Plantilla eliminada', 'success');
    }
}

// Exponer
window.editPlantilla = editPlantilla;
window.deletePlantilla = deletePlantilla;