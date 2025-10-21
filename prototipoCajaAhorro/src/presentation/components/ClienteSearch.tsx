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
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 14,
  },
  resultadosContainer: {
    marginTop: theme.spacing.sm,
  },
  resultadosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  resultadosList: {
    maxHeight: 300,
  },
  clienteCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  clienteCedula: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginBottom: 2,
  },
  clienteCelular: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginBottom: 2,
  },
  clienteCuenta: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  clienteSaldo: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    textAlign: 'center',
  },
});
