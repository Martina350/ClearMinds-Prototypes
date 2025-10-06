import React from 'react';
import { Text, TextProps } from 'react-native';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';

export function AppText({ children, style, ...rest }: TextProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  return (
    <Text {...rest} style={[{ color: theme.colors.text, fontSize: theme.typography.body }, style]}>
      {children}
    </Text>
  );
}

export function Title({ children, style, ...rest }: TextProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  return (
    <Text {...rest} style={[{ color: theme.colors.text, fontSize: theme.typography.h1, fontWeight: '700' }, style]}>
      {children}
    </Text>
  );
}

export function Subtitle({ children, style, ...rest }: TextProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  return (
    <Text {...rest} style={[{ color: theme.colors.textMuted, fontSize: theme.typography.h3, fontWeight: '600' }, style]}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, ...rest }: TextProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  return (
    <Text {...rest} style={[{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }, style]}>
      {children}
    </Text>
  );
}


