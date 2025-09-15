// helpers.js - formatos y features

export function formatCurrency(value) {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
}

export function formatDate(dateLike) {
    const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
    return new Intl.DateTimeFormat('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export function applyFeatureFlags() {
    // Funcionalidad simplificada - no hay flags por región
    document.querySelectorAll('[data-feature]').forEach(el => {
        el.style.display = '';
    });
}

// Helper para fetch simplificado
export async function regionalFetch(url, options = {}) {
    const headers = {
        ...(options.headers || {}),
        'X-Country': 'EC',
        'X-Lang': 'es-EC'
    };
    const res = await fetch(url, { ...options, headers });
    return res;
}


