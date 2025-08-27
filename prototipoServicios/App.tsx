import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { RoleSelectionScreen } from './src/screens/RoleSelectionScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { InformeForm } from './src/screens/InformeForm';

export default function App() {
  const [route, setRoute] = useState<'RoleSelection' | 'Login' | 'InformeForm'>('RoleSelection');
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
              // Por ahora solo regresa a la selección de roles
              setSelectedRole(undefined);
              navigate('RoleSelection');
            } else {
              // Técnico va al formulario de informe
              navigate('InformeForm');
            }
          }}
          onBack={() => {
            setSelectedRole(undefined);
            navigate('RoleSelection');
          }}
        />
      ) : route === 'InformeForm' ? (
        <InformeForm
          onBack={() => {
            setSelectedRole(undefined);
            navigate('RoleSelection');
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
