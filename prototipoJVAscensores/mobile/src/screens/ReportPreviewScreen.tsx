import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { OT } from '../services/mockApi';

type ReportPreviewRouteProp = RouteProp<{ ReportPreview: { ot: OT } }, 'ReportPreview'>;

export const ReportPreviewScreen: React.FC<{ route: ReportPreviewRouteProp }> = ({ route }) => {
  const { ot } = route.params;

  const report = `
    OT: ${ot.id}
    Edificio: ${ot._edificio?.direccion}
    Técnico: ${ot.tecnicoId}
    Estado: ${ot.estado}
    Checklist: ${ot._plantilla?.items.map(i => i.texto).join(', ')}
  `;

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Text>Reporte</Text>
      <Text>{report}</Text>
      <Button title="Imprimir/Compartir" onPress={() => alert('Simulado')} />
    </ScrollView>
  );
};