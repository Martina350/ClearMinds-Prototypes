export const Colors = {
  // Colores principales - Gradientes modernos y confiables
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Azul principal
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Colores secundarios - Gradientes cálidos
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15', // Amarillo principal
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },

  // Colores emocionales para estados de ánimo
  emotions: {
    happy: '#10b981',      // Verde esmeralda
    sad: '#6366f1',        // Índigo
    angry: '#ef4444',      // Rojo
    calm: '#8b5cf6',       // Púrpura
    excited: '#f59e0b',    // Ámbar
    tired: '#6b7280',      // Gris
    confused: '#f97316',   // Naranja
    confident: '#ec4899',  // Rosa
  },

  // Colores neutros
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Colores de fondo
  background: {
    light: '#ffffff',
    dark: '#0f172a',
    gradient: ['#667eea', '#764ba2'], // Gradiente púrpura-azul
  },

  // Colores de estado
  status: {
    success: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Sombras
  Shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  }
} as const;
