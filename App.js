import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/Auth/WelcomeScreen';
import LoginScreen from './src/screens/Auth/Login';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import AdminScreen from './src/screens/Admin/Dashboard';
import StudentTabs from './src/screens/Student/StudentTabs';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>

        <Stack.Screen name="Welcome" component={WelcomeScreen}    />
        <Stack.Screen name="Login" component={LoginScreen }    />
        <Stack.Screen name="SignUp" component={SignUpScreen } />
        <Stack.Screen name="Admin" component={AdminScreen }  />
         <Stack.Screen name="StudentTabs" component={StudentTabs} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
