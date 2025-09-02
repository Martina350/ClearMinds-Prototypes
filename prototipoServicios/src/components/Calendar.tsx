import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';

type Props = {
  date?: Date;
  selectedDate?: string; // YYYY-MM-DD
  onSelectDate: (yyyyMmDd: string) => void;
  onCancel?: () => void;
  onConfirm?: (yyyyMmDd: string) => void;
};

const toYmd = (d: Date) => d.toISOString().slice(0, 10);

const getMonthGrid = (baseDate: Date) => {
  // Base en el primer día del mes
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  // Semana iniciando en Domingo (como en la imagen)
  const weekday = firstOfMonth.getDay(); // Domingo=0 ... Sábado=6
  const gridStart = new Date(year, month, 1 - weekday);
  // 6 filas x 7 días = 42 celdas, sin huecos
  const days: { date: Date; inCurrentMonth: boolean; isSunday: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const inCurrentMonth = d.getMonth() === month;
    const isSunday = d.getDay() === 0; // Domingo
    days.push({ date: d, inCurrentMonth, isSunday });
  }
  return days;
};

export const Calendar: React.FC<Props> = ({ date = new Date(), selectedDate, onSelectDate, onCancel, onConfirm }) => {
  const [baseDate, setBaseDate] = useState<Date>(new Date(date));
  const [tempSelected, setTempSelected] = useState<string | undefined>(selectedDate);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  // Sincronizar tempSelected con selectedDate cuando cambie
  useEffect(() => {
    if (selectedDate) {
      setTempSelected(selectedDate);
    }
  }, [selectedDate]);

  const days = useMemo(() => getMonthGrid(baseDate), [baseDate]);

  const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));

  const goPrevMonth = () => setBaseDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setBaseDate(new Date(year, month + 1, 1));

  // Usar la fecha seleccionada para el encabezado azul
  const displayDate = tempSelected ? new Date(tempSelected + 'T00:00:00') : (selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date());
  const headerYear = displayDate.getFullYear().toString();
  const headerLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(displayDate);
  const headerPretty = headerLabel.replace(',', '').replace('.', '');

  return (
    <View style={styles.container}>
      {/* Encabezado azul como la imagen */}
      <View style={styles.hero}>
        <Text style={styles.heroYear}>{headerYear}</Text>
        <Text style={styles.heroTitle}>{headerPretty}</Text>
      </View>

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.navBtn} onPress={goPrevMonth} activeOpacity={0.8}>
          <Text style={styles.navBtnText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{monthLabel[0].toUpperCase() + monthLabel.slice(1)}</Text>
        <TouchableOpacity style={styles.navBtn} onPress={goNextMonth} activeOpacity={0.8}>
          <Text style={styles.navBtnText}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((w, idx) => (
          <Text key={`w-${idx}`} style={styles.weekLabel}>{w}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map(({ date: d, inCurrentMonth, isSunday }, idx) => {
          const ymd = toYmd(d);
          const isSelected = (tempSelected || selectedDate) === ymd;
          return (
            <TouchableOpacity
              key={`${ymd}-${idx}`}
              style={[styles.cell, isSelected && styles.cellSelected]}
              onPress={() => { setTempSelected(ymd); onSelectDate(ymd); }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.cellText,
                  !inCurrentMonth && styles.cellTextOutside,
                  isSunday && styles.sundayText,
                  isSelected && styles.cellTextSelected,
                ]}
              >
                {d.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {(onCancel || onConfirm) && (
        <View style={styles.actionsRow}>
          {onCancel && (
            <TouchableOpacity style={styles.actionBtn} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.actionText}>CANCELAR</Text>
            </TouchableOpacity>
          )}
          {onConfirm && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onConfirm(tempSelected || toYmd(new Date()))} activeOpacity={0.8}>
              <Text style={styles.actionText}>ACEPTAR</Text>
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
    borderRadius: borderRadius.lg,
    padding: 0,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  heroYear: {
    ...typography.h6,
    color: colors.textInverse,
    opacity: 0.9,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    color: colors.textInverse,
    fontWeight: '800',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    ...typography.h6,
    color: colors.textPrimary,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: {
    ...typography.h6,
    color: colors.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  weekLabel: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    color: colors.textSecondary,
    ...typography.labelSmall,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  cellSelected: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  cellText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  cellTextOutside: {
    color: colors.gray400,
  },
  sundayText: {
    color: colors.error,
  },
  cellTextSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  actionText: {
    ...typography.buttonSmall,
    color: colors.primary,
    letterSpacing: 1,
  },
});

export default Calendar;


