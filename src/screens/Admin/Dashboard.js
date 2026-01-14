import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import QuestionScreen from './QuestionScreen';
import StudentScreen from './StudentScreen';

const Tab = createBottomTabNavigator();

export default function AdminScreen({ navigation }) {
  return (  // <-- You must return JSX
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Student" component={StudentScreen} />
      <Tab.Screen name="Question" component={QuestionScreen} />
    </Tab.Navigator>
  );
}
