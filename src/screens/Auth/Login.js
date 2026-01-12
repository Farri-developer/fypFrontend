import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Hardcoded users
  const adminUser = {
    username: 'admin',
    password: '1234',
  };

  const studentUser = {
    username: 'student',
    password: '1234',
  };

  const handleLogin = () => {
    if (
      username === adminUser.username &&
      password === adminUser.password
    ) {
      navigation.replace('Admin');
    } 
    else if (
      username === studentUser.username &&
      password === studentUser.password
    ) {
      navigation.replace('Student');
    } 
    else {
      Alert.alert('Error', 'Invalid Username or Password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
