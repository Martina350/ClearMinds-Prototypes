import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { FinalButton as Button } from '../../components/FinalButton';
import { Input } from '../../components/Input';
import { AppIcons } from '../../components/Icon';
import * as ImagePicker from 'expo-image-picker';

interface PaymentScreenProps {
  bookingData: any;
  user: any;
  onBack: () => void;
  onComplete: (paymentData: any) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  bookingData,
  user,
  onBack,
  onComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    holder: ''
  });
  const [transferData, setTransferData] = useState({
    proof: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateCardForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!cardData.number.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es requerido';
    } else if (cardData.number.length < 16) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
    }

    if (!cardData.expiry.trim()) {
      newErrors.cardExpiry = 'La fecha de vencimiento es requerida';
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.cardExpiry = 'Formato: MM/AA';
    }

    if (!cardData.cvc.trim()) {
      newErrors.cardCvc = 'El CVC es requerido';
    } else if (cardData.cvc.length < 3) {
      newErrors.cardCvc = 'El CVC debe tener 3 dígitos';
    }

    if (!cardData.holder.trim()) {
      newErrors.cardHolder = 'El nombre del titular es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTransferForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!transferData.proof.trim()) {
      newErrors.proof = 'Debes subir el comprobante';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    const isValid = paymentMethod === 'card' ? validateCardForm() : validateTransferForm();
    
    if (isValid) {
      const paymentData = {
        method: paymentMethod,
        ...(paymentMethod === 'card' ? cardData : transferData),
        amount: bookingData.service.price,
        status: paymentMethod === 'card' ? 'approved' : 'pending'
      };
      
      onComplete(paymentData);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setErrors({ proof: 'Permiso denegado para acceder a la galería' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setTransferData({ proof: result.assets[0].uri });
      setErrors({});
    }
  };

  const getServiceIcon = (imageName: string) => {
    switch (imageName) {
      case 'toilet':
        return AppIcons.toilet(24, colors.textWhite);
      case 'septic':
        return AppIcons.septic(24, colors.textWhite);
      case 'grease':
        return AppIcons.grease(24, colors.textWhite);
      case 'trash':
        return AppIcons.trash(24, colors.textWhite);
      case 'debris':
        return AppIcons.debris(24, colors.textWhite);
      default:
        return AppIcons.toilet(24, colors.textWhite);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerPlaceholder}>
        <Text style={styles.headerTitle}>Pago</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
          
          <View style={styles.serviceItem}>
            <View style={styles.serviceImageContainer}>
              {getServiceIcon(bookingData.service.image)}
            </View>
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceName}>{bookingData.service.name}</Text>
              <Text style={styles.serviceInfo}>
                {bookingData.clientType === 'casa' ? 'Casa' : 'Empresa'} • {bookingData.duration} min
              </Text>
            </View>
            <Text style={styles.servicePrice}>${bookingData.service.price}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fecha:</Text>
            <Text style={styles.summaryValue}>{bookingData.date}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hora:</Text>
            <Text style={styles.summaryValue}>{bookingData.time}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${bookingData.service.price}</Text>
          </View>
        </Card>

        {/* Payment Method Selection */}
        <Card style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          
          <View style={styles.paymentMethodContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                paymentMethod === 'card' && styles.paymentMethodButtonActive
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              {AppIcons.creditCard(24, paymentMethod === 'card' ? colors.textWhite : colors.textPrimary)}
              <Text style={[
                styles.paymentMethodText,
                paymentMethod === 'card' && styles.paymentMethodTextActive
              ]}>
                Tarjeta
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                paymentMethod === 'transfer' && styles.paymentMethodButtonActive
              ]}
              onPress={() => setPaymentMethod('transfer')}
            >
              {AppIcons.bank(24, paymentMethod === 'transfer' ? colors.textWhite : colors.textPrimary)}
              <Text style={[
                styles.paymentMethodText,
                paymentMethod === 'transfer' && styles.paymentMethodTextActive
              ]}>
                Transferencia
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Payment Form */}
        {paymentMethod === 'card' ? (
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Datos de la Tarjeta</Text>
            
            <Input
              placeholder="Número de tarjeta"
              value={cardData.number}
              onChangeText={(value) => setCardData(prev => ({ ...prev, number: value }))}
              keyboardType="numeric"
              error={errors.cardNumber}
            />
            
            <View style={styles.cardRow}>
              <View style={styles.cardInput}>
                <Input
                  placeholder="MM/AA"
                  value={cardData.expiry}
                  onChangeText={(value) => {
                    const digits = value.replace(/[^0-9]/g, '').slice(0, 4);
                    let formatted = digits;
                    if (digits.length >= 3) {
                      formatted = `${digits.slice(0,2)}/${digits.slice(2)}`;
                    }
                    setCardData(prev => ({ ...prev, expiry: formatted }));
                  }}
                  keyboardType="numeric"
                  error={errors.cardExpiry}
                  maxLength={5}
                />
              </View>
              
              <View style={styles.cardInput}>
                <Input
                  placeholder="CVC"
                  value={cardData.cvc}
                  onChangeText={(value) => setCardData(prev => ({ ...prev, cvc: value }))}
                  keyboardType="numeric"
                  error={errors.cardCvc}
                />
              </View>
            </View>
            
            <Input
              placeholder="Nombre del titular"
              value={cardData.holder}
              onChangeText={(value) => setCardData(prev => ({ ...prev, holder: value }))}
              error={errors.cardHolder}
            />
          </Card>
        ) : (
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Datos de Transferencia</Text>
            <View style={styles.transferInfoBox}>
              <Text style={styles.transferLine}><Text style={styles.transferLabel}>Datos para Transferencia</Text></Text>
              <Text style={styles.transferLine}><Text style={styles.transferLabel}>Banco: </Text>Banco del Pichincha</Text>
              <Text style={styles.transferLine}><Text style={styles.transferLabel}>Cuenta: </Text>1234567890</Text>
              <Text style={styles.transferLine}><Text style={styles.transferLabel}>Titular: </Text>EcoSolution S.A.</Text>
              <Text style={styles.transferLine}><Text style={styles.transferLabel}>Monto: </Text>${bookingData.service.price}</Text>
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              {AppIcons.upload(16, colors.primary)}
              <Text style={styles.uploadText}>{transferData.proof ? 'Cambiar Comprobante' : 'Subir Comprobante'}</Text>
            </TouchableOpacity>
            {transferData.proof ? (
              <View style={styles.previewBox}>
                <Image source={{ uri: transferData.proof }} style={styles.previewImage} />
                <Text style={styles.previewText}>Comprobante seleccionado</Text>
              </View>
            ) : null}
            {errors.proof && <Text style={styles.errorText}>{errors.proof}</Text>}
          </Card>
        )}

        {/* Complete Button */}
        <Button
          title="CONFIRMAR PAGO"
          onPress={handleComplete}
          style={styles.completeButton}
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
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceImageContainer: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    ...typography.body,
    fontWeight: 'bold',
  },
  serviceInfo: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  servicePrice: {
    ...typography.priceSmall,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  totalLabel: {
    ...typography.h4,
  },
  totalValue: {
    ...typography.price,
  },
  paymentCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paymentMethodButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  paymentMethodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  paymentMethodText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  paymentMethodTextActive: {
    color: colors.textWhite,
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  transferInfoBox: {
    backgroundColor: '#EAF7EA',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  transferLine: {
    ...typography.body,
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  transferLabel: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cardInput: {
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  uploadIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  uploadText: {
    ...typography.body,
    color: colors.primary,
  },
  previewBox: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  previewText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  completeButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
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
