// region.js - detección y persistencia de país/idioma

const STORAGE_COUNTRY_KEY = 'user.country';
const STORAGE_LANG_KEY = 'user.lang';

export const COUNTRY_LANGS = {
    US: ['en-US'],
    CA: ['en-CA', 'fr-CA'],
    PE: ['es-PE'],
    EC: ['es-EC']
};

let currentRegion = null;

function normalizeCountry(countryCandidate) {
    const c = (countryCandidate || '').toUpperCase();
    if (['US', 'CA', 'PE', 'EC'].includes(c)) return c;
    return null;
}

function detectCountryFromLocale(locale) {
    if (!locale) return null;
    const m = locale.toUpperCase().match(/-(US|CA|PE|EC)/);
    return m ? m[1] : null;
}

export function resolveRegion() {
    // 1) localStorage
    const storedCountry = normalizeCountry(localStorage.getItem(STORAGE_COUNTRY_KEY));
    const storedLang = localStorage.getItem(STORAGE_LANG_KEY);
    if (storedCountry && storedLang) {
        currentRegion = { country: storedCountry, lang: storedLang };
        return currentRegion;
    }

    // 2) navigator / Intl
    const navLang = (navigator.language || '').trim();
    const intlLocale = (Intl.DateTimeFormat().resolvedOptions().locale || '').trim();
    const locale = navLang || intlLocale;
    let country = normalizeCountry(detectCountryFromLocale(locale));

    // Heurística por lenguaje si no hay país explícito
    if (!country) {
        const langs = (navigator.languages || [navLang || intlLocale]).map(l => (l || '').toLowerCase());
        if (langs.some(l => l.startsWith('es'))) {
            // Preferir PE/EC? No podemos saberlo, así que no resolvemos aún
            country = null;
        } else if (langs.some(l => l.startsWith('fr'))) {
            country = 'CA';
        } else if (langs.some(l => l.startsWith('en'))) {
            country = 'US';
        }
    }

    // Idioma por país
    let lang;
    if (country === 'CA') {
        const prefersFrench = (navigator.languages || []).some(l => (l || '').toLowerCase().startsWith('fr'));
        lang = prefersFrench ? 'fr-CA' : 'en-CA';
    } else if (country === 'PE') {
        lang = 'es-PE';
    } else if (country === 'EC') {
        lang = 'es-EC';
    } else if (country === 'US') {
        lang = 'en-US';
    }

    // 3) País por defecto
    if (!country) {
        country = 'US';
        lang = 'en-US';
        // 4) Duda -> avisar para mostrar selector (no hay almacenamiento)
        setTimeout(() => document.dispatchEvent(new CustomEvent('region:prompt')));
    }

    currentRegion = { country, lang };
    return currentRegion;
}

export function setRegion(country, lang) {
    const normalizedCountry = normalizeCountry(country) || 'US';
    const allowedLangs = COUNTRY_LANGS[normalizedCountry] || COUNTRY_LANGS.US;
    const finalLang = allowedLangs.includes(lang) ? lang : allowedLangs[0];

    localStorage.setItem(STORAGE_COUNTRY_KEY, normalizedCountry);
    localStorage.setItem(STORAGE_LANG_KEY, finalLang);

    currentRegion = { country: normalizedCountry, lang: finalLang };
    document.dispatchEvent(new CustomEvent('region:change', { detail: currentRegion }));
}

export function getRegion() {
    return currentRegion || resolveRegion();
}

export function onRegionChange(handler) {
    document.addEventListener('region:change', (e) => handler(e.detail));
}

// Exponer API mínima para uso desde scripts no-modulares
if (typeof window !== 'undefined') {
    window.Region = {
        resolveRegion,
        setRegion,
        getRegion,
        COUNTRY_LANGS
    };
}


