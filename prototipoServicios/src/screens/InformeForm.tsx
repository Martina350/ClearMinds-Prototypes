import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Modal } from 'react-native';
// @ts-ignore
import * as ImagePicker from 'expo-image-picker';

type Props = {
  onBack: () => void;
};

export const InformeForm: React.FC<Props> = ({ onBack }) => {
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [photoBeforeUris, setPhotoBeforeUris] = useState<string[]>([]);
  const [photoAfterUris, setPhotoAfterUris] = useState<string[]>([]);
  const [signatureData, setSignatureData] = useState<string | undefined>(undefined);
  const [imageLoading, setImageLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

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
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (type === 'before') {
          if (photoBeforeUris.length < 5) {
            setPhotoBeforeUris(prev => [...prev, uri]);
          } else {
            Alert.alert('Error', 'No puedes agregar más de 5 fotos antes.');
          }
        } else {
          if (photoAfterUris.length < 5) {
            setPhotoAfterUris(prev => [...prev, uri]);
          } else {
            Alert.alert('Error', 'No puedes agregar más de 5 fotos después.');
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

  const handleFakeSignature = () => {
    setSignatureData('data:image/png;base64,FAKE_SIGNATURE_DATA_BASE64');
    Alert.alert('Firma', 'Firma simulada capturada');
  };

  const handleSubmit = () => {
    console.log('Informe enviado:', {
      checkInTime,
      checkOutTime,
      description,
      photoBeforeUris,
      photoAfterUris,
      signatureData,
    });
    Alert.alert('Éxito', 'Informe enviado correctamente');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Informe de Mantenimiento</Text>
        <View style={{ width: 72 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.formRow}>
          <Text style={styles.label}>Hora de entrada</Text>
          <TextInput
            style={styles.input}
            value={checkInTime}
            onChangeText={setCheckInTime}
            placeholder="HH:MM"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Hora de salida</Text>
          <TextInput
            style={styles.input}
            value={checkOutTime}
            onChangeText={setCheckOutTime}
            placeholder="HH:MM"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Descripción del trabajo realizado</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe detalladamente las actividades realizadas..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Fotos</Text>
          <View style={styles.photoContainer}>
            <View style={styles.photoSection}>
              <Text style={styles.photoLabel}>Antes ({photoBeforeUris.length}/5)</Text>
              <View style={styles.photoButtons}>
                <TouchableOpacity style={[styles.photoButton, styles.cameraButton]} onPress={() => handlePickImage('before', 'camera')}>
                  <Text style={styles.photoButtonText}>📷 Cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.photoButton, styles.galleryButton]} onPress={() => handlePickImage('before', 'gallery')}>
                  <Text style={styles.photoButtonText}>🖼️ Galería</Text>
                </TouchableOpacity>
              </View>
              {photoBeforeUris.length === 0 ? (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.placeholderText}>Sin fotos</Text>
                </View>
              ) : (
                <View style={styles.photoGrid}>
                  {photoBeforeUris.map((uri, index) => (
                    <View key={index} style={styles.photoGridItem}>
                      <TouchableOpacity
                        onPress={() => handleImagePreview(uri)}
                        activeOpacity={0.8}
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
                            <Text style={styles.overlayText}>Cargando...</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.removePhotoButton} onPress={() => removePhoto('before', index)}>
                        <Text style={styles.removePhotoText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.photoSection}>
              <Text style={styles.photoLabel}>Después ({photoAfterUris.length}/5)</Text>
              <View style={styles.photoButtons}>
                <TouchableOpacity style={[styles.photoButton, styles.cameraButton]} onPress={() => handlePickImage('after', 'camera')}>
                  <Text style={styles.photoButtonText}>📷 Cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.photoButton, styles.galleryButton]} onPress={() => handlePickImage('after', 'gallery')}>
                  <Text style={styles.photoButtonText}>🖼️ Galería</Text>
                </TouchableOpacity>
              </View>
              {photoAfterUris.length === 0 ? (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.placeholderText}>Sin fotos</Text>
                </View>
              ) : (
                <View style={styles.photoGrid}>
                  {photoAfterUris.map((uri, index) => (
                    <View key={index} style={styles.photoGridItem}>
                      <TouchableOpacity
                        onPress={() => handleImagePreview(uri)}
                        activeOpacity={0.8}
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
                            <Text style={styles.overlayText}>Cargando...</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.removePhotoButton} onPress={() => removePhoto('after', index)}>
                        <Text style={styles.removePhotoText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Firma del cliente</Text>
          <View style={styles.signatureContainer}>
            <View style={styles.signaturePad}>
              <Text style={styles.signatureText}>
                {signatureData ? 'Firma capturada ✓' : 'Área de firma'}
              </Text>
            </View>
            <TouchableOpacity style={styles.signatureButton} onPress={handleFakeSignature}>
              <Text style={styles.signatureButtonText}>Capturar Firma</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Informe</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para vista previa de imagen */}
      <Modal
        visible={showImagePreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalImageContainer}>
              <Image
                source={{ uri: previewImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => setShowImagePreview(false)}
              >
                <Text style={styles.modalActionButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    backgroundColor: '#757575',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  backText: {
    color: 'white',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  formContainer: {
    flexGrow: 1,
    padding: 16,
  },
  formRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  photoSection: {
    flex: 1,
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  photoButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cameraButton: {
    backgroundColor: '#4CAF50', // A different color for camera
  },
  galleryButton: {
    backgroundColor: '#FF9800', // A different color for gallery
  },
  photoButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  photoGridItem: {
    position: 'relative',
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  imageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removePhotoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  photoPlaceholder: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999999',
    fontSize: 12,
  },
  signatureContainer: {
    alignItems: 'center',
  },
  signaturePad: {
    width: '100%',
    height: 120,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  signatureText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  signatureButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  signatureButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    height: '80%',
    overflow: 'hidden',
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalFooter: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalActionButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalActionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
