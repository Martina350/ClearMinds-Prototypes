import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const PerfilScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: logout }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7}>
        </TouchableOpacity>
        { <View style={{ alignSelf: 'center' }}>
          <Image
            source={require('../assets/logoSantaTeresita2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View> }
        <View style={{ width: 24 }} />
      </View>
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <View style={styles.header}> 
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.nombre?.charAt(0)}{user?.apellidos?.charAt(0)}</Text></View>
        <View>
          <Text style={styles.name}>{user?.nombre} {user?.apellidos}</Text>
          <Text style={styles.sub}>Código: {user?.codigoAgente}</Text>
          <Text style={styles.sub}>Email: {user?.email}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Información</Text>
        <Text style={styles.row}>Rol: Recaudador</Text>
        <Text style={styles.row}>Email: agente@empresa.com</Text>
        <Text style={styles.row}>Teléfono: 0999999999</Text>
      </View>

      <Button title="Cerrar Sesión" onPress={handleLogout} fullWidth />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 15, paddingBottom: 15, backgroundColor: theme.colors.background },
  logo: { width: 340, height: 36, resizeMode: 'contain', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
  avatarText: { color: '#fff', fontWeight: '900' },
  name: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  sub: { color: theme.colors.subtitle },
  card: { backgroundColor: theme.colors.background, borderRadius: theme.radii.lg, padding: theme.spacing.md, ...theme.shadows.card, marginBottom: theme.spacing.lg },
  section: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.sm },
  row: { color: theme.colors.text, marginBottom: 6 },
});


