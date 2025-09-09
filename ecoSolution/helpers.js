// helpers.js - formatos y features
import { getRegion } from './region.js';

export const countryCurrency = {
    US: 'USD',
    CA: 'CAD',
    PE: 'PEN',
    EC: 'USD'
};

export function formatCurrency(value) {
    const { country, lang } = getRegion();
    const currency = countryCurrency[country] || 'USD';
    return new Intl.NumberFormat(lang, { style: 'currency', currency }).format(value);
}

export function formatDate(dateLike) {
    const { lang } = getRegion();
    const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
    return new Intl.DateTimeFormat(lang, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export const features = {
    US: { carpetCleaning: true },
    CA: { carpetCleaning: true },
    PE: { carpetCleaning: false },
    EC: { carpetCleaning: false }
};

export function applyFeatureFlags() {
    const { country } = getRegion();
    const active = features[country] || {};
    document.querySelectorAll('[data-feature]').forEach(el => {
        const name = el.getAttribute('data-feature');
        const enabled = !!active[name];
        el.style.display = enabled ? '' : 'none';
    });
}

// Helper para fetch con headers regionales
export async function regionalFetch(url, options = {}) {
    const { country, lang } = getRegion();
    const headers = {
        ...(options.headers || {}),
        'X-Country': country,
        'X-Lang': lang
    };
    const res = await fetch(url, { ...options, headers });
    return res;
}

// Reaplicar flags en cambios de región
document.addEventListener('region:change', () => applyFeatureFlags());


