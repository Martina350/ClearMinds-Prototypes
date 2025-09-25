export const Colors = {
  // Colores principales según especificaciones del prototipo
  primary: {
    50: '#FF6F61', // Coral Brillante - Botones e interacciones principales
    100: '#FF8A80',
    200: '#FFAB91',
    300: '#FF6F61',
    400: '#FF6F61',
    500: '#FF6F61', // Coral Brillante principal
    600: '#E64A19',
    700: '#D84315',
    800: '#BF360C',
    900: '#A52A00',
  },
  
  // Colores secundarios
  secondary: {
    50: '#40E0D0', // Turquesa - Acciones secundarias
    100: '#80E4D1',
    200: '#40E0D0',
    300: '#40E0D0',
    400: '#40E0D0',
    500: '#40E0D0', // Turquesa principal
    600: '#00BCD4',
    700: '#00ACC1',
    800: '#0097A7',
    900: '#00838F',
  },

  // Colores emocionales para estados de ánimo
  emotions: {
    happy: '#40E0D0',      // Turquesa
    sad: '#616161',        // Gris Medio
    angry: '#F44336',      // Rojo
    calm: '#E6E6FA',       // Lavanda Suave
    excited: '#FF9800',    // Naranja Brillante
    tired: '#616161',      // Gris Medio
    confused: '#FF9800',   // Naranja Brillante
    confident: '#FF6F61',  // Coral Brillante
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

  // Colores de fondo
  background: {
    light: '#E6E6FA', // Lavanda Suave - Fondo principal
    secondary: '#B2EBF2', // Aqua Suave - Fondo suave y relajante
    dark: '#333333',
    gradient: ['#FF6F61', '#40E0D0'], // Gradiente Coral-Turquesa
  },

  // Colores de estado
  status: {
    success: '#40E0D0',
    warning: '#FF9800', // Naranja Brillante - Mensajes de advertencia
    error: '#F44336',   // Rojo - Mensajes de error
    info: '#40E0D0',
  },

  // Colores específicos del prototipo
  coral: '#FF6F61',        // Coral Brillante
  turquoise: '#40E0D0',    // Turquesa
  lavender: '#E6E6FA',     // Lavanda Suave
  aqua: '#B2EBF2',         // Aqua Suave
  darkGray: '#333333',     // Gris Oscuro
  mediumGray: '#616161',   // Gris Medio
  orange: '#FF9800',       // Naranja Brillante
  red: '#F44336',          // Rojo

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
