import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator, Image } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';

interface Props {
  navigation: any;
  route?: {
    params?: {
      cliente?: any;
      cobranza?: any;
      monto?: number;
      notas?: string;
      tipo?: string;
    };
  };
}

export const ReciboScreen: React.FC<Props> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [numeroRecibo, setNumeroRecibo] = useState('');
  const [fechaHora, setFechaHora] = useState('');

  const params = route?.params || {};
  const { cliente, cobranza, monto, notas, tipo } = params;

  useEffect(() => {
    // Generar número de recibo
    const fecha = new Date();
    const fechaStr = fecha.toISOString().slice(0, 10).replace(/-/g, '');
    const numero = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    setNumeroRecibo(`REC-${fechaStr}-${numero}`);

    // Formatear fecha y hora
    setFechaHora(fecha.toLocaleString('es-EC', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }));
  }, []);

  const handleImprimir = async () => {
    setLoading(true);
    try {
      // Simular impresión
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Recibo Impreso',
        'El recibo ha sido enviado a la impresora conectada',
        [{ text: 'Aceptar' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo imprimir el recibo');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarEmail = async () => {
    setLoading(true);
    try {
      // Simular envío por email
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Email Enviado',
        'El recibo ha sido enviado por correo electrónico',
        [{ text: 'Aceptar' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el email');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizar = () => {
    Alert.alert(
      'Transacción Completada',
      'La transacción ha sido registrada exitosamente',
      [
        {
          text: 'Aceptar',
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
  };

  const getTipoTransaccion = () => {
    switch (tipo) {
      case 'DEPOSITO': return 'Depósito';
      case 'COBRO': return 'Cobro';
      case 'APERTURA': return 'Apertura de Cuenta';
      default: return 'Transacción';
    }
  };

  const getConcepto = () => {
    if (cobranza) {
      return cobranza.concepto;
    }
    if (notas) {
      return notas;
    }
    return getTipoTransaccion();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={styles.title}>Recibo de Transacción</Text>

      <Card style={styles.reciboCard}>
        <View style={styles.header}>
          {<View style={{ alignSelf: 'center' }}>
            <Image
              source={require('../assets/logoSantaTeresita2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>}
          <Text style={styles.numeroRecibo}>N° {numeroRecibo}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha y Hora:</Text>
            <Text style={styles.value}>{fechaHora}</Text>
          </View>

          {cliente && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Cliente:</Text>
                <Text style={styles.value}>{cliente.nombre} {cliente.apellidos}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Cédula:</Text>
                <Text style={styles.value}>{cliente.cedula}</Text>
              </View>
              {cliente.numeroCuenta && (
                <View style={styles.row}>
                  <Text style={styles.label}>Cuenta:</Text>
                  <Text style={styles.value}>{cliente.numeroCuenta}</Text>
                </View>
              )}
            </>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{getTipoTransaccion()}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Concepto:</Text>
            <Text style={styles.value}>{getConcepto()}</Text>
          </View>

          {cobranza && (
            <>
              {cobranza.montoPendiente > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Monto Principal:</Text>
                  <Text style={styles.value}>${cobranza.montoPendiente.toFixed(2)}</Text>
                </View>
              )}
              {cobranza.montoMora > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Mora:</Text>
                  <Text style={styles.value}>${cobranza.montoMora.toFixed(2)}</Text>
                </View>
              )}
              {cobranza.montoInteres > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Interés:</Text>
                  <Text style={styles.value}>${cobranza.montoInteres.toFixed(2)}</Text>
                </View>
              )}
            </>
          )}

          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>${monto?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¡Gracias por su preferencia!</Text>
          <Text style={styles.footerText}>Este documento es un comprobante válido</Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Imprimir Recibo"
          onPress={handleImprimir}
          fullWidth
          disabled={loading}
        />

        <View style={{ height: theme.spacing.sm }} />

        <Button
          title="Enviar por Email"
          onPress={handleEnviarEmail}
          fullWidth
          variant="primary"
          disabled={loading}
        />

        <View style={{ height: theme.spacing.sm }} />

        <Button
          title="Finalizar Transacción"
          onPress={handleFinalizar}
          fullWidth
          variant="primary"
        />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.backgroundApp 
  },
  title: { 
    fontSize: theme.typography.sizes.xxxl, 
    fontWeight: theme.typography.weights.black, 
    color: theme.colors.primary, 
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  reciboCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.xl,
    padding: theme.spacing.xxl,
    ...theme.shadows.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 2.5,
    borderColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 2.5,
    borderBottomColor: theme.colors.primary,
    paddingBottom: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  empresa: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.extrabold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.3,
  },
  numeroRecibo: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.bold,
  },
  content: {
    marginBottom: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  label: {
    color: theme.colors.text,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm,
    flex: 1,
  },
  value: {
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm,
    flex: 2,
    textAlign: 'right',
  },
  totalRow: {
    borderTopWidth: 2.5,
    borderTopColor: theme.colors.primary,
    borderBottomWidth: 2.5,
    borderBottomColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  totalLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.extrabold,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.extrabold,
    color: theme.colors.primary,
  },
  footer: {
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.primaryLight,
    textAlign: 'center',
    marginBottom: 2,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  logo: { width: 340, height: 36, resizeMode: 'contain', alignSelf: 'center' },
});


