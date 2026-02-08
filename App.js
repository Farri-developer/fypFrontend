import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/Auth/WelcomeScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import EditQuestion from './src/screens/Admin/QuestionScreen/EditQuestion';
import ReportQuestion from './src/screens/Admin/QuestionScreen/ReportQuestion';
import EditStudent from './src/screens/Admin/StudentScreen/EditStudent';
import StudentSession from './src/screens/Admin/StudentScreen/StudentSession';
import AddStudent from './src/screens/Admin/StudentScreen/AddStudent';
import AdminScreen from './src/screens/Admin/AdminTab';
import StudentTabs from './src/screens/Student/StudentTabs';



import AddQuestionScreen from './src/screens/Admin/QuestionScreen/AddQuestionScreen';
import { ScreenStackHeaderLeftView } from 'react-native-screens';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>



       
        <Stack.Screen name="Welcome" component={WelcomeScreen}    />
        <Stack.Screen name="Login" component={LoginScreen }    />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{headerShown:false}}
        />

 

          {/* auth screens */}
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="StudentTabs" component={StudentTabs} />


        {/* Admin Screens */}


        {/* Admin Question Screen  */}
        <Stack.Screen name="EditQuestion" component={EditQuestion} />
        <Stack.Screen name="ReportQuestion" component={ReportQuestion} />
        <Stack.Screen name="AddQuestion" component={AddQuestionScreen} />

        {/* Admin Student Screen  */}
        <Stack.Screen name="EditStudent" component={EditStudent} />
        <Stack.Screen name="StudentSession" component={StudentSession} />         
        <Stack.Screen name="AddStudent" component={AddStudent} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
