import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Modal, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { mockDB, Recibo as ReciboDB } from '../../infrastructure/persistence/MockDatabase';
import { PrintServiceImpl } from '../../infrastructure/printing/PrintServiceImpl';

interface Recibo {
  id: string;
  numero: string;
  fecha: string;
  cliente: string;
  tipo: string;
  monto: number;
  estado: 'IMPRESO' | 'ENVIADO' | 'NO_IMPRESO';
  fechaImpresion: string;
  intentosImpresion?: number;
  transaccionId: string;
  clienteId: string;
  // Campos adicionales para la vista detallada
  clienteCedula?: string;
  clienteCuenta?: string;
  concepto?: string;
  montoPrincipal?: number;
  mora?: number;
  interes?: number;
}

export const ImpresionRecibosScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [reciboSeleccionado, setReciboSeleccionado] = useState<Recibo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reimprimiendo, setReimprimiendo] = useState(false);
  const isFocused = useIsFocused();
  const printService = new PrintServiceImpl();

  useEffect(() => {
    if (isFocused) {
      cargarRecibos();
    }
  }, [isFocused]);

  const cargarRecibos = async () => {
    setLoading(true);
    try {
      // Simular carga de recibos impresos
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Obtener recibos reales de la base de datos
      const recibosDB = mockDB.getRecibos();
      
      // Convertir al formato de la interfaz
      const recibosConvertidos: Recibo[] = recibosDB.map((r: ReciboDB) => {
        // Obtener información del cliente
        const cliente = mockDB.getClienteById(r.clienteId);
        const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Cliente Desconocido';
        const cedulaCliente = cliente ? cliente.cedula : undefined;
        
        // Obtener información de la transacción
        const transaccion = mockDB.getTransaccionById(r.transaccionId);
        const cuenta = transaccion ? mockDB.getCuentaById(transaccion.cuentaId) : null;
        const numeroCuenta = cuenta ? cuenta.numeroCuenta : undefined;
        
        // Para cobros, buscar la cobranza correspondiente
        let montoPrincipal, mora, interes;
        if (r.tipo === 'Cobro' && transaccion) {
          const cobranzas = mockDB.getCobranzasByCliente(r.clienteId);
          const cobranzaPendiente = cobranzas.find(c => !c.pagado);
          if (cobranzaPendiente) {
            montoPrincipal = cobranzaPendiente.montoCapital;
            mora = cobranzaPendiente.montoMora;
            interes = cobranzaPendiente.montoInteres;
          }
        }
        
        return {
          id: r.id,
          numero: r.numero,
          fecha: `${r.fecha} ${r.hora}`,
          cliente: nombreCliente,
          tipo: r.tipo,
          monto: r.monto,
          estado: r.estado,
          fechaImpresion: r.ultimoIntentoImpresion || `${r.fecha} ${r.hora}`,
          intentosImpresion: r.intentosImpresion,
          transaccionId: r.transaccionId,
          clienteId: r.clienteId,
          // Campos adicionales
          clienteCedula: cedulaCliente,
          clienteCuenta: numeroCuenta,
          concepto: transaccion?.concepto,
          // Para cobros, usar datos reales de cobranza
          montoPrincipal: r.tipo === 'Cobro' ? montoPrincipal : undefined,
          mora: r.tipo === 'Cobro' ? mora : undefined,
          interes: r.tipo === 'Cobro' ? interes : undefined,
        };
      });
      
      // Ordenar por fecha más reciente primero
      recibosConvertidos.sort((a, b) => b.fecha.localeCompare(a.fecha));
      
      setRecibos(recibosConvertidos);
    } catch (error) {
      console.error('Error cargando recibos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirDetalleRecibo = (recibo: Recibo) => {
    setReciboSeleccionado(recibo);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setReciboSeleccionado(null);
  };

  const handleReimprimir = async () => {
    if (!reciboSeleccionado) return;

    setReimprimiendo(true);
    try {
      // ===== CÓDIGO COMENTADO PARA PRODUCCIÓN =====
      // En producción, descomenta este código para la impresión real:
      
      // // Verificar conexión con impresora
      // const impresoraConectada = await printService.verificarImpresoraConectada();
      // 
      // if (!impresoraConectada) {
      //   // Incrementar intentos
      //   mockDB.incrementarIntentosImpresion(reciboSeleccionado.id);
      //   
      //   Alert.alert(
      //     'Error de conexión',
      //     'Error de conexión con la impresora. El recibo no se pudo imprimir. Puedes intentar reimprimirlo desde el historial de recibos procesados.',
      //     [{ text: 'Aceptar' }]
      //   );
      //   return;
      // }

      // // Obtener datos para el recibo
      // const cliente = mockDB.getClienteById(reciboSeleccionado.clienteId);
      // const transaccion = mockDB.getTransacciones().find(t => t.id === reciboSeleccionado.transaccionId);
      // 
      // if (!cliente || !transaccion) {
      //   Alert.alert('Error', 'No se encontraron los datos del recibo');
      //   return;
      // }

      // const cuenta = mockDB.getCuentaById(transaccion.cuentaId);
      // const agente = mockDB.getAgenteById(transaccion.agenteId);

      // // Intentar imprimir
      // await printService.imprimirRecibo({
      //   numeroRecibo: reciboSeleccionado.numero,
      //   fecha: new Date(reciboSeleccionado.fecha),
      //   nombreCliente: reciboSeleccionado.cliente,
      //   numeroCuenta: cuenta?.numeroCuenta,
      //   concepto: transaccion.concepto,
      //   monto: reciboSeleccionado.monto,
      //   nombreAgente: agente ? `${agente.nombre} ${agente.apellidos}` : 'Agente',
      //   tipo: transaccion.tipo === 'DEPOSITO' ? 'DEPOSITO' : transaccion.tipo === 'COBRO' ? 'COBRO' : 'APERTURA',
      // });

      // ===== SIMULACIÓN PARA PROTOTIPO =====
      // Simular tiempo de impresión
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Actualizar estado a IMPRESO
      mockDB.actualizarEstadoRecibo(reciboSeleccionado.id, 'IMPRESO');
      
      Alert.alert(
        'Recibo Impreso',
        'Recibo reimpreso correctamente',
        [{ 
          text: 'Aceptar',
          onPress: () => {
            cerrarModal();
            cargarRecibos();
          }
        }]
      );
    } catch (error: any) {
      console.error('Error al reimprimir:', error);
      
      // ===== CÓDIGO COMENTADO PARA PRODUCCIÓN =====
      // En producción, descomenta este código para el manejo de errores real:
      
      // // Incrementar intentos
      // mockDB.incrementarIntentosImpresion(reciboSeleccionado.id);
      // 
      // if (error.message === 'PRINTER_NOT_CONNECTED') {
      //   Alert.alert(
      //     'Error de conexión',
      //     'Error de conexión con la impresora. El recibo no se pudo imprimir. Puedes intentar reimprimirlo desde el historial de recibos procesados.',
      //     [{ text: 'Aceptar' }]
      //   );
      // } else {
      //   Alert.alert('Error', 'No se pudo reimprimir el recibo. Intenta nuevamente.');
      // }

      // Para el prototipo, solo mostrar error genérico
      Alert.alert('Error', 'No se pudo reimprimir el recibo. Intenta nuevamente.');
    } finally {
      setReimprimiendo(false);
      cargarRecibos();
    }
  };


  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'IMPRESO': return '#28A745';
      case 'ENVIADO': return '#17A2B8';
      case 'NO_IMPRESO': return '#DC3545';
      default: return theme.colors.primaryLight;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'IMPRESO': return 'print';
      case 'ENVIADO': return 'send';
      case 'NO_IMPRESO': return 'error';
      default: return 'help';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'IMPRESO': return 'Impreso';
      case 'ENVIADO': return 'Enviado';
      case 'NO_IMPRESO': return 'No Impreso';
      default: return estado;
    }
  };

  const recibosImpresos = recibos.filter(r => r.estado === 'IMPRESO').length;
  const recibosEnviados = recibos.filter(r => r.estado === 'ENVIADO').length;
  const recibosNoImpresos = recibos.filter(r => r.estado === 'NO_IMPRESO').length;

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
        <Text style={styles.sectionSubtitle}>Los recibos aparecerán aquí después de imprimir transacciones</Text>
        {/* Resumen de estados */}
        {recibosNoImpresos > 0 && (
          <Card style={styles.alertCard}>
            <View style={styles.alertContent}>
              <MaterialIcons name="warning" size={24} color="#DC3545" />
              <Text style={styles.alertText}>
                Tienes {recibosNoImpresos} recibo{recibosNoImpresos > 1 ? 's' : ''} sin imprimir. 
                Toca sobre {recibosNoImpresos > 1 ? 'ellos' : 'él'} para reimprimir.
              </Text>
            </View>
          </Card>
        )}
        {recibos.map((recibo) => (
          <TouchableOpacity 
            key={recibo.id} 
            activeOpacity={0.7}
            onPress={() => abrirDetalleRecibo(recibo)}
          >
            <Card style={
              recibo.estado === 'NO_IMPRESO' 
                ? [styles.reciboCard, styles.reciboCardError]
                : styles.reciboCard
            }>
              <View style={styles.reciboItem}>
                <View style={styles.reciboHeader}>
                  <View style={styles.reciboInfo}>
                    <Text style={styles.reciboNumero}>{recibo.numero}</Text>
                    <Text style={styles.reciboFecha}>Transacción: {recibo.fecha}</Text>
                    <Text style={styles.reciboFechaImpresion}>
                      {recibo.estado === 'NO_IMPRESO' ? 'Último intento' : 'Impreso'}: {recibo.fechaImpresion}
                    </Text>
                    {recibo.intentosImpresion && recibo.intentosImpresion > 0 && (
                      <Text style={styles.intentosText}>
                        Intentos de impresión: {recibo.intentosImpresion}
                      </Text>
                    )}
                  </View>
                  <View style={styles.reciboEstado}>
                    <MaterialIcons 
                      name={getEstadoIcon(recibo.estado)} 
                      size={20} 
                      color={getEstadoColor(recibo.estado)} 
                    />
                    <Text style={[styles.estadoText, { color: getEstadoColor(recibo.estado) }]}>
                      {getEstadoTexto(recibo.estado)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.reciboBody}>
                  <Text style={styles.clienteText}>{recibo.cliente}</Text>
                  <Text style={styles.tipoText}>{recibo.tipo}</Text>
                  <Text style={styles.montoText}>${recibo.monto.toFixed(2)}</Text>
                </View>

                {recibo.estado === 'NO_IMPRESO' && (
                  <View style={styles.accionRapida}>
                    <MaterialIcons name="touch-app" size={16} color={theme.colors.primary} />
                    <Text style={styles.accionRapidaText}>Toca para reimprimir</Text>
                  </View>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {recibos.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="print" size={64} color={theme.colors.primaryLight} />
            <Text style={styles.emptyText}>No hay recibos impresos</Text>
            <Text style={styles.emptySubtext}>El historial de recibos aparecerá aquí después de imprimir transacciones</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de detalles del recibo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles del Recibo</Text>
              <TouchableOpacity onPress={cerrarModal} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {reciboSeleccionado && (
              <ScrollView style={styles.modalBody}>
                {/* Estado del Recibo */}
                <View style={styles.estadoContainer}>
                  <View style={styles.estadoBadge}>
                    <MaterialIcons 
                      name={getEstadoIcon(reciboSeleccionado.estado)} 
                      size={20} 
                      color={getEstadoColor(reciboSeleccionado.estado)} 
                    />
                    <Text style={[styles.estadoBadgeText, { color: getEstadoColor(reciboSeleccionado.estado) }]}>
                      Estado: {getEstadoTexto(reciboSeleccionado.estado)}
                    </Text>
                  </View>
                  {reciboSeleccionado.intentosImpresion && reciboSeleccionado.intentosImpresion > 0 && (
                    <Text style={styles.intentosTextModal}>
                      Intentos: {reciboSeleccionado.intentosImpresion}
                    </Text>
                  )}
                </View>

                {/* Vista Previa del Recibo */}
                <Card style={styles.reciboPreview}>
                  <View style={styles.previewHeader}>
                    <Image
                      source={require('../assets/logoSantaTeresita2.png')}
                      style={styles.logoPreview}
                      resizeMode="contain"
                    />
                    <Text style={styles.numeroReciboPreview}>N° {reciboSeleccionado.numero}</Text>
                  </View>

                  <View style={styles.previewContent}>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Fecha y Hora:</Text>
                      <Text style={styles.previewValue}>{reciboSeleccionado.fecha}</Text>
                    </View>

                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Cliente:</Text>
                      <Text style={styles.previewValue}>{reciboSeleccionado.cliente}</Text>
                    </View>

                    {/* Cédula */}
                    {reciboSeleccionado.clienteCedula && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Cédula:</Text>
                        <Text style={styles.previewValue}>{reciboSeleccionado.clienteCedula}</Text>
                      </View>
                    )}

                    {/* Cuenta */}
                    {reciboSeleccionado.clienteCuenta && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Cuenta:</Text>
                        <Text style={styles.previewValue}>{reciboSeleccionado.clienteCuenta}</Text>
                      </View>
                    )}

                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Tipo:</Text>
                      <Text style={styles.previewValue}>{reciboSeleccionado.tipo}</Text>
                    </View>

                    {/* Concepto */}
                    {reciboSeleccionado.concepto && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Concepto:</Text>
                        <Text style={styles.previewValue}>{reciboSeleccionado.concepto}</Text>
                      </View>
                    )}

                    {/* Monto Principal (solo para Cobro) */}
                    {reciboSeleccionado.tipo === 'Cobro' && reciboSeleccionado.montoPrincipal !== undefined && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Monto Principal:</Text>
                        <Text style={styles.previewValue}>${reciboSeleccionado.montoPrincipal.toFixed(2)}</Text>
                      </View>
                    )}

                    {/* Mora (solo para Cobro) */}
                    {reciboSeleccionado.tipo === 'Cobro' && reciboSeleccionado.mora !== undefined && reciboSeleccionado.mora > 0 && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Mora:</Text>
                        <Text style={styles.previewValue}>${reciboSeleccionado.mora.toFixed(2)}</Text>
                      </View>
                    )}

                    {/* Interés (solo para Cobro) */}
                    {reciboSeleccionado.tipo === 'Cobro' && reciboSeleccionado.interes !== undefined && reciboSeleccionado.interes > 0 && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Interés:</Text>
                        <Text style={styles.previewValue}>${reciboSeleccionado.interes.toFixed(2)}</Text>
                      </View>
                    )}

                    <View style={[styles.previewRow, styles.previewTotalRow]}>
                      <Text style={styles.previewTotalLabel}>TOTAL:</Text>
                      <Text style={styles.previewTotalValue}>${reciboSeleccionado.monto.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.previewFooter}>
                    <Text style={styles.previewFooterText}>¡Gracias por su preferencia!</Text>
                    <Text style={styles.previewFooterText}>Este documento es un comprobante válido</Text>
                  </View>
                </Card>

                {/* Información adicional según estado */}
                {reciboSeleccionado.estado === 'NO_IMPRESO' ? (
                  <View style={styles.warningBox}>
                    <MaterialIcons name="info" size={20} color="#DC3545" />
                    <Text style={styles.warningText}>
                      Este recibo no pudo imprimirse debido a un error de conexión con la impresora. 
                      Puedes intentar reimprimirlo ahora.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.successBox}>
                    <MaterialIcons name="check-circle" size={20} color="#28A745" />
                    <Text style={styles.successText}>
                      {reciboSeleccionado.estado === 'ENVIADO' 
                        ? 'Este recibo fue enviado exitosamente.'
                        : `Recibo impreso correctamente el ${reciboSeleccionado.fechaImpresion}`
                      }
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              {reciboSeleccionado?.estado === 'NO_IMPRESO' ? (
                <>
                  <Button
                    title={reimprimiendo ? "Reimprimiendo..." : "Reimprimir Recibo"}
                    onPress={handleReimprimir}
                    fullWidth
                    disabled={reimprimiendo}
                  />
                  <View style={{ height: theme.spacing.sm }} />
                  <Button
                    title="Cerrar"
                    onPress={cerrarModal}
                    fullWidth
                    variant="primary"
                    disabled={reimprimiendo}
                  />
                </>
              ) : (
                <Button
                  title="Cerrar"
                  onPress={cerrarModal}
                  fullWidth
                  variant="primary"
                />
              )}
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
    backgroundColor: '#FFEBEE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 15,
    paddingBottom: 15,
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
  sectionSubtitle: {
    textAlign: 'center', color: theme.colors.subtitle, marginTop: 4 
  },
  alertCard: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
    marginBottom: theme.spacing.md,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
  },
  reciboCardError: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
  },
  intentosText: {
    fontSize: 12,
    color: '#DC3545',
    marginTop: 2,
    fontWeight: '600',
  },
  accionRapida: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 6,
  },
  accionRapidaText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    width: '90%',
    maxHeight: '80%',
    ...theme.shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: theme.spacing.lg,
    maxHeight: 500,
  },
  estadoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  estadoBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  intentosTextModal: {
    fontSize: 13,
    color: '#DC3545',
    fontWeight: '600',
  },
  reciboPreview: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  previewHeader: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  logoPreview: {
    width: 300,
    height: 32,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  numeroReciboPreview: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    fontWeight: '600',
    marginTop: 8,
  },
  previewContent: {
    marginBottom: theme.spacing.md,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  previewLabel: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
  previewValue: {
    color: theme.colors.primaryLight,
    fontWeight: '600',
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  previewTotalRow: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingVertical: 12,
    marginTop: theme.spacing.sm,
  },
  previewTotalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  previewTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  previewFooter: {
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  previewFooterText: {
    fontSize: 12,
    color: theme.colors.primaryLight,
    textAlign: 'center',
    marginBottom: 2,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderLeftWidth: 3,
    borderLeftColor: '#DC3545',
    gap: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#721C24',
    lineHeight: 18,
  },
  successBox: {
    flexDirection: 'row',
    backgroundColor: '#D4EDDA',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderLeftWidth: 3,
    borderLeftColor: '#28A745',
    gap: 10,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    color: '#155724',
    lineHeight: 18,
  },
  modalFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
