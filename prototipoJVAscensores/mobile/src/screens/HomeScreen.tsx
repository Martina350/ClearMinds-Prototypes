import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSession } from '../store/useSession';
import { useOts } from '../store/useOts';
import { getOtsByTecnico } from '../services/mockApi';
import { OtCard } from '../components/OtCard';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tecnicoId } = useSession();
  const { ots, setOts } = useOts();

  useEffect(() => {
    if (tecnicoId) {
      getOtsByTecnico(tecnicoId).then(setOts);
    }
  }, [tecnicoId]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text>OTs del Día</Text>
      <FlatList
        data={ots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OtCard ot={item} onPress={() => navigation.navigate('OtDetail', { ot: item })} />
        )}
      />
    </View>
  );
};