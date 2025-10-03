import React from 'react';
import { View, Text } from 'react-native';

interface StatBadgeProps {
  status: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ status }) => {
  const color = status === 'completada' ? 'green' : status === 'en_curso' ? 'blue' : 'gray';
  return (
    <View style={{ backgroundColor: color, padding: 5, borderRadius: 5 }}>
      <Text style={{ color: 'white' }}>{status}</Text>
    </View>
  );
};