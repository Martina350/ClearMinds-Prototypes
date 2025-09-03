import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { UnifiedLoginScreen } from './screens/UnifiedLoginScreen';
import { AdminScreen } from './screens/AdminScreen';
import { TecnicoScreen } from './screens/TecnicoScreen';
import { colors } from './styles/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'admin' | 'tecnico'>('login');

  const handleLoginSuccess = (role: 'admin' | 'tecnico') => {
    if (role === 'admin') {
      setCurrentScreen('admin');
    } else {
      setCurrentScreen('tecnico');
    }
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'admin':
        return <AdminScreen onBack={handleLogout} />;
      case 'tecnico':
        return <TecnicoScreen onBack={handleLogout} />;
      default:
        return <UnifiedLoginScreen onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.background}
        translucent={false}
      />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
