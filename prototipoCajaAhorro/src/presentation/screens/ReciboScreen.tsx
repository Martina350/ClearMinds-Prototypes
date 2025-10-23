import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator, Image } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { TipoCuenta } from '../../infrastructure/persistence/MockDatabase';

interface Props {
  navigation: any;
  route?: {
    params?: {
      cliente?: any;
      cuenta?: {
        numeroCuenta: string;
        tipo: TipoCuenta;
        saldoAnterior: number;
      };
      cobranza?: any;
      monto?: number;
      notas?: string;
      tipo?: string;
      saldoNuevo?: number;
    };
  };
}

export const ReciboScreen: React.FC<Props> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [numeroRecibo, setNumeroRecibo] = useState('');
  const [fechaHora, setFechaHora] = useState('');

  const params = route?.params || {};
  const { cliente, cuenta, cobranza, monto, notas, tipo, saldoNuevo } = params;

  const getTipoCuentaLabel = (tipoCuenta?: TipoCuenta): string => {
    if (!tipoCuenta) return 'Cuenta';
    switch (tipoCuenta) {
      case TipoCuenta.BASICA:
        return 'Cuenta de Ahorro Básica';
      case TipoCuenta.INFANTIL:
        return 'Cuenta de Ahorro Infantil';
      case TipoCuenta.AHORRO_FUTURO:
        return 'Cuenta de Ahorro Futuro';
      default:
        return 'Cuenta';
    }
  };

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
              {cuenta && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>Tipo de Cuenta:</Text>
                    <Text style={styles.value}>{getTipoCuentaLabel(cuenta.tipo)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Número de Cuenta:</Text>
                    <Text style={styles.value}>{cuenta.numeroCuenta}</Text>
                  </View>
                </>
              )}
              {!cuenta && cliente.numeroCuenta && (
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

          {tipo === 'DEPOSITO' && cuenta && saldoNuevo !== undefined && (
            <View style={styles.saldoInfo}>
              <View style={styles.row}>
                <Text style={styles.label}>Saldo Anterior:</Text>
                <Text style={styles.value}>${cuenta.saldoAnterior.toFixed(2)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Saldo Nuevo:</Text>
                <Text style={[styles.value, styles.saldoNuevo]}>${saldoNuevo.toFixed(2)}</Text>
              </View>
            </View>
          )}
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
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  title: { fontSize: 28, fontWeight: '900', color: theme.colors.primary, textAlign: 'center' },
  reciboCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#E0E0E0'
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  empresa: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  numeroRecibo: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
  content: {
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  label: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 14,
    flex: 1
  },
  value: {
    color: theme.colors.primaryLight,
    fontWeight: '600',
    fontSize: 14,
    flex: 2,
    textAlign: 'right'
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingVertical: 12,
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
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
  saldoInfo: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saldoNuevo: {
    color: '#4CAF50',
    fontWeight: '700',
  },
});


