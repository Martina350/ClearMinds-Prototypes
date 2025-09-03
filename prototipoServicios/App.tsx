import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
