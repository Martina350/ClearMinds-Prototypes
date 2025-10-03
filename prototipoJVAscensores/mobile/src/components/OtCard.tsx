import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { OT } from '../services/mockApi';

interface OtCardProps {
  ot: OT;
  onPress: () => void;
}

export const OtCard: React.FC<OtCardProps> = ({ ot, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10, borderWidth: 1, margin: 5 }}>
      <Text>{ot._edificio?.direccion || 'N/A'}</Text>
      <Text>{ot.programada}</Text>
      <Text>{ot.estado}</Text>
    </TouchableOpacity>
  );
};