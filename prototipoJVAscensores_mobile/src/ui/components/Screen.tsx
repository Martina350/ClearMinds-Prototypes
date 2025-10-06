import React from 'react';
import { View, ScrollView, ViewProps } from 'react-native';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';

export function Screen({ children, scroll, style, ...rest }: ViewProps & { scroll?: boolean }) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  const Container = scroll ? ScrollView : View;
  return (
    <Container {...rest} style={[{ flex: 1, backgroundColor: theme.colors.bg }, style]}>
      {children}
    </Container>
  );
}


