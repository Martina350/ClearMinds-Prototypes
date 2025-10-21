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
        <Image source={require('../assets/logoSantaTeresita.png')} style={styles.thumb} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('AperturaInfantil')}>
        <View style={styles.texts}>
          <Text style={styles.itemTitle}>Cuenta de ahorro infantil</Text>
          <Text style={styles.itemSubtitle}>Para el futuro de tus hijos.</Text>
        </View>
        <Image source={require('../assets/logoSantaTeresita.png')} style={styles.thumb} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('AhorroFuturo')}>
        <View style={styles.texts}>
          <Text style={styles.itemTitle}>Cuenta de ahorro futuro</Text>
          <Text style={styles.itemSubtitle}>Planifica tus metas a largo plazo.</Text>
        </View>
        <Image source={require('../assets/logoSantaTeresita.png')} style={styles.thumb} />
      </TouchableOpacity>

      <View style={{ height: theme.spacing.xl }} />     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.backgroundApp 
  },
  content: { 
    padding: theme.spacing.xl 
  },
  title: { 
    fontSize: theme.typography.sizes.xxxl, 
    fontWeight: theme.typography.weights.black, 
    color: theme.colors.primary, 
    textAlign: 'left', 
    marginBottom: theme.spacing.xl,
    letterSpacing: 0.5,
  },
  row: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.card,
  },
  texts: { 
    flex: 1, 
    paddingRight: theme.spacing.lg 
  },
  itemTitle: { 
    fontSize: theme.typography.sizes.xl, 
    fontWeight: theme.typography.weights.extrabold, 
    color: theme.colors.text, 
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.3,
  },
  itemSubtitle: { 
    fontSize: theme.typography.sizes.sm, 
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.medium,
    lineHeight: theme.typography.lineHeights.normal * theme.typography.sizes.sm,
  },
  thumb: { 
    width: 120, 
    height: 90, 
    borderRadius: theme.radii.lg,
    ...theme.shadows.sm,
  },
});


