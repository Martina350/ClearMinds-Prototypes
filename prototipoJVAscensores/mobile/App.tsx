import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OT } from './src/services/mockApi';
import { HomeScreen } from './src/screens/HomeScreen';
import { OtDetailScreen } from './src/screens/OtDetailScreen';
import { ChecklistScreen } from './src/screens/ChecklistScreen';
import { SignatureScreen } from './src/screens/SignatureScreen';
import { ReportPreviewScreen } from './src/screens/ReportPreviewScreen';

type RootStackParamList = {
  Home: undefined;
  OtDetail: { ot: OT };
  Checklist: { ot: OT };
  Signature: { ot: OT };
  ReportPreview: { ot: OT };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OtDetail" component={OtDetailScreen} />
        <Stack.Screen name="Checklist" component={ChecklistScreen} />
        <Stack.Screen name="Signature" component={SignatureScreen} />
        <Stack.Screen name="ReportPreview" component={ReportPreviewScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
