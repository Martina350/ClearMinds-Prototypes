import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TechnicianScreen() {
  const [description, setDescription] = useState('');
  const [photoBeforeUris, setPhotoBeforeUris] = useState([]);
  const [photoAfterUris, setPhotoAfterUris] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handlePickImage = async (type, source) => {
    try {
      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permisos', 'Se necesitan permisos de cámara');
          return;
        }
        result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (type === 'before' && photoBeforeUris.length < 5) {
          setPhotoBeforeUris(prev => [...prev, uri]);
        } else if (type === 'after' && photoAfterUris.length < 5) {
          setPhotoAfterUris(prev => [...prev, uri]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar la imagen');
    }
  };

  const handleImagePreview = (uri) => {
    setPreviewImage(uri);
    setShowImagePreview(true);
  };

  const removePhoto = (type, index) => {
    if (type === 'before') {
      setPhotoBeforeUris(photoBeforeUris.filter((_, i) => i !== index));
    } else {
      setPhotoAfterUris(photoAfterUris.filter((_, i) => i !== index));
    }
  };

  const saveReport = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Por favor escribe una descripción');
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      description,
      photosBefore: photoBeforeUris,
      photosAfter: photoAfterUris,
      createdAt: new Date().toLocaleString(),
    };

    try {
      const storedReports = await AsyncStorage.getItem('reports');
      const reports = storedReports ? JSON.parse(storedReports) : [];
      reports.push(newReport);
      await AsyncStorage.setItem('reports', JSON.stringify(reports));

      Alert.alert('Éxito', 'Informe guardado correctamente');
      setDescription('');
      setPhotoBeforeUris([]);
      setPhotoAfterUris([]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el informe');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Informe</Text>

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Describe el trabajo realizado"
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Fotos Antes:</Text>
      <View style={styles.row}>
        <Button title="📷 Cámara" onPress={() => handlePickImage('before', 'camera')} />
        <Button title="🖼 Galería" onPress={() => handlePickImage('before', 'gallery')} />
      </View>
      <FlatList
        horizontal
        data={photoBeforeUris}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleImagePreview(item)} onLongPress={() => removePhoto('before', index)}>
            <Image source={{ uri: item }} style={styles.thumbnail} />
          </TouchableOpacity>
        )}
      />

      <Text style={styles.label}>Fotos Después:</Text>
      <View style={styles.row}>
        <Button title="📷 Cámara" onPress={() => handlePickImage('after', 'camera')} />
        <Button title="🖼 Galería" onPress={() => handlePickImage('after', 'gallery')} />
      </View>
      <FlatList
        horizontal
        data={photoAfterUris}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleImagePreview(item)} onLongPress={() => removePhoto('after', index)}>
            <Image source={{ uri: item }} style={styles.thumbnail} />
          </TouchableOpacity>
        )}
      />

      <Button title="Enviar Informe" onPress={saveReport} />

      {/* Modal para previsualizar imagen */}
      <Modal visible={showImagePreview} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: previewImage }} style={styles.previewImage} />
          <Button title="Cerrar" onPress={() => setShowImagePreview(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, minHeight: 60, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  thumbnail: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  previewImage: { width: '90%', height: '70%', resizeMode: 'contain' },
});
