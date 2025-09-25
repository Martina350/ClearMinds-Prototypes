import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius, Layout } from '@/theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export default function Input({
  label,
  error,
  helperText,
  variant = 'default',
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.input,
    styles[variant],
    isFocused && styles.focused,
    error && styles.error,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={Colors.neutral[400]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  input: {
    height: Layout.inputHeight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  default: {
    backgroundColor: '#ffffff',
  },
  filled: {
    backgroundColor: Colors.neutral[50],
    borderColor: Colors.neutral[200],
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary[300],
    borderWidth: 2,
  },
  focused: {
    borderColor: Colors.primary[500],
    ...Colors.Shadows.small,
  },
  error: {
    borderColor: Colors.status.error,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.status.error,
    marginTop: Spacing.xs,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  },
});
