import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Checklist: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <TouchableOpacity
      style={[styles.checkbox, checked && styles.checkboxChecked]}
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {checked ? (
        <Ionicons 
          name="checkmark-circle" 
          size={20} 
          color={colors.textInverse} 
        />
      ) : (
        <Ionicons 
          name="checkmark-circle-outline" 
          size={20} 
          color={colors.primary} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
    ...shadows.md,
    transform: [{ scale: 1.05 }],
  },
});

export default Checklist;


