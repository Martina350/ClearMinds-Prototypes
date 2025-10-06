import { Dimensions } from 'react-native';

export type Breakpoint = 'phone' | 'tablet' | 'desktop';

export function getBreakpoint(): Breakpoint {
  const { width } = Dimensions.get('window');
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'phone';
}

export function useResponsiveValue<T>(values: { phone: T; tablet?: T; desktop?: T }): T {
  const bp = getBreakpoint();
  if (bp === 'desktop' && values.desktop !== undefined) return values.desktop as T;
  if (bp === 'tablet' && values.tablet !== undefined) return values.tablet as T;
  return values.phone;
}


