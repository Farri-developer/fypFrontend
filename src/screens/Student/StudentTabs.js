import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen';
import TestScreen from './Session/TestScreen';
import ReportScreen from './ReportScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function StudentTabs({ route }) {

  const sid = route.params?.sid || null;
  // const name = route.params?.name || null;
  // const semester = route.params?.semester || null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === 'Home') {
            icon = require('../../../assets/icons/home.png'); // apna icon
          } 
          else if (route.name === 'Test') {
            icon = require('../../../assets/icons/Test.png');
          } 
          else if (route.name === 'Report') {
            icon = require('../../../assets/icons/Report.png');
          } 
          else if (route.name === 'Profile') {
            icon = require('../../../assets/icons/Profile.png'); // ✅ important
          }

          return (
            <Image
              source={icon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#48D1E4' : '#888',
              }}
            />
          );
        },

        tabBarActiveTintColor: '#48D1E4',
        tabBarInactiveTintColor: '#888',

        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ sid}} />
      <Tab.Screen name="Test" component={TestScreen} initialParams={{ sid }} />
      <Tab.Screen name="Report" component={ReportScreen} initialParams={{ sid }} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ sid }} />
    </Tab.Navigator>
  );
}