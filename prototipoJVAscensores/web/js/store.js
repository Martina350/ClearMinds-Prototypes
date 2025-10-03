// store.js - carga de mocks y estado in-memory

let state = null;

async function loadMock() {
    if (state) return state;
    const response = await fetch('./data/mock.json');
    state = await response.json();
    return state;
}

function persistMock() {
    // opcional: guardar en localStorage para simular cambios
    if (state) {
        localStorage.setItem('mockData', JSON.stringify(state));
    }
}

function getState() {
    return state;
}

function updateState(newState) {
    state = { ...state, ...newState };
    persistMock();
}

// exponer globalmente
window.loadMock = loadMock;
window.persistMock = persistMock;
window.getState = getState;
window.updateState = updateState;