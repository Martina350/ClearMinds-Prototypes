import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
}

interface MoodSelectorProps {
  options: MoodOption[];
  onSelect: (option: MoodOption) => void;
  title: string;
  subtitle?: string;
}

export default function MoodSelector({ options, onSelect, title, subtitle }: MoodSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (option: MoodOption, index: number) => {
    setSelectedIndex(index);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedIndex === index && styles.selectedOption,
              { backgroundColor: selectedIndex === index ? option.color + '20' : 'transparent' }
            ]}
            onPress={() => handleSelect(option, index)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text style={[
              styles.label,
              selectedIndex === index && { color: option.color, fontWeight: '600' }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
    color: Colors.neutral[500],
    marginBottom: Spacing.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  option: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    minWidth: '30%',
    backgroundColor: '#ffffff',
    ...Colors.Shadows.small,
  },
  selectedOption: {
    borderWidth: 3,
    ...Colors.Shadows.medium,
    transform: [{ scale: 1.05 }],
  },
  emoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.bodySmall,
    textAlign: 'center',
    color: Colors.neutral[600],
  },
});
