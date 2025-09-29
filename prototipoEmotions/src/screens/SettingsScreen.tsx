import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Switch, Modal } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { getUser, getPreferences, savePreferences, clearUser, clearPreferences } from '@/storage/localDb';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BackgroundGradient from '@/components/BackgroundGradient';

type UserPreferences = {
  music?: string;
  tips?: string;
  activities?: string;
  notifications?: boolean;
  darkMode?: boolean;
  weeklyReport?: boolean;
};

// Opciones predefinidas para los dropdowns
const MUSIC_OPTIONS = [
  'Clásica', 'Pop', 'Rock', 'Electrónica', 'Jazz', 'Lo-fi', 
  'Ambiental', 'Instrumental', 'R&B', 'Reggae', 'Indie', 'Folk'
];

const TIPS_OPTIONS = [
  'Respiración', 'Hábitos', 'Mindfulness', 'Meditación', 'Yoga',
  'Ejercicio', 'Lectura', 'Escritura', 'Arte', 'Música', 'Naturaleza', 'Social'
];

const ACTIVITIES_OPTIONS = [
  'Caminar', 'Yoga', 'Lectura', 'Cocinar', 'Ejercicio', 'Meditación',
  'Arte', 'Música', 'Escritura', 'Jardinería', 'Deportes', 'Viajar'
];

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const [selectedOptions, setSelectedOptions] = useState<{
    music: string[];
    tips: string[];
    activities: string[];
  }>({
    music: [],
    tips: [],
    activities: []
  });

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
      Alert.alert('¡Guardado!', 'Tus preferencias se han actualizado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar las preferencias. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleOption = (category: 'music' | 'tips' | 'activities', option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter(item => item !== option)
        : [...prev[category], option]
    }));
  };

  const getDisplayText = (category: 'music' | 'tips' | 'activities') => {
    const selected = selectedOptions[category];
    if (selected.length === 0) return 'Selecciona opciones';
    if (selected.length === 1) return selected[0];
    if (selected.length <= 3) return selected.join(', ');
    return `${selected.length} opciones seleccionadas`;
  };

  const getOptionsForCategory = (category: 'music' | 'tips' | 'activities') => {
    switch (category) {
      case 'music': return MUSIC_OPTIONS;
      case 'tips': return TIPS_OPTIONS;
      case 'activities': return ACTIVITIES_OPTIONS;
      default: return [];
    }
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
    <BackgroundGradient variant="primary">
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="settings" size={28} color={Colors.primary[600]} />
          <Text style={styles.title}>Configuración</Text>
        </View>
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
        <View style={styles.cardHeader}>
          <MaterialIcons name="tune" size={24} color={Colors.primary[600]} />
          <Text style={styles.cardTitle}>Preferencias de recomendaciones</Text>
        </View>
        <Text style={styles.cardSubtitle}>Ayúdanos a personalizar mejor tus sugerencias</Text>
        
        {/* Música preferida */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Música preferida</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(dropdownVisible === 'music' ? null : 'music')}
          >
            <Text style={styles.dropdownText}>{getDisplayText('music')}</Text>
            <MaterialIcons 
              name={dropdownVisible === 'music' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
              size={24} 
              color={Colors.neutral[600]} 
            />
          </TouchableOpacity>
          <Text style={styles.helperText}>Tipo de música que prefieres para relajarte</Text>
        </View>

        {/* Tipos de consejos */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Tipos de consejos</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(dropdownVisible === 'tips' ? null : 'tips')}
          >
            <Text style={styles.dropdownText}>{getDisplayText('tips')}</Text>
            <MaterialIcons 
              name={dropdownVisible === 'tips' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
              size={24} 
              color={Colors.neutral[600]} 
            />
          </TouchableOpacity>
          <Text style={styles.helperText}>Qué tipo de consejos te resultan más útiles</Text>
        </View>

        {/* Actividades favoritas */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Actividades favoritas</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(dropdownVisible === 'activities' ? null : 'activities')}
          >
            <Text style={styles.dropdownText}>{getDisplayText('activities')}</Text>
            <MaterialIcons 
              name={dropdownVisible === 'activities' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
              size={24} 
              color={Colors.neutral[600]} 
            />
          </TouchableOpacity>
          <Text style={styles.helperText}>Actividades que disfrutas hacer</Text>
        </View>
      </Card>

      {/* Acciones */}
      <Card variant="outlined" style={styles.actionsCard}>
        <Button
          title="Guardar cambios"
          onPress={handleSave}
          loading={loading}
          size="large"
          style={styles.saveButton}
        />
        
        <Button
          title="Restablecer preferencias"
          onPress={resetPreferences}
          variant="outline"
          size="medium"
          style={styles.resetButton}
        />

        <Button
          title="Cerrar sesión"
          onPress={() => {
            Alert.alert(
              'Cerrar sesión',
              '¿Seguro que deseas salir de tu cuenta?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar sesión', style: 'destructive', onPress: async () => {
                  try {
                    await clearUser();
                    await clearPreferences();
                    // Reiniciar navegación a pantalla de registro
                    // @ts-ignore - navigation está disponible vía hook en stacks superiores
                    // Usamos un evento simple mediante Linking si fuera necesario
                    // Aquí asumimos que Settings está en Tabs y RootNavigator maneja 'Register'
                    navigation.dispatch(
                      CommonActions.reset({ index: 0, routes: [{ name: 'Register' }] })
                    );
                  } catch (e) {
                    Alert.alert('Error', 'No se pudo cerrar sesión');
                  }
                } }
              ]
            );
          }}
          variant="outline"
          size="medium"
          style={styles.logoutButton}
        />
      </Card>

      {/* Modal para dropdown */}
      <Modal
        visible={dropdownVisible !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {dropdownVisible === 'music' ? 'Música preferida' :
                 dropdownVisible === 'tips' ? 'Tipos de consejos' :
                 'Actividades favoritas'}
              </Text>
              <TouchableOpacity
                onPress={() => setDropdownVisible(null)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {dropdownVisible && getOptionsForCategory(dropdownVisible as any).map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionItem}
                  onPress={() => toggleOption(dropdownVisible as keyof typeof selectedOptions, option)}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionText}>{option}</Text>
                    <MaterialIcons
                      name={selectedOptions[dropdownVisible as keyof typeof selectedOptions].includes(option) ? 'check-box' : 'check-box-outline-blank'}
                      size={24}
                      color={selectedOptions[dropdownVisible as keyof typeof selectedOptions].includes(option) ? Colors.primary[600] : Colors.neutral[400]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      </ScrollView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary[700],
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
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
  // Estilos para dropdowns
  dropdownContainer: {
    marginBottom: Spacing.lg,
  },
  dropdownLabel: {
    ...Typography.label,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  dropdownText: {
    ...Typography.body,
    color: Colors.neutral[700],
    flex: 1,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  },
  // Estilos para modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxHeight: '70%',
    ...Colors.Shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  modalTitle: {
    ...Typography.h4,
    color: Colors.neutral[800],
    fontWeight: '600',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    ...Typography.body,
    color: Colors.neutral[700],
    flex: 1,
  },
});


