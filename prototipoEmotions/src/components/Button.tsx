import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius, Layout } from '@/theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={variant === 'primary' ? '#ffffff' : Colors.primary[600]} />;
    }

    if (icon) {
      const iconColor = variant === 'primary' ? '#ffffff' : Colors.primary[600];
      const iconSize = size === 'small' ? 16 : size === 'large' ? 20 : 18;
      
      return (
        <View style={styles.iconContainer}>
          {iconPosition === 'left' && (
            <MaterialIcons name={icon as any} size={iconSize} color={iconColor} style={styles.iconLeft} />
          )}
          <Text style={textStyles}>{title}</Text>
          {iconPosition === 'right' && (
            <MaterialIcons name={icon as any} size={iconSize} color={iconColor} style={styles.iconRight} />
          )}
        </View>
      );
    }

    return <Text style={textStyles}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variantes con nueva paleta moderna
  primary: {
    backgroundColor: Colors.primary[500], // Azul principal
    borderRadius: BorderRadius.md,
    ...Colors.Shadows.medium,
  },
  secondary: {
    backgroundColor: Colors.secondary[500], // Púrpura principal
    borderRadius: BorderRadius.md,
    ...Colors.Shadows.medium,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
  },
  
  // Tamaños
  small: {
    height: 36,
    paddingHorizontal: Spacing.md,
  },
  medium: {
    height: Layout.buttonHeight,
    paddingHorizontal: Spacing.lg,
  },
  large: {
    height: 56,
    paddingHorizontal: Spacing.xl,
  },
  
  // Estados
  disabled: {
    opacity: 0.5,
  },
  
  // Texto
  text: {
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium', // Semi-bold para botones
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  outlineText: {
    color: Colors.primary[500], // Azul principal
  },
  ghostText: {
    color: Colors.primary[500],
  },
  
  // Tamaños de texto
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Estilos para iconos
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
});
