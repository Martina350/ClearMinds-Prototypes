// ui.js - componentes pequeños (modales, toasts)

function showModal(title, content, onClose) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 class="text-lg font-semibold mb-4">${title}</h3>
            <div>${content}</div>
            <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onclick="closeModal()">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
    window.closeModal = () => {
        document.body.removeChild(modal);
        if (onClose) onClose();
    };
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 p-4 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (document.body.contains(toast)) document.body.removeChild(toast);
    }, 3000);
}

// exponer
window.showModal = showModal;
window.showToast = showToast;