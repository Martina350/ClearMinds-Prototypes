export type ThemeMode = 'light' | 'dark';

export const base = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999
  },
  typography: {
    h1: 24,
    h2: 20,
    h3: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
    button: 16
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8
    }
  }
};

export const palettes = {
  light: {
    bg: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    textMuted: '#666666',
    textSecondary: '#888888',
    primary: '#1976d2',
    primaryText: '#ffffff',
    border: '#e0e0e0',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    // Estados de OT
    scheduled: '#1976d2',
    inProgress: '#ff9800',
    suspended: '#f44336',
    rescheduled: '#9c27b0',
    completed: '#4caf50',
    // Notificaciones
    urgent: '#ef5350',
    warningBg: '#fff3cd',
    warningBorder: '#ffeaa7'
  },
  dark: {
    bg: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textMuted: '#cccccc',
    textSecondary: '#999999',
    primary: '#64b5f6',
    primaryText: '#000000',
    border: '#404040',
    success: '#66bb6a',
    danger: '#ef5350',
    warning: '#ffa726',
    info: '#4fc3f7',
    // Estados de OT
    scheduled: '#64b5f6',
    inProgress: '#ffb74d',
    suspended: '#ef5350',
    rescheduled: '#ba68c8',
    completed: '#81c784',
    // Notificaciones
    urgent: '#ef5350',
    warningBg: '#4a3728',
    warningBorder: '#8d6e63'
  }
};

export function getTheme(mode: ThemeMode) {
  const colors = mode === 'dark' ? palettes.dark : palettes.light;
  return { colors, ...base };
}


