import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { UnifiedLoginScreen } from './src/screens/UnifiedLoginScreen';
import { InformeForm } from './src/screens/InformeForm';
import { AdminScreen } from './src/screens/AdminScreen';
import { TecnicoScreen } from './src/screens/TecnicoScreen';

export default function App() {
  const [route, setRoute] = useState<'UnifiedLogin' | 'AdminScreen' | 'TecnicoScreen' | 'InformeForm'>('UnifiedLogin');

  const navigate = (next: typeof route) => setRoute(next);

  return (
    <View style={styles.container}>
      {route === 'UnifiedLogin' ? (
        <UnifiedLoginScreen
          onLoginSuccess={(role) => {
            if (role === 'admin') {
              // Admin va a su panel específico
              navigate('AdminScreen');
            } else {
              // Técnico va a su panel específico
              navigate('TecnicoScreen');
            }
          }}
        />
      ) : route === 'AdminScreen' ? (
        <AdminScreen
          onBack={() => {
            navigate('UnifiedLogin');
          }}
        />
      ) : route === 'TecnicoScreen' ? (
        <TecnicoScreen
          onBack={() => {
            navigate('UnifiedLogin');
          }}
          technicianId="1"
          technicianName="Juan Pérez"
        />
      ) : route === 'InformeForm' ? (
        <InformeForm
          onBack={() => {
            navigate('TecnicoScreen');
          }}
        />
      ) : null}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
