import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const availableDates = [
    '2024-12-20', '2024-12-21', '2024-12-22', '2024-12-23', '2024-12-24'
  ];

  const availableTimes = selectedDate ? getAvailableTimeSlots(selectedDate, service.id) : [];

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

        {/* Client Type Selection */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tipo de Cliente</Text>
          <View style={styles.clientTypeContainer}>
            <TouchableOpacity
              style={[
                styles.clientTypeButton,
                clientType === 'casa' && styles.clientTypeButtonActive
              ]}
              onPress={() => setClientType('casa')}
            >
              <Text style={[
                styles.clientTypeText,
                clientType === 'casa' && styles.clientTypeTextActive
              ]}>
                Casa
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.clientTypeButton,
                clientType === 'empresa' && styles.clientTypeButtonActive
              ]}
              onPress={() => setClientType('empresa')}
            >
              <Text style={[
                styles.clientTypeText,
                clientType === 'empresa' && styles.clientTypeTextActive
              ]}>
                Empresa
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Date Selection */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Seleccionar Fecha</Text>
          <View style={styles.dateContainer}>
            {availableDates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateButton,
                  selectedDate === date && styles.dateButtonActive
                ]}
                onPress={() => {
                  setSelectedDate(date);
                  setSelectedTime(''); // Reset time when date changes
                }}
              >
                <Text style={[
                  styles.dateText,
                  selectedDate === date && styles.dateTextActive
                ]}>
                  {new Date(date).toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Seleccionar Hora</Text>
            <View style={styles.timeContainer}>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.timeButtonActive
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextActive
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
          </Card>
        )}

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
