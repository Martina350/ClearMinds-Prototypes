import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';

interface FilterButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

export function FilterButton({ title, active, onPress }: FilterButtonProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: active ? theme.colors.primary : theme.colors.bg,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radii.pill,
        marginRight: theme.spacing.sm
      }}
    >
      <Text
        style={{
          color: active ? theme.colors.primaryText : theme.colors.textMuted,
          fontSize: theme.typography.bodySmall,
          fontWeight: '600'
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
