// i18n.js - cargador simple con fallback por variante y en-US
import { getRegion, setRegion } from './region.js';

let messages = {};
let currentLang = null;
// Fallback embebido (útil en file://)
const BUILTIN = {
    'en-US': {
        'app.title': 'EcoSolution',
        'app.subtitle': 'Environmental Sanitation Services',
        'nav.services': 'Services',
        'nav.myServices': 'My Services',
        'nav.profile': 'Profile',
        'btn.save': 'Save',
        'selector.country': 'Country',
        'selector.language': 'Language',
        'services.heading': 'Our Services',
        'booking.continue': 'Continue to Payment'
    },
    'en-CA': {
        'app.title': 'EcoSolution',
        'app.subtitle': 'Environmental Sanitation Services',
        'nav.services': 'Services',
        'nav.myServices': 'My Services',
        'nav.profile': 'Profile',
        'btn.save': 'Save',
        'selector.country': 'Country',
        'selector.language': 'Language',
        'services.heading': 'Our Services',
        'booking.continue': 'Continue to Payment'
    },
    'fr-CA': {
        'app.title': 'EcoSolution',
        'app.subtitle': "Services d'assainissement environnemental",
        'nav.services': 'Services',
        'nav.myServices': 'Mes services',
        'nav.profile': 'Profil',
        'btn.save': 'Enregistrer',
        'selector.country': 'Pays',
        'selector.language': 'Langue',
        'services.heading': 'Nos services',
        'booking.continue': 'Continuer au paiement'
    },
    'es-PE': {
        'app.title': 'EcoSolution',
        'app.subtitle': 'Servicios de Sanidad Ambiental',
        'nav.services': 'Servicios',
        'nav.myServices': 'Mis Servicios',
        'nav.profile': 'Perfil',
        'btn.save': 'Guardar',
        'selector.country': 'País',
        'selector.language': 'Idioma',
        'services.heading': 'Nuestros Servicios',
        'booking.continue': 'Continuar al Pago'
    },
    'es-EC': {
        'app.title': 'EcoSolution',
        'app.subtitle': 'Servicios de Sanidad Ambiental',
        'nav.services': 'Servicios',
        'nav.myServices': 'Mis Servicios',
        'nav.profile': 'Perfil',
        'btn.save': 'Guardar',
        'selector.country': 'País',
        'selector.language': 'Idioma',
        'services.heading': 'Nuestros Servicios',
        'booking.continue': 'Continuar al Pago'
    }
};

async function loadMessages(lang) {
    const candidates = buildLangFallbacks(lang);
    for (const code of candidates) {
        let loaded = false;
        try {
            const res = await fetch(`./i18n/${code}.json`, { cache: 'no-cache' });
            if (res.ok) {
                const json = await res.json();
                messages = { ...messages, ...json };
                loaded = true;
            }
        } catch (_) {}
        if (!loaded && BUILTIN[code]) {
            messages = { ...messages, ...BUILTIN[code] };
        }
    }
}

export async function setLanguage(lang) {
    messages = {};
    currentLang = lang;
    await loadMessages(lang);
}

export function t(key, fallback = '') {
    return messages[key] ?? fallback ?? key;
}

export async function initI18n() {
    const { lang } = getRegion();
    await setLanguage(lang);
}

export function buildLangFallbacks(lang) {
    const parts = (lang || '').split('-');
    const [base, region] = parts;
    const list = [];
    if (lang) list.push(lang);
    // Variante del país si aplica (ej: en-CA cuando falta fr-CA)
    if (region && base) {
        const variant = `${base}-${region}`;
        if (!list.includes(variant)) list.push(variant);
    }
    // Fallback global
    if (!list.includes('en-US')) list.push('en-US');
    return list;
}

// Reaccionar a cambio de región
document.addEventListener('region:change', async (e) => {
    const { lang } = e.detail;
    await setLanguage(lang);
    document.dispatchEvent(new CustomEvent('i18n:change'));
});

export function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        el.textContent = t(key, el.textContent);
    });
}


