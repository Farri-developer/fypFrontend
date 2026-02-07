import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

import { updateStudent, getStudentById } from '../../../api/studentApi';

export default function EditStudent({ navigation, route }) {
  const { student } = route.params || {};
  const studentId = student?.sid;

  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [gender, setGender] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Load student data
  useEffect(() => {
    if (!studentId) return;

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await getStudentById(studentId);

        setStudentName(data.name || '');
        setRegNo(data.regno || '');
        setGender(data.gender || '');
        setSemester(String(data.semester || ''));
        setCgpa(String(data.cgpa || ''));
        setPassword(data.password || '');
      } catch (error) {
        Alert.alert('Error', 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  // 🔹 Update student
  const handleUpdate = async () => {
    if (!studentName || !regNo || !gender || !semester || !cgpa || !password) {
      Alert.alert('Validation Error', 'Please fill all fields');
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

    const updatedData = {
      name: studentName,
      regno: regNo,
      gender,
      semester: parseInt(semester),
      cgpa: parseFloat(cgpa),
      password,
    };

    try {
      setLoading(true);
      await updateStudent(studentId, updatedData);

      Alert.alert('Success', 'Student updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Update Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const GenderOption = ({ label }) => (
    <TouchableOpacity onPress={() => setGender(label)} style={styles.genderOption}>
      <View style={[styles.radio, gender === label && styles.radioSelected]} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Edit Student Account</Text>

        <View style={styles.box}>
          {/* Name */}
          <Text style={styles.label}>Student Name :</Text>
          <TextInput
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
            placeholder="Enter Full Name"
            placeholderTextColor="black"
          />

          {/* Reg No */}
          <Text style={styles.label}>ARID Reg No :</Text>
          <TextInput
            style={styles.input}
            value={regNo}
            onChangeText={setRegNo}
            placeholder="Enter Registration No"
            placeholderTextColor="black"
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
            placeholder="Enter Semester (1-8)"
            placeholderTextColor="black"
          />

          {/* CGPA */}
          <Text style={styles.label}>CGPA :</Text>
          <TextInput
            style={styles.input}
            value={cgpa}
            onChangeText={setCgpa}
            keyboardType="decimal-pad"
            placeholder="Enter CGPA (0.0 - 4.0)"
            placeholderTextColor="black"
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
              placeholderTextColor="black"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={require('../../../../assets/icons/eye.png')}
                style={{ width: 24, height: 24, marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>

          {/* Update Button */}
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} disabled={loading}>
            <Text style={styles.updateText}>{loading ? 'Updating...' : 'Update Student'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#48D1E4' },

  backButton: { alignSelf: 'flex-start', margin: 15, marginTop: 25 },
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

  updateBtn: {
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },

  updateText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
