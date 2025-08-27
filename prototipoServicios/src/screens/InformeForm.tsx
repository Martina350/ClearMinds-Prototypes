import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Modal, Animated, Dimensions, Platform } from 'react-native';
// @ts-ignore
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  onBack: () => void;
};

export const InformeForm: React.FC<Props> = ({ onBack }) => {
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [photoBeforeUris, setPhotoBeforeUris] = useState<string[]>([]);
  const [photoAfterUris, setPhotoAfterUris] = useState<string[]>([]);

  const [imageLoading, setImageLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Estados para el picker de hora
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<'in' | 'out'>('in');
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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



  const handleSubmit = () => {
    console.log('Informe enviado:', {
      checkInTime,
      checkOutTime,
      description,
      photoBeforeUris,
      photoAfterUris,
    });
    Alert.alert('¡Éxito!', 'Informe enviado correctamente');
  };

  const renderPhotoSection = (type: 'before' | 'after', photos: string[]) => (
    <View style={styles.photoSection}>
      <View style={styles.photoHeader}>
        <Text style={styles.photoLabel}>
          {type === 'before' ? '🕐 Antes' : '✅ Después'} ({photos.length}/5)
        </Text>
        <View style={styles.photoProgress}>
          <View style={[styles.progressBar, { width: `${(photos.length / 5) * 100}%` }]} />
        </View>
      </View>
      
      <View style={styles.photoButtons}>
        <TouchableOpacity 
          style={[styles.photoButton, styles.cameraButton]} 
          onPress={() => handlePickImage(type, 'camera')}
          activeOpacity={0.8}
        >
          <Text style={styles.photoButtonText}>📷 Cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.photoButton, styles.galleryButton]} 
          onPress={() => handlePickImage(type, 'gallery')}
          activeOpacity={0.8}
        >
          <Text style={styles.photoButtonText}>🖼️ Galería</Text>
        </TouchableOpacity>
      </View>
      
      {photos.length === 0 ? (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.placeholderIcon}>📸</Text>
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
                    <Text style={styles.overlayText}>⏳</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removePhotoButton} 
                onPress={() => removePhoto(type, index)}
                activeOpacity={0.7}
              >
                <Text style={styles.removePhotoText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>📋 Informe de Mantenimiento</Text>
          <Text style={styles.subtitle}>Registro detallado del servicio</Text>
        </View>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Horarios</Text>
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
              </View>
              <Text style={styles.timeButtonIcon}>🕐</Text>
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
              </View>
              <Text style={styles.timeButtonIcon}>🕐</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Descripción del trabajo</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe detalladamente las actividades realizadas, materiales utilizados, observaciones importantes..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Evidencia fotográfica</Text>
          <View style={styles.photoContainer}>
            {renderPhotoSection('before', photoBeforeUris)}
            {renderPhotoSection('after', photoAfterUris)}
          </View>
        </View>



        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>🚀 Enviar Informe</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showImagePreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📸 Vista previa de imagen</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowImagePreview(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
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
                    <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <TouchableOpacity
                          key={hour}
                          style={[
                            styles.timePickerOption,
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
                    <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <TouchableOpacity
                          key={minute}
                          style={[
                            styles.timePickerOption,
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C757D',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  backIcon: {
    color: 'white',
    fontSize: 18,
    marginRight: 4,
  },
  backText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  timeField: {
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeSeparator: {
    paddingHorizontal: 20,
  },
  separatorText: {
    fontSize: 20,
    color: '#6C757D',
    fontWeight: '600',
  },
  descriptionInput: {
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  photoContainer: {
    gap: 20,
  },
  photoSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  photoHeader: {
    marginBottom: 12,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 8,
  },
  photoProgress: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#28A745',
    borderRadius: 2,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#28A745',
  },
  galleryButton: {
    backgroundColor: '#FFC107',
  },
  photoButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  photoPlaceholder: {
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DEE2E6',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  placeholderText: {
    color: '#6C757D',
    fontSize: 14,
    fontWeight: '500',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  photoGridItem: {
    position: 'relative',
    width: 100,
    height: 75,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC3545',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  removePhotoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 18,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  modalCloseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 4,
  },
  halfInput: {
    flex: 1,
  },
  timeButtonContent: {
    flex: 1,
    marginRight: 10,
  },
  timeButtonLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  timeButtonValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  timeButtonIcon: {
    fontSize: 24,
  },
  timeSeparatorContainer: {
    paddingHorizontal: 20,
  },
  // Estilos para el Picker de hora personalizado
  timePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  timePickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  timePickerBody: {
    padding: 20,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 10,
  },
  timePickerScroll: {
    height: 200,
    width: '100%',
  },
  timePickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
  },
  timePickerOptionSelected: {
    backgroundColor: '#007BFF',
  },
  timePickerOptionText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  timePickerOptionTextSelected: {
    color: 'white',
    fontWeight: '700',
  },
  timePickerSeparator: {
    fontSize: 24,
    fontWeight: '700',
    color: '#495057',
    marginHorizontal: 10,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  periodOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  periodOptionSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  periodOptionText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  periodOptionTextSelected: {
    color: 'white',
  },
  timePickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  timePickerCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6C757D',
    backgroundColor: 'transparent',
    marginRight: 10,
    alignItems: 'center',
  },
  timePickerCancelText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },
  timePickerConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007BFF',
    marginLeft: 10,
    alignItems: 'center',
  },
  timePickerConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
