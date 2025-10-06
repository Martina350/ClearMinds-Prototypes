import React from 'react';
import { TouchableOpacity, Text, ViewStyle, View } from 'react-native';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';
import { Icon } from './Icon';

export function AppButton({ title, onPress, variant = 'primary', style, icon, size = 'md' }: { 
  title: string; 
  onPress: () => void; 
  variant?: 'primary' | 'outline' | 'danger' | 'success' | 'secondary'; 
  style?: ViewStyle; 
  icon?: React.ComponentProps<typeof Icon>['name'];
  size?: 'sm' | 'md' | 'lg';
}) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  
  let bg = 'transparent';
  let borderColor = theme.colors.border;
  let color = theme.colors.text;
  
  switch (variant) {
    case 'primary':
      bg = theme.colors.primary;
      borderColor = theme.colors.primary;
      color = theme.colors.primaryText;
      break;
    case 'danger':
      bg = theme.colors.danger;
      borderColor = theme.colors.danger;
      color = theme.colors.primaryText;
      break;
    case 'success':
      bg = theme.colors.success;
      borderColor = theme.colors.success;
      color = theme.colors.primaryText;
      break;
    case 'secondary':
      bg = theme.colors.bg;
      borderColor = theme.colors.border;
      color = theme.colors.text;
      break;
    case 'outline':
      bg = 'transparent';
      borderColor = theme.colors.border;
      color = theme.colors.text;
      break;
  }
  
  const paddingVertical = size === 'sm' ? theme.spacing.xs : size === 'lg' ? theme.spacing.md : theme.spacing.sm;
  const paddingHorizontal = size === 'sm' ? theme.spacing.md : size === 'lg' ? theme.spacing.xl : theme.spacing.lg;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: bg,
          paddingVertical,
          paddingHorizontal,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor,
          ...theme.shadows.sm
        },
        style
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {icon && <Icon name={icon} color={color} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
        <Text style={{ color, textAlign: 'center', fontWeight: '600', fontSize: theme.typography.button }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}


