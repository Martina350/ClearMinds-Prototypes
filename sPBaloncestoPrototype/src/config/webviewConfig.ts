// Configuración específica para WebView
export const WEBVIEW_CONFIG = {
  // URLs de prueba que funcionan bien
  TEST_URLS: {
    GOOGLE: 'https://www.google.com',
    EXPO: 'https://expo.dev',
    GITHUB: 'https://github.com',
  },
  
  // URL del sitio institucional (dominio real)
  INSTITUTIONAL_URL: 'https://sanpedrobaloncesto.com',
  
  // Configuración del User Agent
  USER_AGENT: 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  
  // Configuración de WebView
  WEBVIEW_PROPS: {
    startInLoadingState: true,
    scalesPageToFit: true,
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
    javaScriptEnabled: true,
    domStorageEnabled: true,
    mixedContentMode: 'compatibility' as const,
    allowsFullscreenVideo: true,
    bounces: false,
    scrollEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: true,
    cacheEnabled: true,
    incognito: false,
    thirdPartyCookiesEnabled: true,
    sharedCookiesEnabled: true,
    allowsBackForwardNavigationGestures: true,
  },
  
  // Timeouts
  TIMEOUTS: {
    LOAD_TIMEOUT: 30000, // 30 segundos
    RETRY_DELAY: 2000,   // 2 segundos
  },
  
  // Mensajes de error
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    LOAD_ERROR: 'No se pudo cargar el sitio web.',
    TIMEOUT_ERROR: 'El sitio web tardó demasiado en cargar.',
  },
};
