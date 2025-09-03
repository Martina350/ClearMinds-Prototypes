import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

interface Props {
  selectedDate?: string | Date;
  onSelectDate?: (date: string) => void;
  onDateSelect?: (date: Date) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const Calendar: React.FC<Props> = ({ 
  selectedDate, 
  onSelectDate,
  onDateSelect, 
  onCancel, 
  onConfirm 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempSelected, setTempSelected] = useState<Date | null>(
    selectedDate instanceof Date 
      ? selectedDate 
      : typeof selectedDate === 'string' 
        ? new Date(selectedDate) 
        : new Date()
  );

  useEffect(() => {
    if (selectedDate instanceof Date) {
      setTempSelected(selectedDate);
    } else if (typeof selectedDate === 'string') {
      setTempSelected(new Date(selectedDate));
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Ajustar el índice para que la semana comience en Lunes (0=Lun, 6=Dom)
    const jsFirstDay = firstDay.getDay(); // 0=Dom ... 6=Sab
    const startingDay = (jsFirstDay + 6) % 7; // 0=Lun ... 6=Dom
    
    return { daysInMonth, startingDay };
  };

  const getPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Añadir T00:00:00 para evitar problemas de timezone
    const dateString = newDate.toISOString().split('T')[0] + 'T00:00:00';
    const selectedDate = new Date(dateString);
    
    // Validar que la fecha sea válida antes de establecerla
    if (!isNaN(selectedDate.getTime())) {
      setTempSelected(selectedDate);
      onDateSelect?.(selectedDate);
      onSelectDate?.(selectedDate.toISOString().slice(0, 10));
    }
  };

  const isSelectedDate = (day: number, isCurrentMonth: boolean) => {
    if (!tempSelected || !isCurrentMonth || !(tempSelected instanceof Date)) return false;
    return tempSelected.getDate() === day && 
           tempSelected.getMonth() === currentMonth.getMonth() && 
           tempSelected.getFullYear() === currentMonth.getFullYear();
  };

  const isToday = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    const today = new Date();
    // Validar que today sea una fecha válida
    if (isNaN(today.getTime())) return false;
    return today.getDate() === day && 
           today.getMonth() === currentMonth.getMonth() && 
           today.getFullYear() === currentMonth.getFullYear();
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    
    for (let i = startingDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <TouchableOpacity
          key={`prev-${day}`}
          style={[styles.cell, styles.otherMonthCell]}
          onPress={() => handleDateSelect(day, false)}
          disabled={true}
        >
          <Text style={styles.otherMonthText}>{day}</Text>
        </TouchableOpacity>
      );
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelectedDate(day, true);
      const today = isToday(day, true);
      
      days.push(
        <TouchableOpacity
          key={`current-${day}`}
          style={[
            styles.cell,
            selected && styles.selectedCell,
            today && !selected && styles.todayCell
          ]}
          onPress={() => handleDateSelect(day, true)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.dayText,
            selected && styles.selectedDayText,
            today && !selected && styles.todayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    // Días del mes siguiente para completar 6 semanas (42 celdas)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <TouchableOpacity
          key={`next-${day}`}
          style={[styles.cell, styles.otherMonthCell]}
          onPress={() => handleDateSelect(day, false)}
          disabled={true}
        >
          <Text style={styles.otherMonthText}>{day}</Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  const displayDate = tempSelected || selectedDate || new Date();
  
  // Asegurar que displayDate sea siempre una fecha válida
  const safeDisplayDate = displayDate instanceof Date ? displayDate : new Date();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <View style={styles.container}>
      {/* Header del calendario */}
      <View style={styles.heroHeader}>
        <Text style={styles.heroTitle}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <Text style={styles.heroSubtitle}>
          {safeDisplayDate.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Navegación del mes */}
      <View style={styles.navigationRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={getPreviousMonth}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.currentMonthText}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity
          style={styles.navBtn}
          onPress={getNextMonth}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Días de la semana */}
      <View style={styles.headerRow}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
          <View key={`${day}-${index}`} style={styles.headerCell}>
            <Text style={styles.headerText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grid del calendario */}
      <View style={styles.grid}>
        {renderCalendarDays()}
      </View>

      {/* Botones de acción (si se proporcionan) */}
      {(onCancel || onConfirm) && (
        <View style={styles.actionButtons}>
          {onCancel && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          )}
          {onConfirm && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.confirmBtn]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>Confirmar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroHeader: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: colors.textInverse,
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.textInverse,
    textAlign: 'center',
    textTransform: 'capitalize',
    opacity: 0.9,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentMonthText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  headerCell: {
    flexBasis: '14.2857%',
    maxWidth: '14.2857%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.xs,
  },
  cell: {
    flexBasis: '14.2857%',
    maxWidth: '14.2857%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: colors.textPrimary,
  },
  selectedCell: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  selectedDayText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  todayCell: {
    backgroundColor: colors.accent,
    ...shadows.sm,
  },
  todayText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  otherMonthText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.textTertiary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  cancelBtn: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.textSecondary,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.textInverse,
  },
});

export default Calendar;


