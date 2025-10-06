import React from 'react';
import { View, ViewProps } from 'react-native';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';

export function Card({ children, style, ...rest }: ViewProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.lg,
          ...theme.shadows.sm
        },
        style
      ]}
    >
      {children}
    </View>
  );
}


