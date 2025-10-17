import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';

interface Props {
  navigation: any;
}

export const AperturaSeleccionScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Selecciona el tipo de cuenta</Text>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('AperturaBasica')}>
        <View style={styles.texts}>
          <Text style={styles.itemTitle}>Cuenta de ahorro básica</Text>
          <Text style={styles.itemSubtitle}>Ideal para tus ahorros diarios.</Text>
        </View>
        <Image source={require('../assets/ahorroBasico.png')} style={styles.thumb} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('AperturaInfantil')}>
        <View style={styles.texts}>
          <Text style={styles.itemTitle}>Cuenta de ahorro infantil</Text>
          <Text style={styles.itemSubtitle}>Para el futuro de tus hijos.</Text>
        </View>
        <Image source={require('../assets/ahorroInfantil.png')} style={styles.thumb} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('AhorroFuturo')}>
        <View style={styles.texts}>
          <Text style={styles.itemTitle}>Cuenta de ahorro futuro</Text>
          <Text style={styles.itemSubtitle}>Planifica tus metas a largo plazo.</Text>
        </View>
        <Image source={require('../assets/ahorroFuturo.png')} style={styles.thumb} />
      </TouchableOpacity>

      <View style={{ height: theme.spacing.xl }} />     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  content: { padding: theme.spacing.lg },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  row: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.card,
  },
  texts: { flex: 1, paddingRight: theme.spacing.md },
  itemTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  itemSubtitle: { fontSize: 14, color: theme.colors.primaryLight },
  thumb: { width: 120, height: 90, borderRadius: theme.radii.md },
});


