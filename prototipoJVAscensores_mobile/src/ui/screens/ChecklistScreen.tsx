import React, { useMemo, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getChecklistTemplateById, getOtById } from '../../infra/mock/mockApi';
import { useAppState } from '../state/AppState';
import { Screen } from '../components/Screen';
import { Title, AppText, Caption } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

export function ChecklistScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { otId } = route.params ?? {};
  const { dispatchEvent, isDark } = useAppState();
  const [values, setValues] = useState<Record<string, any>>({});
  const theme = getTheme(isDark ? 'dark' : 'light');

  const plantilla = useMemo(() => {
    const ot = getOtById(otId);
    const tpl = ot?.plantillaId ? getChecklistTemplateById(ot.plantillaId) : undefined;
    return tpl?.items ?? [];
  }, [otId]);

  const setValue = (id: string, v: any) => setValues((prev) => ({ ...prev, [id]: v }));

  const pickImage = async (id: string) => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!res.canceled && res.assets?.length) setValue(id, res.assets[0].uri);
  };

  const canContinue = plantilla.every((it) => {
    if (!it.obligatorio) return true;
    const v = values[it.id];
    return v !== undefined && v !== null && v !== '';
  });

  return (
    <Screen>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: theme.spacing.md }}>
          <Icon name="arrow-back" color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Title style={{ flex: 1, textAlign: 'center' }}>Checklist</Title>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          {/* Tarea 1: Revisión de equipos */}
          <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.lg }}>
            Tarea 1: Revisión de equipos
          </Title>

          {/* Equipo A encendido */}
          <Card style={{ marginBottom: theme.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <AppText style={{ fontSize: theme.typography.body }}>Equipo A encendido</AppText>
              <TouchableOpacity
                onPress={() => setValue('equipo-a', !values['equipo-a'])}
                style={{
                  width: 24,
                  height: 24,
                  borderWidth: 2,
                  borderColor: values['equipo-a'] ? theme.colors.primary : theme.colors.border,
                  borderRadius: 4,
                  backgroundColor: values['equipo-a'] ? theme.colors.primary : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {values['equipo-a'] && <Icon name="check" color={theme.colors.primaryText} size={16} />}
              </TouchableOpacity>
            </View>
          </Card>

          {/* Número de serie */}
          <Card style={{ marginBottom: theme.spacing.md }}>
            <AppText style={{ fontSize: theme.typography.body, marginBottom: theme.spacing.sm }}>
              Número de serie
            </AppText>
            <Input 
              placeholder="Escriba aquí..." 
              onChangeText={(v) => setValue('serie', v)} 
            />
          </Card>

          {/* Temperatura */}
          <Card style={{ marginBottom: theme.spacing.lg }}>
            <AppText style={{ fontSize: theme.typography.body, marginBottom: theme.spacing.sm }}>
              Temperatura (°C)
            </AppText>
            <Input 
              keyboardType="numeric" 
              placeholder="Ej: 25" 
              onChangeText={(v) => setValue('temperatura', v)} 
            />
          </Card>

          {/* Tarea 2: Mantenimiento */}
          <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.lg }}>
            Tarea 2: Mantenimiento
          </Title>

          {/* Observaciones */}
          <Card style={{ marginBottom: theme.spacing.md }}>
            <AppText style={{ fontSize: theme.typography.body, marginBottom: theme.spacing.sm }}>
              Observaciones
            </AppText>
            <Input 
              placeholder="Añadir observaciones..." 
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ height: 80 }}
              onChangeText={(v) => setValue('observaciones', v)} 
            />
          </Card>

          {/* Foto obligatoria */}
          <Card style={{ marginBottom: theme.spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText style={{ fontSize: theme.typography.body }}>Adjuntar fotos </AppText>
                <AppText style={{ fontSize: theme.typography.body, color: theme.colors.danger }}>*</AppText>
              </View>
              <TouchableOpacity onPress={() => pickImage('foto-obligatoria')}>
                <Icon name="photo-camera" color={theme.colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Mensaje de advertencia para foto obligatoria */}
          <View style={{
            backgroundColor: theme.colors.warningBg,
            borderRadius: theme.radii.sm,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.warning
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="warning" color={theme.colors.warning} size={20} style={{ marginRight: 8 }} />
              <AppText style={{ color: theme.colors.warning, fontSize: theme.typography.bodySmall }}>
                Esta foto es obligatoria para continuar.
              </AppText>
            </View>
          </View>

          {/* Foto opcional */}
          <Card style={{ marginBottom: theme.spacing.xl }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <AppText style={{ fontSize: theme.typography.body }}>Adjuntar fotos (opcional)</AppText>
              <TouchableOpacity onPress={() => pickImage('foto-opcional')}>
                <Icon name="photo-camera" color={theme.colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Mostrar fotos capturadas */}
          {values['foto-obligatoria'] && (
            <View style={{ marginBottom: theme.spacing.md }}>
              <Image 
                source={{ uri: values['foto-obligatoria'] }} 
                style={{ 
                  height: 200, 
                  borderRadius: theme.radii.md,
                  width: '100%'
                }} 
              />
            </View>
          )}

          {values['foto-opcional'] && (
            <View style={{ marginBottom: theme.spacing.xl }}>
              <Image 
                source={{ uri: values['foto-opcional'] }} 
                style={{ 
                  height: 200, 
                  borderRadius: theme.radii.md,
                  width: '100%'
                }} 
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón finalizar */}
      <View style={{ 
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border
      }}>
        <AppButton
          title="Finalizar Checklist"
          onPress={() => {
            dispatchEvent({ type: 'CHECKLIST_SAVE', otId, values });
            navigation.navigate('Signature', { otId });
          }}
          variant={canContinue ? 'primary' : 'outline'}
          style={{ width: '100%' }}
        />
      </View>
    </Screen>
  );
}


