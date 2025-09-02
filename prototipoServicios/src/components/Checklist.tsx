import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Checklist: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.iconBtn, checked && styles.iconBtnActive]}
        onPress={() => onChange(!checked)}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={checked ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={24}
          color={checked ? colors.textInverse : colors.success}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
    ...shadows.sm,
  },
  iconBtnActive: {
    backgroundColor: colors.success,
  },
});

export default Checklist;


