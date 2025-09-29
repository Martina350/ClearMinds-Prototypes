import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/theme/colors';

interface BackgroundGradientProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'light' | 'warm';
}

export default function BackgroundGradient({ children, variant = 'primary' }: BackgroundGradientProps) {
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [Colors.primary[100], Colors.primary[50], Colors.background.light];
      case 'secondary':
        return [Colors.primary[100], Colors.primary[50], Colors.background.light];
      case 'light':
        return [Colors.primary[100], Colors.primary[50], Colors.background.light];
      case 'warm':
        return [Colors.primary[100], Colors.primary[50], Colors.background.light];
      default:
        return [Colors.primary[100], Colors.primary[50], Colors.background.light];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
