import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen';
import TestScreen from './TestScreen';
import ReportScreen from './ReportScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function StudentTabs({ route }) {

  const sid = route.params?.sid || null;


  return (
    <Tab.Navigator screenOptions={{ headerShown: false  }}>
      {/* Sahi tariqa: component prop use karo */}
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ sid }} />
      <Tab.Screen name="Test" component={TestScreen} initialParams={{ sid }} />
      <Tab.Screen name="Report" component={ReportScreen} initialParams={{ sid }} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ sid }} />
    </Tab.Navigator>
  );
}

