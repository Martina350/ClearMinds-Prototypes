import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DataProvider } from "./src/data/DataContext";

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AdminScreen from "./src/screens/AdminScreen";
import TechnicianScreen from "./src/screens/TechnicianScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="Technician" component={TechnicianScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}


