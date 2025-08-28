import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { RoleSelectionScreen } from './src/screens/RoleSelectionScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { InformeForm } from './src/screens/InformeForm';
import { AdminScreen } from './src/screens/AdminScreen';
import { TecnicoScreen } from './src/screens/TecnicoScreen';

export default function App() {
  const [route, setRoute] = useState<'RoleSelection' | 'Login' | 'AdminScreen' | 'TecnicoScreen' | 'InformeForm'>('RoleSelection');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'tecnico' | undefined>(undefined);

  const navigate = (next: typeof route) => setRoute(next);

  return (
    <View style={styles.container}>
      {route === 'RoleSelection' ? (
        <RoleSelectionScreen
          onSelectRole={(role) => {
            setSelectedRole(role);
            navigate('Login');
          }}
        />
      ) : route === 'Login' ? (
        <LoginScreen
          role={selectedRole!}
          onLoginSuccess={() => {
            if (selectedRole === 'admin') {
              // Admin va a su panel específico
              navigate('AdminScreen');
            } else {
              // Técnico va a su panel específico
              navigate('TecnicoScreen');
            }
          }}
          onBack={() => {
            setSelectedRole(undefined);
            navigate('RoleSelection');
          }}
        />
      ) : route === 'AdminScreen' ? (
        <AdminScreen
          onBack={() => {
            setSelectedRole(undefined);
            navigate('RoleSelection');
          }}
        />
      ) : route === 'TecnicoScreen' ? (
        <TecnicoScreen
          onBack={() => {
            setSelectedRole(undefined);
            navigate('RoleSelection');
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
