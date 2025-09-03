import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation';
import { colors } from './src/styles/theme';
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
