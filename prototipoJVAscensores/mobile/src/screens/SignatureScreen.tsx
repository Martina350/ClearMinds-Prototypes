import React from 'react';
import { View, Text, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { OT } from '../services/mockApi';
import { saveSignature } from '../lib/signature';

type SignatureRouteProp = RouteProp<{ Signature: { ot: OT } }, 'Signature'>;

export const SignatureScreen: React.FC<{ route: SignatureRouteProp; navigation: any }> = ({ route, navigation }) => {
  const { ot } = route.params;

  const handleSign = () => {
    const sig = saveSignature('mock');
    // Guardar en OT o algo
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text>Firma para {ot.id}</Text>
      {/* Aquí canvas, pero simplificado */}
      <Button title="Firmar" onPress={handleSign} />
    </View>
  );
};