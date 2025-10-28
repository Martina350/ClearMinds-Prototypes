// Pantalla de Revisión de Pago para Administradores
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReviewPaymentScreenProps {
  navigation: any;
  route: any;
}

export const ReviewPaymentScreen: React.FC<ReviewPaymentScreenProps> = ({ navigation, route }) => {
  const { payment } = route.params;
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const handleApprove = () => {
    Alert.alert(
      'Aprobar Pago',
      '¿Estás seguro de que quieres aprobar este pago?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aprobar', 
          style: 'default',
          onPress: () => {
            setIsApproved(true);
            Alert.alert('Éxito', 'Pago aprobado correctamente');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Rechazar Pago',
      '¿Estás seguro de que quieres rechazar este pago?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Rechazar', 
          style: 'destructive',
          onPress: () => {
            setIsRejected(true);
            Alert.alert('Información', 'Pago rechazado');
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.content}>
        {/* Detalles del Pago */}
        <View style={styles.paymentDetailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estudiante</Text>
            <Text style={styles.detailValue}>Alejandro Gomez</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monto</Text>
            <Text style={[styles.detailValue, styles.amountValue]}>$50.00 USD</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Concepto</Text>
            <Text style={styles.detailValue}>Inscripción Campeonato</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de Transferencia</Text>
            <Text style={styles.detailValue}>15 de Agosto, 2024</Text>
          </View>
        </View>

        {/* Comprobante de Pago */}
        <View style={styles.receiptSection}>
          <Text style={styles.receiptTitle}>Comprobante de Pago</Text>
          <View style={styles.receiptContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/300x200/FFFFFF/000000?text=Comprobante+de+Pago' }}
              style={styles.receiptImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>

      {/* Botones de Acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.approveButton]} 
          onPress={handleApprove}
          disabled={isApproved || isRejected}
        >
          <Text style={styles.approveButtonText}>Aprobar Pago</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]} 
          onPress={handleReject}
          disabled={isApproved || isRejected}
        >
          <Text style={styles.rejectButtonText}>Rechazar Pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  paymentDetailsCard: {
    backgroundColor: '#24C36B', // Verde éxito
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  amountValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  receiptSection: {
    marginBottom: 20,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  receiptContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#1A1D24',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  approveButton: {
    backgroundColor: '#24C36B', // Verde éxito
  },
  rejectButton: {
    backgroundColor: '#E62026', // Rojo competitivo
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
