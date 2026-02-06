import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const EditStudent = ({ navigation, route }) => {
  const { student } = route.params || {};

  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [gender, setGender] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const studentId = student?.sid; 

  // 🔹 Load student data from API when screen opens
  useEffect(() => {
    if (!studentId) return;

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://192.168.100.7:5000/api/student/getbyid/${studentId}`
        );
        const data = await response.json();

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
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    if (cgpa < 0 || cgpa > 4) {
      Alert.alert('Validation', 'CGPA must be between 0 and 4');
      return;
    }

    if (semester < 1 || semester > 8) {
      Alert.alert('Validation', 'Semester must be between 1 and 8');
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

      const response = await fetch(
        `http://192.168.100.7:5000/api/student/update/${studentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error('Update failed');

      Alert.alert('Success', 'Student updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Edit Students</Text>

        <View style={styles.box}>
          {/* Name */}
          <Text style={styles.label}>Student Name :</Text>
          <TextInput
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
            placeholder="Enter Name"
            placeholderTextColor="black"
          />

          {/* Gender */}
          <Text style={styles.label}>Gender :</Text>
          <View style={styles.genderRow}>
            {['Female', 'Male'].map((g) => (
              <TouchableOpacity
                key={g}
                style={styles.genderOption}
                onPress={() => setGender(g)}
              >
                <View
                  style={[
                    styles.radio,
                    gender === g && styles.radioSelected,
                  ]}
                />
                <Text>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Reg No */}
          <Text style={styles.label}>Reg No :</Text>
          <TextInput
            style={styles.input}
            value={regNo}
            onChangeText={setRegNo}
            placeholder="2022-ARID-3981"
            placeholderTextColor="black"
          />

          {/* Semester */}
          <Text style={styles.label}>Semester :</Text>
          <TextInput
            style={styles.input}
            value={semester}
            onChangeText={setSemester}
            keyboardType="numeric"
            placeholder="1 - 8"
            placeholderTextColor="black"
          />

          {/* CGPA */}
          <Text style={styles.label}>CGPA :</Text>
          <TextInput
            style={styles.input}
            value={cgpa}
            onChangeText={setCgpa}
            keyboardType="numeric"
            placeholder="0 - 4"
            placeholderTextColor="black"
          />

          {/* Password with eye toggle */}
          <Text style={styles.label}>Password :</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Password"
              placeholderTextColor="black"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Text>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.btnText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateBtn}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? 'Updating...' : 'Update'}
              </Text>
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
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    color: 'white',
  },
  box: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    marginLeft: 10,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backBtn: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  updateBtn: {
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditStudent;
