import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from '@/screens/HomeScreen';
import DogHomeScreen from '@/screens/DogHomeScreen';
import { getPreferences, getUser } from '@/storage/localDb';
import { Colors } from '@/theme/colors';

interface DeciderProps {
  navigation: any;
}

export default function PetHomeDecider(props: DeciderProps) {
  const [pet, setPet] = useState<'Cats' | 'Dogs' | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const prefs = await getPreferences<{ petPreference?: 'Cats' | 'Dogs' }>();
        if (prefs?.petPreference) {
          setPet(prefs.petPreference);
          return;
        }
        const user = await getUser();
        const fromUser = (user?.personality || {}).pet_preference as 'Cats' | 'Dogs' | undefined;
        setPet(fromUser || 'Cats');
      } catch (e) {
        setPet('Cats');
      }
    };
    load();
  }, []);

  if (!pet) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.light }}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
      </View>
    );
  }

  if (pet === 'Dogs') {
    return <DogHomeScreen {...props} />;
  }
  return <HomeScreen {...props} />;
}


