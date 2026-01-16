import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView 
} from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // or use any checkbox lib

const SignUpScreen = ({ navigation }) => {
  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [gender, setGender] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  
  const handleRegister = async () => {
  // 1. Check all fields
  if (!studentName || !regNo || !gender || !semester || !cgpa || !password || !confirmPassword) {
    alert('Please fill all the fields.');
    return;
  }

  // 2. Check password match
  if (password !== confirmPassword) {
    alert('Password and Confirm Password do not match.');
    return;
  }

   // 3. Check cgpa
  if (cgpa < 0 || cgpa > 4) {
    alert('CGPA must be between 0 and 4.');
    return;
  }

  
   // 4. Check semester range
  if (semester < 1 || semester > 8) {
    alert('Semester must be between 1 and 8.');
    return;
  }

  // 3. Check terms
  if (!agreeTerms) {
    alert('Please agree to the terms and privacy policy.');
    return;
  }

  // 4. Prepare data
  const studentData = {
    regno: regNo,
    name: studentName,
    gender: gender,
    password: password,
    cgpa: parseFloat(cgpa), // make sure it's a number
    semester: parseInt(semester), // make sure it's a number
  };

  try {
    // 5. Send data to API
    const response = await fetch('http://192.168.100.7:5000/api/student/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registration successful!');
      // Navigate to login or other screen
      navigation.navigate('Login', { signupData: { regNo, password } });
    } else {
      alert(`Error: ${data.message || 'Something went wrong'}`);
    }
  } catch (error) {
    console.log(error);
    alert('Failed to register. Please try again.');
  }
};
 

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require('../../../assets/icons/CodeMide.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Please create a new account</Text>

      {/* Form Box */}
      <View style={styles.box}>

        <Text style={styles.label}>Student Name :</Text>
        <TextInput
          placeholder="Enter Your Name"
          style={styles.input}
          value={studentName}
          onChangeText={setStudentName}
        />

        <Text style={styles.label}>Reg No :</Text>
        <TextInput
          placeholder="2022-ARID-3981"
          style={styles.input}
          value={regNo}
          onChangeText={setRegNo}
        />

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

        <Text style={styles.label}>Semester :</Text>
        <TextInput
          placeholder="1 to 8"
          style={styles.input}
          value={semester}
          onChangeText={setSemester}
        />

        <Text style={styles.label}>CGPA :</Text>
        <TextInput
          placeholder="Enter CGPA"
          style={styles.input}
          value={cgpa}
          onChangeText={setCgpa}
        />

        <Text style={styles.label}>Password :</Text>
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

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
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
  },
  backButton: {
    alignSelf: 'flex-start',
    margin: 20,
    marginTop: 60,
  },
  backText: {
    color: 'white',
    fontSize: 16,
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
  },
  registerText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUpScreen;
