import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../theme/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

/**
 * Componente Input con label y manejo de errores
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  required: {
    color: theme.colors.primaryDark,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: theme.colors.background,
    minHeight: 52,
  },
  inputError: {
    borderColor: theme.colors.primary,
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 4,
  },
});

