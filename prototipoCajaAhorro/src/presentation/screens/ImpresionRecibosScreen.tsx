import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface Recibo {
  id: string;
  numero: string;
  fecha: string;
  cliente: string;
  tipo: string;
  monto: number;
  estado: 'IMPRESO' | 'ENVIADO';
  fechaImpresion: string;
}

export const ImpresionRecibosScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recibos, setRecibos] = useState<Recibo[]>([]);

  useEffect(() => {
    cargarRecibos();
  }, []);

  const cargarRecibos = async () => {
    setLoading(true);
    try {
      // Simular carga de recibos impresos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRecibos: Recibo[] = [
        {
          id: '1',
          numero: 'R-001-2024',
          fecha: '2024-01-15 10:30',
          cliente: 'María Rodríguez',
          tipo: 'Depósito',
          monto: 150.50,
          estado: 'IMPRESO',
          fechaImpresion: '2024-01-15 10:35'
        },
        {
          id: '2',
          numero: 'R-002-2024',
          fecha: '2024-01-15 11:15',
          cliente: 'Carlos Pérez',
          tipo: 'Cobro',
          monto: 275.75,
          estado: 'IMPRESO',
          fechaImpresion: '2024-01-15 11:20'
        },
        {
          id: '3',
          numero: 'R-003-2024',
          fecha: '2024-01-15 12:00',
          cliente: 'Ana García',
          tipo: 'Depósito',
          monto: 89.25,
          estado: 'IMPRESO',
          fechaImpresion: '2024-01-15 12:05'
        },
        {
          id: '4',
          numero: 'R-004-2024',
          fecha: '2024-01-15 14:30',
          cliente: 'Luis Martínez',
          tipo: 'Apertura de Cuenta',
          monto: 1.00,
          estado: 'ENVIADO',
          fechaImpresion: '2024-01-15 14:35'
        },
        {
          id: '5',
          numero: 'R-005-2024',
          fecha: '2024-01-15 15:45',
          cliente: 'Carmen López',
          tipo: 'Cobro',
          monto: 125.30,
          estado: 'IMPRESO',
          fechaImpresion: '2024-01-15 15:50'
        },
        {
          id: '6',
          numero: 'R-006-2024',
          fecha: '2024-01-14 16:20',
          cliente: 'Roberto Silva',
          tipo: 'Depósito',
          monto: 200.00,
          estado: 'IMPRESO',
          fechaImpresion: '2024-01-14 16:25'
        },
        {
          id: '7',
          numero: 'R-007-2024',
          fecha: '2024-01-14 09:15',
          cliente: 'Elena Vargas',
          tipo: 'Cobro',
          monto: 75.50,
          estado: 'ENVIADO',
          fechaImpresion: '2024-01-14 09:20'
        }
      ];
      
      setRecibos(mockRecibos);
    } catch (error) {
      console.error('Error cargando recibos:', error);
    } finally {
      setLoading(false);
    }
  };


  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'IMPRESO': return '#28A745';
      case 'ENVIADO': return '#17A2B8';
      default: return theme.colors.primaryLight;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'IMPRESO': return 'print';
      case 'ENVIADO': return 'send';
      default: return 'help';
    }
  };

  const recibosImpresos = recibos.filter(r => r.estado === 'IMPRESO').length;
  const recibosEnviados = recibos.filter(r => r.estado === 'ENVIADO').length;

  if (loading && recibos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando recibos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7}>
          <View style={{ alignSelf: 'center' }}>
            <Image
              source={require('../assets/logoSantaTeresita2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ padding: theme.spacing.lg }}>

        {/* Lista de Recibos */}
        <Text style={styles.sectionTitle}>Recibos Procesados</Text>
        {recibos.map((recibo) => (
          <Card key={recibo.id} style={styles.reciboCard}>
            <View style={styles.reciboItem}>
              <View style={styles.reciboHeader}>
                <View style={styles.reciboInfo}>
                  <Text style={styles.reciboNumero}>{recibo.numero}</Text>
                  <Text style={styles.reciboFecha}>Transacción: {recibo.fecha}</Text>
                  <Text style={styles.reciboFechaImpresion}>Impreso: {recibo.fechaImpresion}</Text>
                </View>
                <View style={styles.reciboEstado}>
                  <MaterialIcons 
                    name={getEstadoIcon(recibo.estado)} 
                    size={20} 
                    color={getEstadoColor(recibo.estado)} 
                  />
                  <Text style={[styles.estadoText, { color: getEstadoColor(recibo.estado) }]}>
                    {recibo.estado}
                  </Text>
                </View>
              </View>
              
              <View style={styles.reciboBody}>
                <Text style={styles.clienteText}>{recibo.cliente}</Text>
                <Text style={styles.tipoText}>{recibo.tipo}</Text>
                <Text style={styles.montoText}>${recibo.monto.toFixed(2)}</Text>
              </View>
            </View>
          </Card>
        ))}

        {recibos.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="print" size={64} color={theme.colors.primaryLight} />
            <Text style={styles.emptyText}>No hay recibos impresos</Text>
            <Text style={styles.emptySubtext}>El historial de recibos aparecerá aquí después de imprimir transacciones</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBEE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 340, height: 36, resizeMode: 'contain', alignSelf: 'center'
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  resumenContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 28, fontWeight: '900', color: theme.colors.primary, textAlign: 'center'
  },
  resumenGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },
  resumenItem: {
    alignItems: 'center',
  },
  resumenNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  resumenLabel: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginTop: 4,
  },
  reciboCard: {
    marginBottom: theme.spacing.md,
  },
  reciboItem: {
    padding: theme.spacing.md,
    position: 'relative',
  },
  reciboHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reciboInfo: {
    flex: 1,
  },
  reciboNumero: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  reciboFecha: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginTop: 2,
  },
  reciboFechaImpresion: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  reciboEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  estadoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reciboBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  tipoText: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginHorizontal: theme.spacing.sm,
  },
  montoText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.card,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
