import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { OT } from '../services/mockApi';

type ChecklistRouteProp = RouteProp<{ Checklist: { ot: OT } }, 'Checklist'>;

export const ChecklistScreen: React.FC<{ route: ChecklistRouteProp }> = ({ route }) => {
  const { ot } = route.params;

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Text>Checklist para {ot._plantilla?.nombre}</Text>
      {ot._plantilla?.items.map(item => (
        <View key={item.id} style={{ marginBottom: 10 }}>
          <Text>{item.texto} ({item.obligatorio ? 'Obligatorio' : 'Opcional'})</Text>
          {/* Aquí checkboxes, pero simplificado */}
          <Text>Completado: Sí</Text>
        </View>
      ))}
    </ScrollView>
  );
};