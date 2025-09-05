import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, borderRadius, shadows } from '../styles/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  shadow?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = spacing.cardPadding,
  margin = spacing.cardMargin,
  shadow = 'md',
  rounded = true
}) => {
  return (
    <View style={[
      styles.card,
      {
        padding,
        margin,
        borderRadius: rounded ? borderRadius.lg : 0,
      },
      shadows[shadow],
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
