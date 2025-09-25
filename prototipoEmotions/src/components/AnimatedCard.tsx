import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, ViewStyle } from 'react-native';
import Card from './Card';

interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  delay?: number;
}

export default function AnimatedCard({
  children,
  variant = 'default',
  style,
  padding = 'medium',
  onPress,
  delay = 0,
}: AnimatedCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, delay]);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
          <Card variant={variant} padding={padding}>
            {children}
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Card variant={variant} padding={padding}>
        {children}
      </Card>
    </Animated.View>
  );
}
