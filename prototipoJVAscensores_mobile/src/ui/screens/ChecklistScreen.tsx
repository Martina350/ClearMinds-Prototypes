import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getOtById } from '../../infra/mock/mockApi';
import { useAppState } from '../state/AppState';
import { Screen } from '../components/Screen';
import { Title, AppText, Caption } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

interface ChecklistItem {
  id: string;
  item: string;
  task: string;
  completed: boolean;
  observations: string;
}

export function ChecklistScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { otId } = route.params ?? {};
  const { dispatchEvent, isDark } = useAppState();
  const [values, setValues] = useState<Record<string, any>>({});
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: 'A', item: 'A', task: 'Limpieza del cuarto de máquinas', completed: false, observations: '' },
    { id: 'B', item: 'B', task: 'Revisión del tablero de control, voltajes de entrada, estado de fusibles', completed: false, observations: '' },
    { id: 'C', item: 'C', task: 'Revisión del estado de cables de tracción, máquina del ascensor', completed: false, observations: '' },
    { id: 'D', item: 'D', task: 'Chequeo, ajuste y calibración de ruidos anormales en la máquina - poleas del ascensor', completed: false, observations: '' },
    { id: 'E', item: 'E', task: 'Lubricación de rieles de cabina y contrapeso', completed: false, observations: '' },
    { id: 'F', item: 'F', task: 'Revisión del nivel de aceite en recipientes lubricadores de rieles de cabina y contrapeso', completed: false, observations: '' },
    { id: 'G', item: 'G', task: 'Limpieza general sobre la cabina del ascensor', completed: false, observations: '' },
    { id: 'H', item: 'H', task: 'Nivelación de la parada de cabina en cada uno de los pisos y revisión del sistema de frenado', completed: false, observations: '' },
    { id: 'I', item: 'I', task: 'Revisión de botoneras y flechas direccionales', completed: false, observations: '' },
    { id: 'J', item: 'J', task: 'Chequeo y arreglo de las luminarias del ascensor', completed: false, observations: '' },
    { id: 'K', item: 'K', task: 'Operador de puertas de cabina, lo que incluye: limpieza, ajustes y lubricación del operador – rodamientos, puertas de cabina, micros, ajustes de bandas, quicios, etc.', completed: false, observations: '' },
    { id: 'L', item: 'L', task: 'Limpieza y revisión de las puertas de pasillo, lubricación de correderas, limpieza de quicios', completed: false, observations: '' },
    { id: 'M', item: 'M', task: 'Chequeo de elementos mecánicos de las puertas', completed: false, observations: '' },
    { id: 'N', item: 'N', task: 'Revisión de sensores y actuadores del ascensor', completed: false, observations: '' },
    { id: 'Ñ', item: 'Ñ', task: 'Limpieza del pie de pozo del ascensor', completed: false, observations: '' }
  ]);
  const theme = getTheme(isDark ? 'dark' : 'light');

  const ot = getOtById(otId);

  const setValue = (id: string, v: any) => setValues((prev) => ({ ...prev, [id]: v }));

  const toggleItem = (id: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateObservations = (id: string, observations: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, observations } : item
    ));
  };

  const pickImage = async (id: string) => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!res.canceled && res.assets?.length) setValue(id, res.assets[0].uri);
  };

  const canContinue = values['foto-obligatoria'] && values['general-observations'];

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          {/* Header con información del edificio */}
          <Card style={{ marginBottom: theme.spacing.lg }}>
            <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
              <View style={{ flex: 1, marginRight: theme.spacing.md }}>
                <AppText style={{ fontSize: theme.typography.bodySmall, marginBottom: 4, fontWeight: '600' }}>EDIFICIO:</AppText>
                <Input 
                  placeholder="Nombre del edificio" 
                  value={values['edificio'] || ot?.edificio || ''}
                  onChangeText={(v) => setValue('edificio', v)} 
                />
                
                <AppText style={{ fontSize: theme.typography.bodySmall, marginBottom: 4, marginTop: theme.spacing.sm, fontWeight: '600' }}>CIUDAD:</AppText>
                <Input 
                  placeholder="Ciudad" 
                  value={values['ciudad'] || 'Quito'}
                  onChangeText={(v) => setValue('ciudad', v)} 
                />
                
                <AppText style={{ fontSize: theme.typography.bodySmall, marginBottom: 4, marginTop: theme.spacing.sm, fontWeight: '600' }}>DIRECCIÓN:</AppText>
                <Input 
                  placeholder="Dirección" 
                  value={values['direccion'] || 'Calle 123, #45-67'}
                  onChangeText={(v) => setValue('direccion', v)} 
                />
                
                <AppText style={{ fontSize: theme.typography.bodySmall, marginBottom: 4, marginTop: theme.spacing.sm, fontWeight: '600' }}>FECHA:</AppText>
                <Input 
                  placeholder="Fecha" 
                  value={values['fecha'] || new Date().toLocaleDateString('es-ES')}
                  onChangeText={(v) => setValue('fecha', v)} 
                />
              </View>
              
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: theme.typography.bodySmall, marginBottom: 4, fontWeight: '600' }}>MARCA ASCENSORES:</AppText>
                <Input 
                  placeholder="Marca" 
                  value={values['marca'] || 'OTIS'}
                  onChangeText={(v) => setValue('marca', v)} 
                />
                
                <AppText style={{ fontSize: theme.typography.bodySmall, marginBottom: 4, marginTop: theme.spacing.sm, fontWeight: '600' }}>N° DE ASCENSORES:</AppText>
                <Input 
                  placeholder="Cantidad" 
                  value={values['cantidad'] || '2'}
                  onChangeText={(v) => setValue('cantidad', v)} 
                />
                
                <AppText style={{ fontSize: theme.typography.bodySmall, marginBottom: 4, marginTop: theme.spacing.sm, fontWeight: '600' }}>TÉCNICO:</AppText>
                <Input 
                  placeholder="Nombre del técnico" 
                  value={values['tecnico'] || 'Juan Pérez'}
                  onChangeText={(v) => setValue('tecnico', v)} 
                />
              </View>
            </View>
          </Card>

          {/* Tabla de checklist */}
          <Card style={{ marginBottom: theme.spacing.lg }}>
            <AppText style={{ fontSize: theme.typography.h3, fontWeight: '700', marginBottom: theme.spacing.md, textAlign: 'center' }}>
              CHECKLIST DE MANTENIMIENTO
            </AppText>
            
            {/* Header de la tabla */}
            <View style={{ 
              flexDirection: 'row', 
              borderBottomWidth: 1, 
              borderBottomColor: theme.colors.border,
              paddingBottom: theme.spacing.sm,
              marginBottom: theme.spacing.sm
            }}>
              <View style={{ width: 30 }}>
                <AppText style={{ fontSize: theme.typography.bodySmall, fontWeight: '600' }}>ÍTEM</AppText>
              </View>
              <View style={{ flex: 1, marginHorizontal: theme.spacing.sm }}>
                <AppText style={{ fontSize: theme.typography.bodySmall, fontWeight: '600' }}>TAREA</AppText>
              </View>
              <View style={{ width: 40 }}>
                <AppText style={{ fontSize: theme.typography.bodySmall, fontWeight: '600', textAlign: 'center' }}>SÍ</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: theme.typography.bodySmall, fontWeight: '600' }}>OBSERVACIONES</AppText>
              </View>
            </View>

            {/* Filas de tareas */}
            {checklistItems.map((item, index) => (
              <View key={item.id} style={{ marginBottom: theme.spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ width: 30, alignItems: 'center', marginTop: 4 }}>
                    <AppText style={{ fontSize: theme.typography.bodySmall, fontWeight: '600' }}>{item.item}</AppText>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: theme.spacing.sm }}>
                    <AppText style={{ fontSize: theme.typography.bodySmall, lineHeight: 18 }}>{item.task}</AppText>
                  </View>
                  <View style={{ width: 40, alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => toggleItem(item.id)}
                      style={{
                        width: 24,
                        height: 24,
                        borderWidth: 2,
                        borderColor: item.completed ? theme.colors.primary : theme.colors.border,
                        borderRadius: 4,
                        backgroundColor: item.completed ? theme.colors.primary : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.completed && <Icon name="check" color={theme.colors.primaryText} size={16} />}
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      placeholder="Observaciones..."
                      value={item.observations}
                      onChangeText={(text) => updateObservations(item.id, text)}
                      style={{
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        borderRadius: theme.radii.sm,
                        padding: theme.spacing.xs,
                        fontSize: theme.typography.bodySmall,
                        color: theme.colors.text,
                        backgroundColor: theme.colors.card,
                        minHeight: 32
                      }}
                      multiline
                    />
                  </View>
                </View>
                {index < checklistItems.length - 1 && (
                  <View style={{ 
                    height: 1, 
                    backgroundColor: theme.colors.border, 
                    marginTop: theme.spacing.sm 
                  }} />
                )}
              </View>
            ))}
          </Card>

          {/* Materiales */}
          <Card style={{ marginBottom: theme.spacing.lg }}>
            <AppText style={{ fontSize: theme.typography.h3, fontWeight: '700', marginBottom: theme.spacing.md }}>
              MATERIALES DE LIMPIEZA Y LUBRICACIÓN:
            </AppText>
            <AppText style={{ fontSize: theme.typography.body }}>
              ACEITE, GRASA, DIESEL, GUAIPE Y LIMPIADOR DE CONTACTOS
            </AppText>
          </Card>

          {/* Observaciones generales */}
          <Card style={{ marginBottom: theme.spacing.lg }}>
            <AppText style={{ fontSize: theme.typography.h3, fontWeight: '700', marginBottom: theme.spacing.md }}>
              OBSERVACIONES:
            </AppText>
            <TextInput
              placeholder="Ingrese observaciones generales aquí..."
              value={values['general-observations'] || ''}
              onChangeText={(text) => setValue('general-observations', text)}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radii.md,
                padding: theme.spacing.md,
                fontSize: theme.typography.body,
                color: theme.colors.text,
                backgroundColor: theme.colors.card,
                minHeight: 100,
                textAlignVertical: 'top'
              }}
              multiline
              numberOfLines={6}
            />
          </Card>

          {/* Foto obligatoria */}
          <Card style={{ marginBottom: theme.spacing.md }}>
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

          {/* Mostrar fotos capturadas */}
          {values['foto-obligatoria'] && (
            <View style={{ marginBottom: theme.spacing.xl }}>
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
            dispatchEvent({ type: 'CHECKLIST_SAVE', otId, values, checklistItems });
            navigation.navigate('Signature', { otId });
          }}
          variant={canContinue ? 'primary' : 'outline'}
          style={{ width: '100%' }}
        />
      </View>
    </Screen>
  );
}