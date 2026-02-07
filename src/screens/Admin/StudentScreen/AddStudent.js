// AddStudent.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import { registerStudent } from '../../../api/studentApi'; // 🔹 Import API

export default function AddStudent({ navigation }) {
  // 🔹 State variables
  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [gender, setGender] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔹 Handle Register
  const handleRegister = async () => {
    // 🔹 Frontend Validations
    if (
      !studentName ||
      !regNo ||
      !gender ||
      !semester ||
      !cgpa ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Validation Error',
        'Password and Confirm Password do not match',
      );
      return;
    }

    if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 4) {
      Alert.alert('Validation Error', 'CGPA must be between 0 and 4');
      return;
    }

    if (parseInt(semester) < 1 || parseInt(semester) > 8) {
      Alert.alert('Validation Error', 'Semester must be between 1 and 8');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Validation Error', 'Please agree to terms & privacy policy');
      return;
    }

    // 🔹 Student object
    const studentData = {
      regno: regNo,
      name: studentName,
      gender,
      password,
      cgpa: parseFloat(cgpa),
      semester: parseInt(semester),
    };

    try {
      setLoading(true);

      // 🔹 API call using studentApi.js
      await registerStudent(studentData);

      Alert.alert('Success', 'Student Registered Successfully');
       navigation.goBack(); // 🔹 Navigate back to Admin screen

    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
      
    }
  };

  // 🔹 Gender radio option component
  const GenderOption = ({ label }) => (
    <TouchableOpacity
      onPress={() => setGender(label)}
      style={styles.genderOption}
    >
      <View style={[styles.radio, gender === label && styles.radioSelected]} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}> ‹ Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create Student Account</Text>

        <View style={styles.box}>
          {/* Name */}
          <Text style={styles.label}>Student Name :</Text>
          <TextInput
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
            placeholder="Enter Full Name " // 🔹 Placeholder example
            placeholderTextColor="black" // 🔹 Ye line set karti hai placeholder ka color
          />

          {/* Reg No */}
          <Text style={styles.label}>ARID Reg No :</Text>
          <TextInput
            style={styles.input}
            value={regNo}
            onChangeText={setRegNo}
            placeholder="Enter Registration No (2022-arid-3981)" // 🔹 Placeholder example
            placeholderTextColor="black" // 🔹 Ye line set karti hai placeholder ka color
          />

          {/* Gender */}
          <Text style={styles.label}>Gender :</Text>
          <View style={styles.genderRow}>
            <GenderOption label="Male" />
            <GenderOption label="Female" />
          </View>

          {/* Semester */}
          <Text style={styles.label}>Semester :</Text>
          <TextInput
            style={styles.input}
            value={semester}
            onChangeText={setSemester}
            keyboardType="numeric"
            placeholder="Enter Semester (1-8)" // 🔹 Placeholder example
            placeholderTextColor="black" // 🔹 Ye line set karti hai placeholder ka color
          />

          {/* CGPA */}
          <Text style={styles.label}>CGPA :</Text>
          <TextInput
            style={styles.input}
            value={cgpa}
            onChangeText={setCgpa}
            keyboardType="decimal-pad"
            placeholder="Enter CGPA (0.0 - 4.0)" // 🔹 Placeholder example
            placeholderTextColor="black" // 🔹 Ye line set karti hai placeholder ka color
          />

          {/* Password */}
          <Text style={styles.label}>Password :</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter Password"
              placeholderTextColor="black" // 🔹 Ye line set karti hai placeholder ka color
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={require('../../../../assets/icons/eye.png')} // 🔹 Custom eye icon
                style={{ width: 24, height: 24, marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password :</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="black" // 🔹 Ye line set karti hai placeholder ka color
              placeholder="Confirm Password"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Image
                source={require('../../../../assets/icons/eye.png')} // 🔹 Custom eye icon
                style={{ width: 24, height: 24, marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <View style={styles.termsRow}>
            <CheckBox
              value={agreeTerms}
              onValueChange={setAgreeTerms}
              tintColors={{ true: '#48D1E4', false: 'gray' }} // 🔹 Checked blue, unchecked gray
            />
            <Text style={styles.termsText}>I Agree to Privacy Policy</Text>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerText}>
              {loading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#48D1E4' },

  backButton: { alignSelf: 'flex-start', margin: 15  , marginTop: 25 },
  backText: { color: 'white', fontSize: 16, fontWeight: '600' },

  scrollContent: { paddingTop: 10, alignItems: 'center', paddingBottom: 30 },

  logo: { width: 150, height: 150, marginTop: 10 },

  title: {
    fontSize: 20,
    color: 'white',
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '700',
  },

  box: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
  },

  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },

  input: {
    borderWidth: 1,
    borderColor: '#D9FAFF',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#D9FAFF',
    color: 'black',
  },

  genderRow: { flexDirection: 'row', marginVertical: 5 },
  genderOption: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#48D1E4',
    marginRight: 5,
  },
  radioSelected: { backgroundColor: '#48D1E4' },

  passwordRow: { flexDirection: 'row', alignItems: 'center' },

  termsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },

  registerBtn: {
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },

  registerText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
