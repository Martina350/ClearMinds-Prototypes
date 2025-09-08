import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { FinalButton as Button } from '../../components/FinalButton';
import { Input } from '../../components/Input';
import { AppIcons } from '../../components/Icon';
import { getAvailableTimeSlots } from '../../data/database';

interface BookingScreenProps {
  service: any;
  user: any;
  onBack: () => void;
  onContinue: (bookingData: any) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  service,
  user,
  onBack,
  onContinue
}) => {
  const [clientType, setClientType] = useState<'casa' | 'empresa'>('casa');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [openClientType, setOpenClientType] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const availableDates = [
    '2024-12-20', '2024-12-21', '2024-12-22', '2024-12-23', '2024-12-24'
  ];

  const availableTimes = selectedDate ? getAvailableTimeSlots(selectedDate, service.id) : [];

  const formattedDate = (date: string) => new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const dateOptions = useMemo(() => availableDates.map(d => ({
    label: formattedDate(d), value: d
  })), [availableDates]);

  const timeOptions = useMemo(() => availableTimes.map(t => ({ label: t, value: t })), [availableTimes]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedDate) {
      newErrors.date = 'Debes seleccionar una fecha';
    }

    if (!selectedTime) {
      newErrors.time = 'Debes seleccionar una hora';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      const bookingData = {
        service,
        clientType,
        date: selectedDate,
        time: selectedTime,
        duration: clientType === 'empresa' ? service.duration * 1.5 : service.duration
      };
      onContinue(bookingData);
    }
  };

  const getServiceIcon = (imageName: string) => {
    switch (imageName) {
      case 'toilet':
        return AppIcons.toilet(48, colors.textWhite);
      case 'septic':
        return AppIcons.septic(48, colors.textWhite);
      case 'grease':
        return AppIcons.grease(48, colors.textWhite);
      case 'trash':
        return AppIcons.trash(48, colors.textWhite);
      case 'debris':
        return AppIcons.debris(48, colors.textWhite);
      default:
        return AppIcons.toilet(48, colors.textWhite);
    }
  };

  // Dropdown simple reutilizable
  const Dropdown = ({
    label,
    placeholder,
    valueLabel,
    open,
    setOpen,
    options,
    onSelect,
    leftIcon
  }: {
    label: string;
    placeholder: string;
    valueLabel: string;
    open: boolean;
    setOpen: (o: boolean) => void;
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
    leftIcon?: React.ReactNode;
  }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.sectionTitleInline}>{label}</Text>
      <TouchableOpacity
        style={styles.selectField}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        {leftIcon}
        <Text style={[styles.selectText, !valueLabel && styles.selectPlaceholder]}>
          {valueLabel || placeholder}
        </Text>
        <View style={styles.chevron}>{AppIcons.chevronDown(16, colors.textSecondary)}</View>
      </TouchableOpacity>
      {open && (
        <View style={styles.optionsPanel}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={styles.optionItem}
              onPress={() => { onSelect(opt.value); setOpen(false); }}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerPlaceholder}>
        <Text style={styles.headerTitle}>Agendar Servicio</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Details */}
        <Card style={styles.serviceCard}>
          <View style={styles.serviceImageContainer}>
            {getServiceIcon(service.image)}
          </View>
          
          <View style={styles.serviceContent}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.servicePrice}>${service.price}</Text>
            <Text style={styles.serviceDuration}>
              Duración: {clientType === 'empresa' ? Math.round(service.duration * 1.5) : service.duration} minutos
            </Text>
          </View>
        </Card>

        {/* Campos con desplegables */}
        <Card style={styles.sectionCard}>
          <Dropdown
            label="Tipo de Cliente:"
            placeholder="Seleccionar tipo"
            valueLabel={clientType === 'casa' ? 'Casa' : 'Empresa'}
            open={openClientType}
            setOpen={setOpenClientType}
            options={[{ label: 'Casa', value: 'casa' }, { label: 'Empresa', value: 'empresa' }]}
            onSelect={(v) => setClientType(v as 'casa' | 'empresa')}
          />

          <Dropdown
            label="Fecha:"
            placeholder="dd/mm/aaaa"
            valueLabel={selectedDate ? formattedDate(selectedDate) : ''}
            open={openDate}
            setOpen={(o) => { setOpenDate(o); if (o) { setOpenTime(false); } }}
            options={dateOptions}
            onSelect={(v) => { setSelectedDate(v); setSelectedTime(''); }}
            leftIcon={<View style={styles.leadingIcon}>{AppIcons.calendar(16, colors.textSecondary)}</View>}
          />
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

          <Dropdown
            label="Hora:"
            placeholder="Seleccionar hora"
            valueLabel={selectedTime}
            open={openTime}
            setOpen={(o) => { setOpenTime(o); if (o) { setOpenDate(false); } }}
            options={timeOptions}
            onSelect={(v) => setSelectedTime(v)}
          />
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
        </Card>

        {/* Continue Button */}
        <Button
          title="SELECCIONAR Y CONTINUAR"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  serviceCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  serviceImageContainer: {
    backgroundColor: colors.primary,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 48,
  },
  serviceContent: {
    padding: spacing.md,
  },
  serviceName: {
    ...typography.h4,
    marginBottom: spacing.sm,
  },
  serviceDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  servicePrice: {
    ...typography.price,
    marginBottom: spacing.xs,
  },
  serviceDuration: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  sectionTitleInline: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  clientTypeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  clientTypeButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  clientTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  clientTypeText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  clientTypeTextActive: {
    color: colors.textWhite,
  },
  dateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dateButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  dateButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  dateTextActive: {
    color: colors.textWhite,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  timeTextActive: {
    color: colors.textWhite,
  },
  dropdownContainer: {
    marginBottom: spacing.md,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  leadingIcon: {
    marginRight: spacing.sm,
  },
  selectText: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  selectPlaceholder: {
    color: colors.textLight,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  optionsPanel: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  continueButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.sm,
  },
  headerPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
  },
});
