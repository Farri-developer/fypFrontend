import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/Auth/WelcomeScreen';
import LoginScreen from './src/screens/Auth/Login';

import AdminScreen from './src/screens/Admin/Dashboard';
import StudentScreen from './src/screens/Student/Dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Student" component={StudentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
