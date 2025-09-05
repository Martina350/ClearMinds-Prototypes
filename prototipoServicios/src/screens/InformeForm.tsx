import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Modal, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import * as ImagePicker from 'expo-image-picker';
import ReportService, { Report } from '../services/ReportService';
import ScheduleService from '../services/ScheduleService';
import { colors, typography, spacing, borderRadius, shadows, baseStyles } from '../styles/theme';
import type { InformeFormProps } from '../navigation/types';

const { width: screenWidth } = Dimensions.get('window');

export const InformeForm: React.FC<InformeFormProps> = ({ navigation, route }) => {
  const technicianId = route.params?.technicianId || '1';
  const technicianName = route.params?.technicianName || 'Técnico';
  const localId = route.params?.localId;
  const localName = route.params?.localName;
  const scheduleId = route.params?.scheduleId;
  
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [photoBeforeUris, setPhotoBeforeUris] = useState<string[]>([]);
  const [photoAfterUris, setPhotoAfterUris] = useState<string[]>([]);
  const [title, setTitle] = useState(localName ? `Informe - ${localName}` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageLoading, setImageLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  
  // Estados para visualizar el informe generado
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<Report | null>(null);
  
  // Estados para el picker de hora
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<'in' | 'out'>('in');
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');



  const handlePickImage = async (type: 'before' | 'after', source: 'camera' | 'gallery') => {
    try {
      setImageLoading(true);
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permisos', 'Se necesitan permisos de cámara para tomar fotos');
          setImageLoading(false);
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1.0,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1.0,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (type === 'before') {
          if (photoBeforeUris.length < 5) {
            setPhotoBeforeUris(prev => [...prev, uri]);
          } else {
            Alert.alert('Límite alcanzado', 'No puedes agregar más de 5 fotos antes.');
          }
        } else {
          if (photoAfterUris.length < 5) {
            setPhotoAfterUris(prev => [...prev, uri]);
          } else {
            Alert.alert('Límite alcanzado', 'No puedes agregar más de 5 fotos después.');
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar la imagen');
    } finally {
      setImageLoading(false);
    }
  };

  const handleImagePreview = (uri: string) => {
    setPreviewImage(uri);
    setShowImagePreview(true);
  };

  const removePhoto = (type: 'before' | 'after', index: number) => {
    if (type === 'before') {
      setPhotoBeforeUris(photoBeforeUris.filter((_, i) => i !== index));
    } else {
      setPhotoAfterUris(photoAfterUris.filter((_, i) => i !== index));
    }
  };

  // Funciones auxiliares para el estado del informe
  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'in_review': return colors.primary;
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      default: return colors.gray500;
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_review': return 'En Revisión';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      default: return 'Desconocido';
    }
  };

  // Funciones para el picker de hora
  const openTimePicker = (mode: 'in' | 'out') => {
    setTimePickerMode(mode);
    
    // Parsear la hora actual para mostrar en el picker
    const currentTime = mode === 'in' ? checkInTime : checkOutTime;
    const [hours, minutes] = currentTime.split(':').map(Number);
    
    setSelectedHour(hours % 12 || 12);
    setSelectedMinute(minutes);
    setSelectedPeriod(hours >= 12 ? 'PM' : 'AM');
    setShowTimePicker(true);
  };

  const handleTimeConfirm = () => {
    // Convertir a formato 24 horas
    let hour24 = selectedHour;
    if (selectedPeriod === 'PM' && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    } else if (selectedPeriod === 'AM' && selectedHour === 12) {
      hour24 = 0;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    
    if (timePickerMode === 'in') {
      setCheckInTime(timeString);
    } else {
      setCheckOutTime(timeString);
    }
    
    setShowTimePicker(false);
  };

  const handleTimeCancel = () => {
    setShowTimePicker(false);
  };

  const formatTimeForDisplay = (time: string) => {
    if (!time) return 'Seleccionar hora';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };



  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para el informe');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Por favor ingresa una descripción del trabajo');
      return;
    }

    setIsSubmitting(true);
    try {
      const reportService = ReportService.getInstance();
      
      const reportData = {
        technicianId,
        technicianName,
        localId,
        localName,
        title: title.trim(),
        checkInTime,
        checkOutTime,
        description: description.trim(),
        photoBeforeUris,
        photoAfterUris,
        status: 'pending' as const,
      };

      const savedReport = await reportService.createReport(reportData);
      
      // Si viene de una asignación, marcarla como completada para este técnico (sin borrar el cronograma)
      if (scheduleId) {
        try {
          await ScheduleService.getInstance().setChecklistStatus(scheduleId, technicianId, 'done');
        } catch {}
        Alert.alert('Asignación completada');
        navigation.navigate('TecnicoDashboard', { technicianId, technicianName });
        return;
      }
      
      // Flujo original: mostrar detalles del informe generado
      setGeneratedReport(savedReport);
      setShowReportDetails(true);
    } catch (error) {
      console.error('Error al guardar informe:', error);
      Alert.alert('Error', 'No se pudo guardar el informe. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPhotoSection = (type: 'before' | 'after', photos: string[]) => (
    <View style={styles.photoSection}>
      <View style={styles.photoHeader}>
        <Text style={styles.photoLabel}>
          {type === 'before' ? 'Antes' : 'Después'} ({photos.length}/5)
        </Text>
        <View style={styles.photoProgress}>
          <View style={[styles.progressBar, { width: `${(photos.length / 5) * 100}%` }]} />
        </View>
      </View>
      
      <View style={styles.photoButtons}>
        <TouchableOpacity 
          style={[styles.photoButton, styles.primaryButton]} 
          onPress={() => handlePickImage(type, 'camera')}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="camera-outline" size={16} color={colors.textInverse} style={{ marginRight: spacing.sm }} />
            <Text style={styles.photoButtonText}>Cámara</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.photoButton, styles.secondaryButton]} 
          onPress={() => handlePickImage(type, 'gallery')}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="image-outline" size={16} color={colors.textInverse} style={{ marginRight: spacing.sm }} />
            <Text style={styles.photoButtonText}>Galería</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {photos.length === 0 ? (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.placeholderText}>Sin fotos</Text>
        </View>
      ) : (
        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.photoGridItem}>
              <TouchableOpacity
                onPress={() => handleImagePreview(uri)}
                activeOpacity={0.9}
                style={styles.imageWrapper}
              >
                <Image 
                  source={{ uri: uri }} 
                  style={styles.photoPreview}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                />
                {imageLoading && (
                  <View style={styles.imageOverlay}>
                    <Ionicons name="hourglass-outline" size={20} color={colors.textInverse} />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removePhotoButton} 
                onPress={() => removePhoto(type, index)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={14} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={baseStyles.container} showsVerticalScrollIndicator={false}>

      <ScrollView 
        contentContainerStyle={baseStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.section}>
          <Text style={baseStyles.sectionTitle}>Horarios</Text>
          <View style={styles.timeContainer}>
            <TouchableOpacity
              style={[styles.timeButton, styles.halfInput]}
              onPress={() => openTimePicker('in')}
              activeOpacity={0.7}
            >
              <View style={styles.timeButtonContent}>
                <Text style={styles.timeButtonLabel}>Hora de Entrada</Text>
                <Text style={styles.timeButtonValue}>
                  {formatTimeForDisplay(checkInTime)}
                </Text>
                <Ionicons name="time-outline" size={20} color={colors.textSecondary} style={{ marginTop: spacing.xs }} />
              </View>
            </TouchableOpacity>

            <View style={styles.timeSeparatorContainer}>
              <Text style={styles.separatorText}>→</Text>
            </View>

            <TouchableOpacity
              style={[styles.timeButton, styles.halfInput]}
              onPress={() => openTimePicker('out')}
              activeOpacity={0.7}
            >
              <View style={styles.timeButtonContent}>
                <Text style={styles.timeButtonLabel}>Hora de Salida</Text>
                <Text style={styles.timeButtonValue}>
                  {formatTimeForDisplay(checkOutTime)}
                </Text>
                <Ionicons name="time-outline" size={20} color={colors.textSecondary} style={{ marginTop: spacing.xs }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={baseStyles.sectionTitle}>Título del informe</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Mantenimiento A/C - Edificio A"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={baseStyles.sectionTitle}>Descripción del trabajo</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe detalladamente las actividades realizadas, materiales utilizados, observaciones importantes..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={baseStyles.sectionTitle}>Evidencia fotográfica</Text>
          <View style={styles.photoContainer}>
            {renderPhotoSection('before', photoBeforeUris)}
            {renderPhotoSection('after', photoAfterUris)}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Guardando...' : 'Enviar Informe'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showImagePreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <View style={baseStyles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vista previa de imagen</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowImagePreview(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={18} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalImageContainer}>
              <Image
                source={{ uri: previewImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de detalles del informe generado */}
      <Modal
        visible={showReportDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReportDetails(false)}
      >
        <View style={baseStyles.modalOverlay}>
          <View style={[styles.modalContent, styles.reportDetailsModal]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} style={{ marginRight: spacing.sm }} />
                <Text style={styles.modalTitle}>Informe Generado Exitosamente</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowReportDetails(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={18} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {generatedReport && (
                <View style={styles.reportDetailsContainer}>
                  {/* Información básica */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Información General</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Título:</Text>
                      <Text style={styles.detailValue}>{generatedReport.title}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Técnico:</Text>
                      <Text style={styles.detailValue}>{generatedReport.technicianName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Estado:</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(generatedReport.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(generatedReport.status)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Horarios */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Horarios del Servicio</Text>
                    <View style={styles.horariosContainer}>
                      <View style={styles.horarioItem}>
                        <Text style={styles.horarioLabel}>Entrada:</Text>
                        <Text style={styles.horarioValue}>{formatTimeForDisplay(generatedReport.checkInTime)}</Text>
                      </View>
                      <View style={styles.horarioItem}>
                        <Text style={styles.horarioLabel}>Salida:</Text>
                        <Text style={styles.horarioValue}>{formatTimeForDisplay(generatedReport.checkOutTime)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Descripción */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Descripción del Trabajo</Text>
                    <Text style={styles.descriptionText}>{generatedReport.description}</Text>
                  </View>

                  {/* Fotos */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Evidencia Fotográfica</Text>
                    <View style={styles.photoSummary}>
                      <View style={styles.photoSummaryItem}>
                        <Ionicons name="camera-outline" size={20} color={colors.primary} />
                        <Text style={styles.photoSummaryText}>
                          Fotos "Antes": {generatedReport.photoBeforeUris.length}
                        </Text>
                      </View>
                      <View style={styles.photoSummaryItem}>
                        <Ionicons name="camera-outline" size={20} color={colors.success} />
                        <Text style={styles.photoSummaryText}>
                          Fotos "Después": {generatedReport.photoAfterUris.length}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Mensaje de confirmación */}
                  <View style={styles.confirmationMessage}>
                    <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
                    <Text style={styles.confirmationText}>
                      Tu informe ha sido guardado correctamente y será revisado por el administrador.
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.finishButton}
                onPress={() => {
                  setShowReportDetails(false);
                  navigation.goBack();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.finishButtonText}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Picker de hora personalizado */}
      {showTimePicker && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.timePickerModalOverlay}>
            <View style={styles.timePickerModalContent}>
              <View style={styles.timePickerHeader}>
                <Text style={styles.timePickerTitle}>
                  {timePickerMode === 'in' ? 'Hora de Entrada' : 'Hora de Salida'}
                </Text>
              </View>
              
              <View style={styles.timePickerBody}>
                <View style={styles.timePickerRow}>
                  {/* Selector de hora */}
                  <View style={styles.timePickerColumn}>
                    <Text style={styles.timePickerLabel}>Hora</Text>
                    <ScrollView 
                      style={styles.timePickerScrollHorizontal} 
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.timePickerScrollContent}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <TouchableOpacity
                          key={hour}
                          style={[
                            styles.timePickerOptionHorizontal,
                            selectedHour === hour && styles.timePickerOptionSelected
                          ]}
                          onPress={() => setSelectedHour(hour)}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.timePickerOptionText,
                            selectedHour === hour && styles.timePickerOptionTextSelected
                          ]}>
                            {hour.toString().padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  
                  <Text style={styles.timePickerSeparator}>:</Text>
                  
                  {/* Selector de minutos */}
                  <View style={styles.timePickerColumn}>
                    <Text style={styles.timePickerLabel}>Minutos</Text>
                    <ScrollView 
                      style={styles.timePickerScrollHorizontal} 
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.timePickerScrollContent}
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <TouchableOpacity
                          key={minute}
                          style={[
                            styles.timePickerOptionHorizontal,
                            selectedMinute === minute && styles.timePickerOptionSelected
                          ]}
                          onPress={() => setSelectedMinute(minute)}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.timePickerOptionText,
                            selectedMinute === minute && styles.timePickerOptionTextSelected
                          ]}>
                            {minute.toString().padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  
                  {/* Selector de AM/PM */}
                  <View style={styles.timePickerColumn}>
                    <Text style={styles.timePickerLabel}>Periodo</Text>
                    <View style={styles.periodContainer}>
                      <TouchableOpacity
                        style={[
                          styles.periodOption,
                          selectedPeriod === 'AM' && styles.periodOptionSelected
                        ]}
                        onPress={() => setSelectedPeriod('AM')}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.periodOptionText,
                          selectedPeriod === 'AM' && styles.periodOptionTextSelected
                        ]}>
                          AM
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.periodOption,
                          selectedPeriod === 'PM' && styles.periodOptionSelected
                        ]}
                        onPress={() => setSelectedPeriod('PM')}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.periodOptionText,
                          selectedPeriod === 'PM' && styles.periodOptionTextSelected
                        ]}>
                          PM
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.timePickerFooter}>
                <TouchableOpacity
                  style={styles.timePickerCancelButton}
                  onPress={handleTimeCancel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.timePickerCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timePickerConfirmButton}
                  onPress={handleTimeConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.timePickerConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
    marginHorizontal: spacing.xs,
  },
  halfInput: {
    flex: 1,
  },
  timeButtonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  timeButtonValue: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  timeSeparatorContainer: {
    paddingHorizontal: spacing.lg,
  },
  separatorText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  titleInput: {
    ...baseStyles.input,
    backgroundColor: colors.surfaceSecondary,
  },
  descriptionInput: {
    ...baseStyles.input,
    backgroundColor: colors.surfaceSecondary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  photoContainer: {
    gap: spacing.lg,
  },
  photoSection: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  photoHeader: {
    marginBottom: spacing.md,
  },
  photoLabel: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  photoProgress: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  photoButtonText: {
    color: colors.textInverse,
    ...typography.buttonSmall,
  },
  photoPlaceholder: {
    height: 110,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: colors.textSecondary,
    ...typography.bodySmall,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: spacing.sm,
  },
  photoGridItem: {
    position: 'relative',
    width: 100,
    height: 75,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.error,
    borderRadius: borderRadius.lg,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  submitButton: {
    ...baseStyles.button,
    ...baseStyles.buttonPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
    alignSelf: 'center',
    minWidth: 200,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray500,
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    ...baseStyles.buttonText,
    textAlign: 'center',
  },
  modalContent: {
    ...baseStyles.modalContent,
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    ...baseStyles.modalHeader,
    paddingTop: spacing.xl,
  },
  modalTitle: {
    ...baseStyles.modalTitle,
  },
  modalCloseButton: {
    ...baseStyles.modalCloseButton,
    width: 40,
    height: 40,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  // Estilos para el Picker de hora personalizado
  timePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  timePickerModalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.lg,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timePickerTitle: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  timePickerBody: {
    padding: spacing.lg,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  timePickerColumn: {
    alignItems: 'center',
    flex: 1,
  },
  timePickerLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  timePickerScroll: {
    height: 200,
    width: '100%',
  },
  timePickerScrollHorizontal: {
    height: 60,
    width: '100%',
  },
  timePickerScrollContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  timePickerOptionHorizontal: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    minWidth: 50,
  },
  timePickerOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    marginVertical: spacing.xs,
    alignItems: 'center',
  },
  timePickerOptionSelected: {
    backgroundColor: colors.primary,
  },
  timePickerOptionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  timePickerOptionTextSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  timePickerSeparator: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  periodOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodOptionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  periodOptionTextSelected: {
    color: colors.textInverse,
  },
  timePickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timePickerCancelButton: {
    ...baseStyles.button,
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.gray500,
    backgroundColor: 'transparent',
    marginRight: spacing.md,
  },
  timePickerCancelText: {
    color: colors.gray500,
    ...typography.body,
  },
  timePickerConfirmButton: {
    ...baseStyles.button,
    ...baseStyles.buttonPrimary,
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.md,
  },
  timePickerConfirmText: {
    ...baseStyles.buttonText,
  },

  // Estilos para el modal de detalles del informe
  reportDetailsModal: {
    width: '90%',
    maxHeight: '80%',
  },
  modalBody: {
    flex: 1,
    padding: spacing.lg,
  },
  reportDetailsContainer: {
    gap: spacing.lg,
  },
  detailSection: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  detailSectionTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  horariosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  horarioItem: {
    alignItems: 'center',
    flex: 1,
  },
  horarioLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  horarioValue: {
    ...typography.h6,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.labelSmall,
    color: colors.textInverse,
    fontWeight: '600',
  },
  descriptionText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  photoSummary: {
    gap: spacing.md,
  },
  photoSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoSummaryText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  confirmationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  confirmationText: {
    ...typography.body,
    color: colors.textInverse,
    flex: 1,
    lineHeight: 22,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  finishButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  finishButtonText: {
    ...baseStyles.buttonText,
    color: colors.textInverse,
  },
});
