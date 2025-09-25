import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
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

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : Colors.primary[600]} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
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
  
  // Variantes según especificaciones del prototipo
  primary: {
    backgroundColor: Colors.coral, // Coral Brillante para botones principales
    borderRadius: 8, // Bordes ligeramente redondeados
    ...Colors.Shadows.medium,
  },
  secondary: {
    backgroundColor: Colors.turquoise, // Turquesa para acciones secundarias
    borderRadius: 8,
    ...Colors.Shadows.medium,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.coral,
    borderRadius: 8,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: 8,
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
    color: Colors.darkGray, // Gris Oscuro
  },
  outlineText: {
    color: Colors.coral, // Coral Brillante
  },
  ghostText: {
    color: Colors.coral,
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
});
