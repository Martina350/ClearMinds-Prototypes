import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { OT } from '../services/mockApi';
import { marcarLlegada, marcarSalida, cerrarOT } from '../services/mockApi';
import { useOts } from '../store/useOts';

type OtDetailRouteProp = RouteProp<{ OtDetail: { ot: OT } }, 'OtDetail'>;

export const OtDetailScreen: React.FC<{ route: OtDetailRouteProp; navigation: any }> = ({ route, navigation }) => {
  const { ot } = route.params;
  const { updateOt } = useOts();

  const handleLlegada = async () => {
    const updated = await marcarLlegada(ot.id);
    if (updated) updateOt(updated);
  };

  const handleSalida = async () => {
    const updated = await marcarSalida(ot.id);
    if (updated) updateOt(updated);
  };

  const handleCerrar = async () => {
    const updated = await cerrarOT(ot.id);
    if (updated) updateOt(updated);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Text>Edificio: {ot._edificio?.direccion}</Text>
      <Text>Plantilla: {ot._plantilla?.nombre}</Text>
      <Text>Estado: {ot.estado}</Text>
      <Button title="Llegué" onPress={handleLlegada} />
      <Button title="Salí" onPress={handleSalida} />
      <Button title="Checklist" onPress={() => navigation.navigate('Checklist', { ot })} />
      <Button title="Firma" onPress={() => navigation.navigate('Signature', { ot })} />
      <Button title="Cerrar OT" onPress={handleCerrar} />
      <Button title="Ver Reporte" onPress={() => navigation.navigate('ReportPreview', { ot })} />
    </ScrollView>
  );
};