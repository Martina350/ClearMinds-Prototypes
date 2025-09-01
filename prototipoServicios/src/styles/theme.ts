import { StyleSheet } from 'react-native';

// Paleta de colores moderna y profesional
export const colors = {
  // Colores primarios
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  
  // Colores secundarios
  secondary: '#64748B',
  secondaryLight: '#94A3B8',
  secondaryDark: '#475569',
  
  // Colores de éxito
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',
  
  // Colores de advertencia
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  
  // Colores de error
  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',
  
  // Colores neutros
  white: '#FFFFFF',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  
  // Colores de fondo
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  
  // Colores de texto
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textInverse: '#FFFFFF',
  
  // Colores de borde
  border: '#E2E8F0',
  borderHover: '#CBD5E1',
  borderFocus: '#3B82F6',
};

// Tipografías consistentes
export const typography = {
  // Títulos
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.1,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  
  // Texto del cuerpo
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyXSmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  
  // Etiquetas
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  
  // Botones
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
};

// Espaciado consistente
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Bordes y radios
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

// Sombras
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
};

// Estilos base reutilizables
export const baseStyles = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  
  // Headers
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  
  // Secciones
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  
  // Tarjetas
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHover: {
    ...shadows.lg,
    transform: [{ translateY: -2 }],
  },
  
  // Botones
  button: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonWarning: {
    backgroundColor: colors.warning,
  },
  buttonError: {
    backgroundColor: colors.error,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonText: {
    ...typography.button,
    color: colors.textInverse,
  },
  buttonTextOutline: {
    ...typography.button,
    color: colors.primary,
  },
  
  // Inputs
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  inputFocus: {
    borderColor: colors.borderFocus,
    ...shadows.md,
  },
  inputLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  
  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    width: '90%',
    maxWidth: 400,
    ...shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  modalBody: {
    padding: spacing.lg,
  },
  modalCloseButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Listas
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  
  // Estados
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.7,
  },
});

// Estilos específicos para componentes
export const componentStyles = StyleSheet.create({
  // Badges
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePrimary: {
    backgroundColor: colors.primary,
  },
  badgeSuccess: {
    backgroundColor: colors.success,
  },
  badgeWarning: {
    backgroundColor: colors.warning,
  },
  badgeError: {
    backgroundColor: colors.error,
  },
  badgeText: {
    ...typography.labelSmall,
    color: colors.textInverse,
  },
  
  // Iconos
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray100,
  },
  iconLarge: {
    width: 64,
    height: 64,
  },
  
  // Estadísticas
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // Navegación
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    ...shadows.lg,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    marginBottom: spacing.xs,
  },
  tabLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
  },
});

// Función helper para crear estilos dinámicos
export const createDynamicStyles = (isDark: boolean = false) => {
  const themeColors = isDark ? {
    ...colors,
    background: colors.gray900,
    surface: colors.gray800,
    textPrimary: colors.gray100,
    textSecondary: colors.gray300,
    textTertiary: colors.gray400,
    border: colors.gray700,
  } : colors;
  
  return {
    colors: themeColors,
    typography,
    spacing,
    borderRadius,
    shadows,
    baseStyles,
    componentStyles,
  };
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  baseStyles,
  componentStyles,
  createDynamicStyles,
};
