import { Platform } from 'react-native';

export const Typography = {
  // Títulos principales - Roboto/Poppins Bold
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: 'Roboto-Bold', // Roboto Bold para encabezados principales
    lineHeight: 40,
    color: '#333333', // Gris Oscuro - Texto principal
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    fontFamily: 'Roboto-Bold',
    lineHeight: 36,
    color: '#333333',
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    fontFamily: 'Roboto-Medium',
    lineHeight: 32,
    color: '#333333',
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    fontFamily: 'Roboto-Medium',
    lineHeight: 28,
    color: '#333333',
  },

  // Texto del cuerpo - Open Sans Normal/Medium
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'OpenSans-Regular', // Open Sans para texto general
    lineHeight: 24,
    color: '#616161', // Gris Medio - Texto secundario
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 28,
    color: '#616161',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'OpenSans-Regular', // Open Sans para descripciones e instrucciones
    lineHeight: 20,
    color: '#616161',
  },

  // Texto especial
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 16,
    color: '#616161',
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    fontFamily: 'Roboto-Medium',
    lineHeight: 20,
    color: '#333333',
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'Roboto-Medium', // Semi-bold para botones y llamadas a la acción
    lineHeight: 24,
    color: '#ffffff',
  },

  // Texto emocional (más divertido) - Poppins para elementos amigables
  playful: {
    fontSize: 18,
    fontWeight: '500' as const,
    fontFamily: 'Poppins-Medium', // Poppins para elementos más amigables
    lineHeight: 26,
    color: '#333333',
    fontStyle: 'italic' as const,
  },
} as const;

// Fuentes personalizadas para iOS y Android
export const Fonts = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
} as const;
