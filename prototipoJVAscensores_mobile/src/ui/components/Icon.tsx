import React from 'react';
import { TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';

export function Icon({ name, size = 20, color, style }: { name: React.ComponentProps<typeof MaterialIcons>['name']; size?: number; color?: string; style?: TextStyle }) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  return <MaterialIcons name={name} size={size} color={color ?? theme.colors.text} style={style} />;
}


