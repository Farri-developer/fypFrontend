import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView 
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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!studentName || !regNo || !gender || !semester || !cgpa || !password || !confirmPassword) {
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
      const data = await registerStudent(studentData);
      alert('Registration successful!');
      navigation.navigate('Login', { signupData: { regNo } });
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button fixed at top */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <Image
          source={require('../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Please create a new account</Text>

        {/* Form Box */}
        <View style={styles.box}>
          {/* Student Name */}
          <Text style={styles.label}>Student Name :</Text>
          <TextInput
            placeholder="Enter Your Name"
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
          />

          {/* Reg No */}
          <Text style={styles.label}>Reg No :</Text>
          <TextInput
            placeholder="2022-ARID-3981"
            style={styles.input}
            value={regNo}
            onChangeText={setRegNo}
          />

          {/* Gender */}
          <Text style={styles.label}>Gender :</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity onPress={() => setGender('Male')} style={styles.genderOption}>
              <View style={[styles.radio, gender === 'Male' && styles.radioSelected]} />
              <Text>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGender('Female')} style={styles.genderOption}>
              <View style={[styles.radio, gender === 'Female' && styles.radioSelected]} />
              <Text>Female</Text>
            </TouchableOpacity>
          </View>

          {/* Semester */}
          <Text style={styles.label}>Semester :</Text>
          <TextInput
            placeholder="1 to 8"
            style={styles.input}
            value={semester}
            onChangeText={setSemester}
          />

          {/* CGPA */}
          <Text style={styles.label}>CGPA :</Text>
          <TextInput
            placeholder="Enter CGPA"
            style={styles.input}
            value={cgpa}
            onChangeText={setCgpa}
          />

          {/* Password */}
          <Text style={styles.label}>Password :</Text>
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password :</Text>
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Terms */}
          <View style={styles.termsRow}>
            <CheckBox value={agreeTerms} onValueChange={setAgreeTerms} />
            <Text style={{ marginLeft: 8 }}>Agree the terms of use and privacy policy</Text>
          </View>

          {/* Register Button */}
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
              <Text style={styles.registerText}>{loading ? 'Registering...' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  scrollContent: {
    paddingTop: 100, // leaves space for the fixed back button
    alignItems: 'center',
    paddingBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginVertical: 10,
    textAlign: 'center',
  },
  box: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9FAFF',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#D9FAFF',
    color: 'black',
  },
  genderRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#48D1E4',
    marginRight: 5,
  },
  radioSelected: {
    backgroundColor: '#48D1E4',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  registerBtn: {
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '50%',
  },
  registerText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUpScreen;
