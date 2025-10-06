import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';

export function Input(props: TextInputProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  return (
    <TextInput
      {...props}
      placeholderTextColor={theme.colors.textSecondary}
      style={[
        {
          borderWidth: 1,
          borderColor: theme.colors.border,
          color: theme.colors.text,
          backgroundColor: theme.colors.card,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radii.md,
          fontSize: theme.typography.body
        },
        props.style
      ]}
    />
  );
}


