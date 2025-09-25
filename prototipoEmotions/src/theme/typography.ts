import { Platform } from 'react-native';

export const Typography = {
  // Títulos principales
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
    color: '#1f2937',
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    color: '#1f2937',
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    color: '#374151',
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: '#374151',
  },

  // Texto del cuerpo
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: '#4b5563',
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
    color: '#4b5563',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: '#6b7280',
  },

  // Texto especial
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    color: '#9ca3af',
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: '#374151',
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: '#ffffff',
  },

  // Texto emocional (más divertido)
  playful: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 26,
    color: '#1f2937',
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
