import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface DatePickerProps {
  label: string;
  placeholder?: string;
  value?: string;
  onDateSelect: (date: string) => void;
  required?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder = 'Seleccionar fecha',
  value,
  onDateSelect,
  required = false,
  maximumDate = new Date(),
  minimumDate = new Date(1900, 0, 1),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2000);

  // Generar arrays de opciones
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];
  const years = Array.from({ length: maximumDate.getFullYear() - minimumDate.getFullYear() + 1 }, (_, i) => maximumDate.getFullYear() - i);

  const formatDate = (day: number, month: number, year: number) => {
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    return `${dayStr}/${monthStr}/${year}`;
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    onDateSelect(formatDate(day, selectedMonth, selectedYear));
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    onDateSelect(formatDate(selectedDay, month, selectedYear));
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    onDateSelect(formatDate(selectedDay, selectedMonth, year));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[styles.input, value && styles.inputFilled]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${value || placeholder}`}
        accessibilityHint="Toca para abrir el selector de fecha"
      >
        <Text style={[styles.inputText, value && styles.inputTextFilled]}>
          {value || placeholder}
        </Text>
        <MaterialIcons 
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={24} 
          color={theme.colors.primary} 
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <View style={styles.pickerRow}>
            {/* Selector de Día */}
            <View style={styles.pickerColumn}>
              <Text style={styles.columnTitle}>Día</Text>
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.option,
                      selectedDay === day && styles.selectedOption
                    ]}
                    onPress={() => handleDaySelect(day)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedDay === day && styles.selectedOptionText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Selector de Mes */}
            <View style={styles.pickerColumn}>
              <Text style={styles.columnTitle}>Mes</Text>
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.option,
                      selectedMonth === month.value && styles.selectedOption
                    ]}
                    onPress={() => handleMonthSelect(month.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedMonth === month.value && styles.selectedOptionText
                    ]}>
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Selector de Año */}
            <View style={styles.pickerColumn}>
              <Text style={styles.columnTitle}>Año</Text>
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.option,
                      selectedYear === year && styles.selectedOption
                    ]}
                    onPress={() => handleYearSelect(year)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedYear === year && styles.selectedOptionText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
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
    backgroundColor: theme.colors.background,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputFilled: {
    borderColor: theme.colors.primary,
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.subtitle,
    flex: 1,
  },
  inputTextFilled: {
    color: theme.colors.text,
  },
  dropdown: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 4,
    ...theme.shadows.card,
  },
  pickerRow: {
    flexDirection: 'row',
    padding: 16,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  scrollContainer: {
    maxHeight: 200,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '700',
  },
});
