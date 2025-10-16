import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';

export const PerfilScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <View style={styles.header}> 
        <View style={styles.avatar}><Text style={styles.avatarText}>AG</Text></View>
        <View>
          <Text style={styles.name}>Agente Gonzales</Text>
          <Text style={styles.sub}>ID: 000123</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Información</Text>
        <Text style={styles.row}>Rol: Recaudador</Text>
        <Text style={styles.row}>Email: agente@empresa.com</Text>
        <Text style={styles.row}>Teléfono: 0999999999</Text>
      </View>

      <Button title="Cerrar Sesión" onPress={() => {}} fullWidth />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
  avatarText: { color: '#fff', fontWeight: '900' },
  name: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  sub: { color: theme.colors.subtitle },
  card: { backgroundColor: theme.colors.background, borderRadius: theme.radii.lg, padding: theme.spacing.md, ...theme.shadows.card, marginBottom: theme.spacing.lg },
  section: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.sm },
  row: { color: theme.colors.text, marginBottom: 6 },
});


