// Pantalla de Métodos de Pago
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Payment, Student } from '../types';

interface PaymentMethodScreenProps {
  navigation: any;
  route: any;
}

export const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({ navigation, route }) => {
  const { payment, student }: { payment: Payment; student: Student } = route.params;
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'transfer' | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const handleCardPayment = () => {
    Alert.alert(
      'Pago con Tarjeta',
      `¿Deseas proceder con el pago de $${payment.amount} para ${payment.description}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Pagar', 
          onPress: () => {
            // Simular procesamiento de pago
            Alert.alert(
              'Pago Exitoso',
              'El pago se ha procesado correctamente.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  const handleTransferPayment = () => {
    Alert.alert(
      'Pago por Transferencia',
      'Selecciona el método para subir el comprobante:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cámara', onPress: () => pickImageFromCamera() },
        { text: 'Galería', onPress: () => pickImageFromGallery() },
        { text: 'Documento', onPress: () => pickDocument() }
      ]
    );
  };

  const pickImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Error', 'Permisos de cámara requeridos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Error', 'Permisos de galería requeridos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setReceiptImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el documento');
    }
  };

  const submitTransferReceipt = () => {
    if (!receiptImage) {
      Alert.alert('Error', 'Debes seleccionar un comprobante');
      return;
    }

    Alert.alert(
      'Comprobante Enviado',
      'El comprobante ha sido enviado para revisión. Recibirás una notificación cuando sea aprobado.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>Detalle del Pago</Text>
        <View style={styles.paymentCard}>
          <Text style={styles.paymentDescription}>{payment.description}</Text>
          <Text style={styles.paymentAmount}>${payment.amount}</Text>
          <Text style={styles.paymentStudent}>Estudiante: {student.name}</Text>
          <Text style={styles.paymentDueDate}>Vence: {payment.dueDate}</Text>
        </View>
      </View>

      <View style={styles.methodsContainer}>
        <Text style={styles.methodsTitle}>Selecciona el método de pago:</Text>
        
        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'card' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('card')}
        >
          <View style={styles.methodHeader}>
            <Ionicons name="card-outline" size={30} color="#e74c3c" />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Tarjeta de Crédito/Débito</Text>
              <Text style={styles.methodDescription}>
                Pago seguro con tarjeta bancaria
              </Text>
            </View>
            <View style={[styles.radioButton, selectedMethod === 'card' && styles.radioButtonSelected]}>
              {selectedMethod === 'card' && <View style={styles.radioButtonInner} />}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'transfer' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('transfer')}
        >
          <View style={styles.methodHeader}>
            <Ionicons name="swap-horizontal-outline" size={30} color="#e74c3c" />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Transferencia Bancaria</Text>
              <Text style={styles.methodDescription}>
                Sube el comprobante de transferencia
              </Text>
            </View>
            <View style={[styles.radioButton, selectedMethod === 'transfer' && styles.radioButtonSelected]}>
              {selectedMethod === 'transfer' && <View style={styles.radioButtonInner} />}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {selectedMethod === 'card' && (
        <View style={styles.cardPaymentContainer}>
          <Text style={styles.sectionTitle}>Información de la Tarjeta</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoText}>
              • Procesamiento seguro con encriptación SSL
            </Text>
            <Text style={styles.cardInfoText}>
              • Aceptamos Visa, Mastercard, American Express
            </Text>
            <Text style={styles.cardInfoText}>
              • El pago se procesará inmediatamente
            </Text>
          </View>
          
          <TouchableOpacity style={styles.payButton} onPress={handleCardPayment}>
            <Ionicons name="card-outline" size={20} color="white" />
            <Text style={styles.payButtonText}>Pagar con Tarjeta</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedMethod === 'transfer' && (
        <View style={styles.transferPaymentContainer}>
          <Text style={styles.sectionTitle}>Comprobante de Transferencia</Text>
          
          <View style={styles.bankInfo}>
            <Text style={styles.bankTitle}>Datos para la transferencia:</Text>
            <Text style={styles.bankData}>Banco: Banco de Bogotá</Text>
            <Text style={styles.bankData}>Cuenta: 1234567890</Text>
            <Text style={styles.bankData}>Titular: Escuela de Baloncesto San Pedro</Text>
            <Text style={styles.bankData}>Concepto: {payment.description}</Text>
          </View>

          {receiptImage ? (
            <View style={styles.receiptContainer}>
              <Text style={styles.receiptTitle}>Comprobante seleccionado:</Text>
              <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
              <TouchableOpacity 
                style={styles.changeReceiptButton}
                onPress={handleTransferPayment}
              >
                <Text style={styles.changeReceiptText}>Cambiar comprobante</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={handleTransferPayment}>
              <Ionicons name="cloud-upload-outline" size={30} color="#e74c3c" />
              <Text style={styles.uploadButtonText}>Subir Comprobante</Text>
              <Text style={styles.uploadButtonSubtext}>
                Toca para seleccionar imagen o documento
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, !receiptImage && styles.submitButtonDisabled]} 
            onPress={submitTransferReceipt}
            disabled={!receiptImage}
          >
            <Ionicons name="checkmark-outline" size={20} color="white" />
            <Text style={styles.submitButtonText}>Enviar para Revisión</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  paymentInfo: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  paymentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  paymentStudent: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  paymentDueDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  methodsContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  methodsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  methodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  methodCardSelected: {
    borderColor: '#e74c3c',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 15,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  methodDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#e74c3c',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e74c3c',
  },
  cardPaymentContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  cardInfo: {
    marginBottom: 20,
  },
  cardInfoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    lineHeight: 20,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 15,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  transferPaymentContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bankInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  bankTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  bankData: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  receiptContainer: {
    marginBottom: 20,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  changeReceiptButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  changeReceiptText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 30,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e74c3c',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 10,
  },
  uploadButtonSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
