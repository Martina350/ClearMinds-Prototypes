import { Platform } from 'react-native';

export const typography = {
  // Títulos principales
  h1: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 34,
    color: '#2C3E50'
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 30,
    color: '#2C3E50'
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    lineHeight: 26,
    color: '#2C3E50'
  },
  h4: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    lineHeight: 24,
    color: '#2C3E50'
  },
  
  // Texto del cuerpo
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 22,
    color: '#2C3E50'
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
    color: '#7F8C8D'
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: 'normal' as const,
    lineHeight: 24,
    color: '#2C3E50'
  },
  
  // Texto de etiquetas
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: '#2C3E50'
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 18,
    color: '#7F8C8D'
  },
  
  // Botones
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    lineHeight: 22,
    color: '#FFFFFF',
    textTransform: 'uppercase' as const
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    lineHeight: 20,
    color: '#FFFFFF',
    textTransform: 'uppercase' as const
  },
  buttonSecondary: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    lineHeight: 22,
    color: '#2C3E50',
    textTransform: 'uppercase' as const
  },
  
  // Navegación
  tab: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
    color: '#7F8C8D'
  },
  tabActive: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    lineHeight: 16,
    color: '#5CB85C'
  },
  
  // Precios
  price: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 30,
    color: '#5CB85C'
  },
  priceSmall: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    lineHeight: 24,
    color: '#5CB85C'
  },
  
  // Placeholders
  placeholder: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 22,
    color: '#BDC3C7'
  },
  
  // Logo
  logo: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 30,
    color: '#5CB85C'
  },
  
  // Admin
  adminTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    lineHeight: 26,
    color: '#FFFFFF'
  },
  adminSubtitle: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 22,
    color: '#FFFFFF'
  }
};

// Fuentes específicas por plataforma
export const fontFamily = {
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
  light: Platform.OS === 'ios' ? 'System' : 'Roboto-Light'
};
