import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/theme';

interface PickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: Array<{ label: string; value: string }>;
  required?: boolean;
  error?: string;
}

/**
 * Componente Picker con label y manejo de errores
 * Dropdown inline que se despliega debajo del campo
 */
export const Picker: React.FC<PickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
  required = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.pickerContainer, error && styles.pickerError]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.pickerText, !selectedItem && styles.placeholderText]}>
          {selectedItem ? selectedItem.label : 'Seleccione una opción...'}
        </Text>
        <Text style={[styles.arrow, isOpen && styles.arrowUp]}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {isOpen && (
        <View style={styles.dropdownContainer}>
          <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.optionItem,
                  selectedValue === item.value && styles.selectedOption
                ]}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={[
                  styles.optionText,
                  selectedValue === item.value && styles.selectedOptionText
                ]}>
                  {item.label}
                </Text>
                {selectedValue === item.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    position: 'relative',
    zIndex: 1,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerError: {
    borderColor: theme.colors.primary,
  },
  pickerText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: theme.colors.primaryLight,
    marginLeft: 8,
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 4,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...theme.shadows.card,
    zIndex: 1000,
  },
  dropdownList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
  },
  optionText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

