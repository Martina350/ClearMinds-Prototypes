import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { BorderRadius, Spacing } from '@/theme/spacing';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export default function Card({
  children,
  variant = 'default',
  style,
  padding = 'medium',
}: CardProps) {
  const paddingKey = `padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles;
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[paddingKey],
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    backgroundColor: '#ffffff',
  },
  
  // Variantes
  default: {
    backgroundColor: '#ffffff',
  },
  elevated: {
    backgroundColor: '#ffffff',
    ...Colors.Shadows.medium,
  },
  outlined: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  
  // Padding
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Spacing.sm,
  },
  paddingMedium: {
    padding: Spacing.md,
  },
  paddingLarge: {
    padding: Spacing.lg,
  },
});
