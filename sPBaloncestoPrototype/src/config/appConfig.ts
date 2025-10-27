// Configuración adicional para el proyecto
export const APP_CONFIG = {
  // URLs y endpoints
  WEBSITE_URL: 'https://www.sanpedrobaloncesto.edu.co',
  
  // Configuración de la app
  APP_NAME: 'Escuela de Baloncesto San Pedro',
  APP_VERSION: '1.0.0',
  
  // Colores del tema
  COLORS: {
    PRIMARY: '#e74c3c',
    SECONDARY: '#2c3e50',
    SUCCESS: '#27ae60',
    WARNING: '#f39c12',
    ERROR: '#e74c3c',
    INFO: '#3498db',
    TEXT_PRIMARY: '#2c3e50',
    TEXT_SECONDARY: '#7f8c8d',
    BACKGROUND: '#f5f5f5',
    WHITE: '#ffffff',
  },
  
  // Configuración de pagos
  PAYMENT: {
    CURRENCY: 'COP',
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 1000000,
  },
  
  // Configuración de WebView
  WEBVIEW: {
    USER_AGENT: 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    TIMEOUT: 30000,
  },
  
  // Configuración de almacenamiento
  STORAGE: {
    USER_KEY: 'user_session',
    SETTINGS_KEY: 'app_settings',
  },
  
  // Mensajes de la aplicación
  MESSAGES: {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGIN_ERROR: 'Usuario o contraseña incorrectos',
    PAYMENT_SUCCESS: 'Pago procesado correctamente',
    PAYMENT_ERROR: 'Error al procesar el pago',
    TRANSFER_SENT: 'Comprobante enviado para revisión',
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  },
};
