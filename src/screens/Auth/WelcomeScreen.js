import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      {/* Logo / Image */}
      <Image
        source={require('../../../assets/icons/CodeMide.png')} // path check kar lena
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Welcome to CodeMide</Text>
      
      <Text style={styles.subtitle}>
        Measure . Monitor . Manage
      </Text>


      {/* Start Button */}
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.startText}>Continue</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4', // theme color
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#EFFFFF',
    marginBottom: 40,
  },
  startBtn: {
    backgroundColor: 'white',
    paddingVertical: 10,   // short height
    paddingHorizontal: 40, // short width
    borderRadius: 25,
    elevation: 3,
  },
  startText: {
    color: '#48D1E4',
    fontSize: 16,
    fontWeight: '900',

  },
});
