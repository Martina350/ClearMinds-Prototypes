import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Switch } from 'react-native';
import { getUser, getPreferences, savePreferences } from '@/storage/localDb';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

type UserPreferences = {
  music?: string;
  tips?: string;
  activities?: string;
  notifications?: boolean;
  darkMode?: boolean;
  weeklyReport?: boolean;
};

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, userPrefs] = await Promise.all([
        getUser(),
        getPreferences()
      ]);
      
      setUser(userData);
      setPreferences(userPrefs || {});
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await savePreferences(preferences);
      Alert.alert('¡Guardado! 💾', 'Tus preferencias se han actualizado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar las preferencias. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    Alert.alert(
      'Restablecer preferencias',
      '¿Estás seguro de que quieres restablecer todas tus preferencias?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restablecer', 
          style: 'destructive',
          onPress: () => {
            setPreferences({});
            savePreferences({});
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Configuración ⚙️</Text>
        <Text style={styles.subtitle}>Personaliza tu experiencia</Text>
      </View>

      {/* Información del usuario */}
      <Card variant="elevated" style={styles.userCard}>
        <Text style={styles.cardTitle}>👤 Información personal</Text>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userAge}>Edad: {user.age} años</Text>
          </View>
        )}
      </Card>

      {/* Preferencias de personalización */}
      <Card variant="elevated" style={styles.preferencesCard}>
        <Text style={styles.cardTitle}>🎯 Preferencias de recomendaciones</Text>
        <Text style={styles.cardSubtitle}>Ayúdanos a personalizar mejor tus sugerencias</Text>
        
        <Input
          label="Música preferida 🎵"
          placeholder="Ej: Clásica, Pop, Rock, Electrónica"
          value={preferences.music || ''}
          onChangeText={(value) => updatePreference('music', value)}
          variant="filled"
          helperText="Tipo de música que prefieres para relajarte"
        />
        
        <Input
          label="Tipos de consejos 💡"
          placeholder="Ej: Respiración, hábitos, mindfulness"
          value={preferences.tips || ''}
          onChangeText={(value) => updatePreference('tips', value)}
          variant="filled"
          helperText="Qué tipo de consejos te resultan más útiles"
        />
        
        <Input
          label="Actividades favoritas 🎯"
          placeholder="Ej: Caminar, yoga, lectura, cocinar"
          value={preferences.activities || ''}
          onChangeText={(value) => updatePreference('activities', value)}
          variant="filled"
          helperText="Actividades que disfrutas hacer"
        />
      </Card>

      {/* Configuraciones de la app */}
      <Card variant="elevated" style={styles.settingsCard}>
        <Text style={styles.cardTitle}>📱 Configuración de la aplicación</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notificaciones recordatorias 🔔</Text>
            <Text style={styles.settingDescription}>Recibe recordatorios para registrar tu estado de ánimo</Text>
          </View>
          <Switch
            value={preferences.notifications ?? true}
            onValueChange={(value) => updatePreference('notifications', value)}
            trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
            thumbColor={preferences.notifications ? Colors.primary[600] : Colors.neutral[400]}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Modo oscuro 🌙</Text>
            <Text style={styles.settingDescription}>Cambiar el tema de la aplicación</Text>
          </View>
          <Switch
            value={preferences.darkMode ?? false}
            onValueChange={(value) => updatePreference('darkMode', value)}
            trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
            thumbColor={preferences.darkMode ? Colors.primary[600] : Colors.neutral[400]}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Reporte semanal 📊</Text>
            <Text style={styles.settingDescription}>Recibe un resumen de tu bienestar cada semana</Text>
          </View>
          <Switch
            value={preferences.weeklyReport ?? true}
            onValueChange={(value) => updatePreference('weeklyReport', value)}
            trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
            thumbColor={preferences.weeklyReport ? Colors.primary[600] : Colors.neutral[400]}
          />
        </View>
      </Card>

      {/* Acciones */}
      <Card variant="outlined" style={styles.actionsCard}>
        <Button
          title="💾 Guardar cambios"
          onPress={handleSave}
          loading={loading}
          size="large"
          style={styles.saveButton}
        />
        
        <Button
          title="🔄 Restablecer preferencias"
          onPress={resetPreferences}
          variant="outline"
          size="medium"
          style={styles.resetButton}
        />
      </Card>

      {/* Información adicional */}
      <Card variant="outlined" style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Sobre ClearMinds</Text>
        <Text style={styles.infoText}>
          ClearMinds te ayuda a entender y gestionar tus emociones a través de recomendaciones personalizadas. 
          Todas tus datos se almacenan localmente en tu dispositivo para proteger tu privacidad.
        </Text>
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.neutral[600],
  },
  userCard: {
    marginBottom: Spacing.lg,
  },
  preferencesCard: {
    marginBottom: Spacing.lg,
  },
  settingsCard: {
    marginBottom: Spacing.lg,
  },
  actionsCard: {
    marginBottom: Spacing.lg,
  },
  infoCard: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
  },
  cardTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginBottom: Spacing.lg,
  },
  userInfo: {
    gap: Spacing.xs,
  },
  userName: {
    ...Typography.h3,
    color: Colors.neutral[800],
  },
  userEmail: {
    ...Typography.body,
    color: Colors.neutral[600],
  },
  userAge: {
    ...Typography.bodySmall,
    color: Colors.neutral[500],
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    ...Typography.label,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  saveButton: {
    marginBottom: Spacing.md,
    ...Colors.Shadows.medium,
  },
  resetButton: {
    borderColor: Colors.status.warning,
  },
  infoTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.md,
  },
  infoText: {
    ...Typography.body,
    color: Colors.primary[600],
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.primary[500],
    textAlign: 'center',
  },
});


