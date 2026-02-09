import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { registerStudent } from '../../api/studentApi';

// 🔹 PasswordInput OUTSIDE component to prevent re-render focus issue
const PasswordInput = ({ value, onChangeText, placeholder, show, toggleShow }) => (
  <View style={styles.passwordContainer}>
    <TextInput
      placeholder={placeholder}
      style={styles.passwordInput}
      secureTextEntry={!show}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="black"
      autoCapitalize="none"
      autoCorrect={false}
    />

    <TouchableOpacity onPress={toggleShow}>
      <Image
        source={require('../../../assets/icons/eye.png')}
        style={styles.eyeIcon}
      />
    </TouchableOpacity>
  </View>
);

const SignUpScreen = ({ navigation }) => {
  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [gender, setGender] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!studentName || !regNo || !gender || !semester || !cgpa || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password and Confirm Password do not match.');
      return;
    }

    if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 4) {
      Alert.alert('Error', 'CGPA must be between 0 and 4.');
      return;
    }

    if (parseInt(semester) < 1 || parseInt(semester) > 8) {
      Alert.alert('Error', 'Semester must be between 1 and 8.');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the privacy policy.');
      return;
    }

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
      await registerStudent(studentData);
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login', { signupData: { regNo } });
    } catch (error) {
      Alert.alert('Error', error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Image source={require('../../../assets/icons/CodeMide.png')} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Please create a new account</Text>

        <View style={styles.box}>
          <Text style={styles.label}>Student Name :</Text>
          <TextInput
            placeholder="Enter Your Name"
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
            placeholderTextColor="black"
          />

          <Text style={styles.label}>Reg No :</Text>
          <TextInput
            placeholder="2022-ARID-3981"
            style={styles.input}
            value={regNo}
            onChangeText={setRegNo}
            placeholderTextColor="black"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Gender :</Text>
          <View style={styles.genderRow}>
            {['Male', 'Female'].map((g) => (
              <TouchableOpacity key={g} onPress={() => setGender(g)} style={styles.genderOption}>
                <View style={[styles.radio, gender === g && styles.radioSelected]} />
                <Text>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Semester :</Text>
          <TextInput
            placeholder="1 to 8"
            style={styles.input}
            value={semester}
            onChangeText={setSemester}
            placeholderTextColor="black"
            keyboardType="numeric"
          />

          <Text style={styles.label}>CGPA :</Text>
          <TextInput
            placeholder="Enter CGPA"
            style={styles.input}
            value={cgpa}
            onChangeText={setCgpa}
            placeholderTextColor="black"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Password :</Text>
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            show={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          <Text style={styles.label}>Confirm Password :</Text>
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            show={showConfirmPassword}
            toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <View style={styles.termsRow}>
            <CheckBox value={agreeTerms} onValueChange={setAgreeTerms} tintColors={{ true: '#48D1E4', false: 'gray' }} />
            <Text style={styles.termsText}>I Agree to Privacy Policy</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
              <Text style={styles.registerText}>{loading ? 'Registering...' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#48D1E4', flex: 1 },
  backButton: { alignSelf: 'flex-start', margin: 15, marginTop: 25 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  scrollContent: { alignItems: 'center', paddingBottom: 30 },
  logo: { width: 150, height: 150, marginTop: 10 },
  title: { fontSize: 20, color: 'white', marginVertical: 10, textAlign: 'center' },
  box: { width: '90%', backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 30 },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#D9FAFF', borderRadius: 5, padding: 10, backgroundColor: '#D9FAFF', color: 'black' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D9FAFF', borderRadius: 5, backgroundColor: '#D9FAFF', paddingHorizontal: 10 },
  passwordInput: { flex: 1, paddingVertical: 10, color: 'black' },
  eyeIcon: { width: 22, height: 22, tintColor: 'gray' },
  genderRow: { flexDirection: 'row', marginVertical: 5 },
  genderOption: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#48D1E4', marginRight: 5 },
  radioSelected: { backgroundColor: '#48D1E4' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  termsText: { fontSize: 14 },
  registerBtn: { backgroundColor: '#48D1E4', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center', width: '50%' },
  registerText: { color: 'white', fontSize: 16 },
});

export default SignUpScreen;
