import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from './Input';
import { Card } from './Card';
import { theme } from '../theme/theme';
import { mockDB, Cliente as ClienteDB, Cuenta } from '../../infrastructure/persistence/MockDatabase';

interface Cliente {
  id: string;
  cedula: string;
  nombre: string;
  apellidos: string;
  celular: string;
  numeroCuenta?: string;
  saldo?: number;
}

interface ClienteSearchProps {
  onClienteSelect: (cliente: Cliente) => void;
  placeholder?: string;
  showResults?: boolean;
}

export const ClienteSearch: React.FC<ClienteSearchProps> = ({ 
  onClienteSelect, 
  placeholder = "Buscar por cédula, nombre, apellido o número de cuenta",
  showResults = true 
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (busqueda.length >= 3) {
      buscarClientes();
    } else {
      setResultados([]);
    }
  }, [busqueda]);

  const buscarClientes = async () => {
    setLoading(true);
    
    // Simular búsqueda con delay para mejor UX
    setTimeout(() => {
      // Buscar clientes en la base de datos mock
      const clientesDB = mockDB.buscarClientes(busqueda);
      
      // Convertir clientes de DB a formato de la interfaz
      const clientesConCuentas = clientesDB.map((clienteDB: ClienteDB) => {
        // Obtener cuenta principal del cliente
        const cuentas = mockDB.getCuentasByCliente(clienteDB.id);
        const cuentaPrincipal = cuentas.find((c: Cuenta) => c.tipo === 'BASICA') || cuentas[0];
        
        return {
          id: clienteDB.id,
          cedula: clienteDB.cedula,
          nombre: clienteDB.nombre,
          apellidos: clienteDB.apellidos,
          celular: clienteDB.celular,
          numeroCuenta: cuentaPrincipal?.numeroCuenta,
          saldo: cuentaPrincipal?.saldo,
        };
      });
      
      // También buscar por número de cuenta
      if (busqueda.startsWith('AH') || busqueda.startsWith('AI') || busqueda.startsWith('AF')) {
        const cuenta = mockDB.getCuentaByNumero(busqueda);
        if (cuenta) {
          const cliente = mockDB.getClienteById(cuenta.clienteId);
          if (cliente && !clientesConCuentas.find((c: Cliente) => c.id === cliente.id)) {
            clientesConCuentas.push({
              id: cliente.id,
              cedula: cliente.cedula,
              nombre: cliente.nombre,
              apellidos: cliente.apellidos,
              celular: cliente.celular,
              numeroCuenta: cuenta.numeroCuenta,
              saldo: cuenta.saldo,
            });
          }
        }
      }
      
      setResultados(clientesConCuentas);
      setLoading(false);
    }, 300);
  };

  const handleClienteSelect = (cliente: Cliente) => {
    onClienteSelect(cliente);
    setBusqueda('');
    setResultados([]);
  };

  return (
    <View style={styles.container}>
      <Input
        label="Buscar Cliente"
        placeholder={placeholder}
        value={busqueda}
        onChangeText={setBusqueda}
        autoCapitalize="none"
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}

      {showResults && resultados.length > 0 && (
        <View style={styles.resultadosContainer}>
          <Text style={styles.resultadosTitle}>
            {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
          </Text>
          <ScrollView 
            style={styles.resultadosList}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {resultados.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => handleClienteSelect(item)}>
                <Card style={styles.clienteCard}>
                  <View style={styles.clienteInfo}>
                    <Text style={styles.clienteNombre}>{item.nombre} {item.apellidos}</Text>
                    <Text style={styles.clienteCedula}>Cédula: {item.cedula}</Text>
                    <Text style={styles.clienteCelular}>{item.celular}</Text>
                    {item.numeroCuenta && (
                      <Text style={styles.clienteCuenta}>Cuenta: {item.numeroCuenta}</Text>
                    )}
                    {item.saldo !== undefined && (
                      <Text style={styles.clienteSaldo}>Saldo: ${item.saldo.toFixed(2)}</Text>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {showResults && busqueda.length >= 3 && resultados.length === 0 && !loading && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron clientes</Text>
          <Text style={styles.noResultsSubtext}>
            Intenta con cédula, nombre, apellido o número de cuenta
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  resultadosContainer: {
    marginTop: theme.spacing.md,
  },
  resultadosTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.2,
  },
  resultadosList: {
    maxHeight: 320,
  },
  clienteCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.infoLight,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNombre: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.2,
  },
  clienteCedula: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xxs,
    fontWeight: theme.typography.weights.medium,
  },
  clienteCelular: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xxs,
    fontWeight: theme.typography.weights.medium,
  },
  clienteCuenta: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xxs,
  },
  clienteSaldo: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.bold,
    marginTop: theme.spacing.xxs,
  },
  noResultsContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.warningLight,
    borderRadius: theme.radii.lg,
    marginTop: theme.spacing.sm,
  },
  noResultsText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.2,
  },
  noResultsSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontWeight: theme.typography.weights.medium,
  },
});
