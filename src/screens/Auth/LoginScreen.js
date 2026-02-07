// LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { loginUser } from '../../api/loginApi';

export default function LoginScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Load saved RegNo + Signup RegNo
  useEffect(() => {
    const loadSavedUser = async () => {
      const savedRegNo = await AsyncStorage.getItem('savedRegNo');
      if (savedRegNo) {
        setUsername(savedRegNo);
        setRememberMe(true);
      }
    };

    loadSavedUser();

    if (route.params?.signupData?.regNo) {
      setUsername(route.params.signupData.regNo);
    }
  }, [route.params]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter Reg No and Password');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(username, password);

      // Save / Remove RegNo
      if (rememberMe) {
        await AsyncStorage.setItem('savedRegNo', username);
      } else {
        await AsyncStorage.removeItem('savedRegNo');
      }

      if (data.role === 'admin') {
        navigation.replace('Admin');
      } else if (data.role === 'student') {
        navigation.replace('StudentTabs');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      {/* Form */}
      <View style={styles.form}>
        <Image
          source={require('../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login to continue</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reg No</Text>
          <TextInput
            placeholder="Enter your Reg No"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="black"
          />

          <Text style={styles.label}>Password</Text>
          {/* 🔹 Password Row with Eye Icon */}
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="Enter password"
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="black"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={require('../../../assets/icons/eye.png')} // 🔹 Eye icon
                style={{ width: 24, height: 24, marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me */}
          <View style={styles.checkboxRow}>
            <CheckBox
              value={rememberMe}
              onValueChange={setRememberMe}
              tintColors={{ true: '#48D1E4', false: 'gray' }} // 🔹 Checked=Blue, Unchecked=Gray
            />
            <Text style={styles.checkboxText}>Remember me</Text>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
  },
  backButton: {
    alignSelf: 'flex-start',
    margin: 15,
    marginTop: 25,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 220,
    height: 220,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#48D1E4',
    backgroundColor: '#D9FAFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,

    color: 'black',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' }, // 🔹 Password + Eye
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    marginLeft: 8,
  },
  loginBtn: {
    backgroundColor: '#48D1E4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
