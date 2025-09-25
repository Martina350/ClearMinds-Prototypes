import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';

interface PulseButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function PulseButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
}: PulseButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!disabled) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (!disabled) {
            pulse();
          }
        });
      };
      pulse();
    }
  }, [pulseAnim, disabled]);

  const getButtonStyle = () => {
    const baseStyle = {
      paddingHorizontal: size === 'small' ? Spacing.md : size === 'large' ? Spacing.xl : Spacing.lg,
      paddingVertical: size === 'small' ? Spacing.sm : size === 'large' ? Spacing.lg : Spacing.md,
      borderRadius: BorderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...Colors.Shadows.medium,
    };

    if (variant === 'primary') {
      return {
        ...baseStyle,
        backgroundColor: disabled ? Colors.neutral[300] : Colors.primary[600],
      };
    }

    return {
      ...baseStyle,
      backgroundColor: disabled ? Colors.neutral[200] : Colors.secondary[400],
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: '600' as const,
      color: disabled ? Colors.neutral[500] : '#ffffff',
    };

    switch (size) {
      case 'small':
        return { ...baseTextStyle, fontSize: 14 };
      case 'large':
        return { ...baseTextStyle, fontSize: 18 };
      default:
        return { ...baseTextStyle, fontSize: 16 };
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
