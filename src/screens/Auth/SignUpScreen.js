import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { registerStudent } from '../../api/studentApi';

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
    if (
      !studentName ||
      !regNo ||
      !gender ||
      !semester ||
      !cgpa ||
      !password ||
      !confirmPassword
    ) {
      alert('Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return;
    }

    if (cgpa < 0 || cgpa > 4) {
      alert('CGPA must be between 0 and 4.');
      return;
    }

    if (semester < 1 || semester > 8) {
      alert('Semester must be between 1 and 8.');
      return;
    }

    if (!agreeTerms) {
      alert('Please agree to the terms and privacy policy.');
      return;
    }

    const studentData = {
      regno: regNo,
      name: studentName,
      gender: gender,
      password: password,
      cgpa: parseFloat(cgpa),
      semester: parseInt(semester),
    };

    try {
      setLoading(true);
      await registerStudent(studentData);
      alert('Registration successful!');
      navigation.navigate('Login', { signupData: { regNo } });
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    value,
    onChangeText,
    placeholder,
    secure,
    toggleSecure,
  }) => (
    <View style={styles.passwordContainer}>
      <TextInput
        placeholder={placeholder}
        style={styles.passwordInput}
        secureTextEntry={!secure}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="black"
      />

      <TouchableOpacity onPress={toggleSecure}>
        <Image
          source={require('../../../assets/icons/eye.png')}
          style={styles.eyeIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Image
          source={require('../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />

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
          />

          <Text style={styles.label}>Gender :</Text>
          <View style={styles.genderRow}>
            {['Male', 'Female'].map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={styles.genderOption}
              >
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
            secure={showPassword}
            toggleSecure={() => setShowPassword(!showPassword)}
          />

          <Text style={styles.label}>Confirm Password :</Text>
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secure={showConfirmPassword}
            toggleSecure={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <View style={styles.termsRow}>
            <CheckBox
              value={agreeTerms}
              onValueChange={setAgreeTerms}
              tintColors={{ true: '#48D1E4', false: 'gray' }}
            />
            <Text style={styles.termsText}>I Agree to Privacy Policy</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#48D1E4', flex: 1 },

  backButton: { alignSelf: 'flex-start', margin: 15, marginTop: 25 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  scrollContent: { alignItems: 'center', paddingBottom: 30 },

  logo: { width: 150, height: 150, marginTop: 10 },

  title: { fontSize: 20, color: 'white', marginVertical: 10, textAlign: 'center' },

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
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#D9FAFF',
    color: 'black',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9FAFF',
    borderRadius: 5,
    backgroundColor: '#D9FAFF',
    paddingHorizontal: 10,
  },

  passwordInput: { flex: 1, paddingVertical: 10, color: 'black' },

  eyeIcon: { width: 22, height: 22, tintColor: 'gray' },

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

  termsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },

  termsText: { fontSize: 14 },

  registerBtn: {
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '50%',
  },

  registerText: { color: 'white', fontSize: 16 },
});

export default SignUpScreen;