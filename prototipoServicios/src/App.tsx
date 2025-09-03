import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './navigation';
import { colors } from './styles/theme';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.primary}
        translucent={false}
      />
      <AppNavigator />
    </>
  );
}
