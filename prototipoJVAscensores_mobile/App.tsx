import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/ui/navigation/RootNavigator';
import { Bootstrap } from './src/ui/providers/Bootstrap';
import { AppStateProvider, useAppState } from './src/ui/state/AppState';

const queryClient = new QueryClient();

function ThemedNavigation() {
  const { isDark } = useAppState();
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Bootstrap>
        <View style={{ flex: 1 }}>
          <RootNavigator />
          <StatusBar style="auto" />
        </View>
      </Bootstrap>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <ThemedNavigation />
        </AppStateProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
