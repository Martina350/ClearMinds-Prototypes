export const Colors = {
  // Paleta principal moderna - Azul profundo profesional
  primary: {
    50: '#E3F2FD',   // Azul muy claro
    100: '#BBDEFB',  // Azul claro
    200: '#90CAF9',  // Azul medio claro
    300: '#64B5F6',  // Azul medio
    400: '#42A5F5',  // Azul
    500: '#2196F3',  // Azul principal
    600: '#1E88E5',  // Azul oscuro
    700: '#1976D2',  // Azul más oscuro
    800: '#1565C0',  // Azul muy oscuro
    900: '#0D47A1',  // Azul profundo
  },
  
  // Paleta secundaria - Púrpura elegante
  secondary: {
    50: '#F3E5F5',   // Púrpura muy claro
    100: '#E1BEE7',  // Púrpura claro
    200: '#CE93D8',  // Púrpura medio claro
    300: '#BA68C8',  // Púrpura medio
    400: '#AB47BC',  // Púrpura
    500: '#9C27B0',  // Púrpura principal
    600: '#8E24AA',  // Púrpura oscuro
    700: '#7B1FA2',  // Púrpura más oscuro
    800: '#6A1B9A',  // Púrpura muy oscuro
    900: '#4A148C',  // Púrpura profundo
  },

  // Colores emocionales modernos para estados de ánimo
  emotions: {
    happy: '#4CAF50',      // Verde vibrante
    sad: '#607D8B',        // Azul grisáceo
    angry: '#F44336',       // Rojo intenso
    calm: '#81C784',       // Verde suave
    excited: '#FF9800',     // Naranja vibrante
    tired: '#9E9E9E',       // Gris medio
    confused: '#FFC107',    // Amarillo dorado
    confident: '#2196F3',   // Azul confianza
  },

  // Colores neutros
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#616161', // Gris Medio - Texto secundario
    700: '#424242',
    800: '#333333', // Gris Oscuro - Texto principal
    900: '#212121',
  },

  // Colores de fondo modernos
  background: {
    light: '#FAFAFA',     // Blanco suave
    secondary: '#F5F5F5',  // Gris muy claro
    dark: '#212121',      // Gris muy oscuro
    gradient: ['#2196F3', '#9C27B0'], // Gradiente Azul-Púrpura
    surface: '#FFFFFF',   // Superficie blanca
    overlay: 'rgba(0,0,0,0.5)', // Overlay semitransparente
  },

  // Colores de estado modernos
  status: {
    success: '#4CAF50',    // Verde éxito
    warning: '#FF9800',    // Naranja advertencia
    error: '#F44336',      // Rojo error
    info: '#2196F3',       // Azul información
  },

  // Colores específicos modernos
  accent: '#FF4081',       // Rosa vibrante
  success: '#4CAF50',      // Verde éxito
  warning: '#FF9800',      // Naranja advertencia
  error: '#F44336',        // Rojo error
  info: '#2196F3',         // Azul información
  darkGray: '#424242',     // Gris oscuro
  mediumGray: '#757575',   // Gris medio
  lightGray: '#BDBDBD',    // Gris claro

  // Sombras modernas y sutiles que dan profundidad
  Shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    xlarge: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
    },
  }
} as const;
