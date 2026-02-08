import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { getAllStudents, deleteStudent } from '../../api/studentApi';
import { getAllQuestions, deleteQuestion } from '../../api/questionApi';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminScreen({ navigation }) {
  // Tab control
  const [tab, setTab] = useState('students');

  // Data states
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qLoading, setQLoading] = useState(true);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      const data = await getAllQuestions();
      setQuestions(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Refresh data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (isActive) {
          setLoading(true);
          setQLoading(true);
          await fetchStudents();
          await fetchQuestions();
          setLoading(false);
          setQLoading(false);
        }
      };

      fetchData();

      return () => {
        isActive = false; // cleanup on blur
      };
    }, []),
  );

  // Delete student
  const handleDeleteStudent = async sid => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(sid);
              fetchStudents(); // Refresh after delete
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
    );
  };

  // Delete question
  const handleDeleteQuestion = async qid => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuestion(qid);
              fetchQuestions();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
    );
  };

  // Render functions
  const renderQuestion = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.qTitle}>
        Q{index + 1}: {item.description}{' '}
      </Text>

      <View style={{ flexDirection: 'row' ,paddingLeft: 5}}>
        <Text style={styles.qText}>Level: {item.questionlevel} |</Text>
        <Text style={styles.qText}>Total Attempts: {item.count} </Text>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() =>
            navigation.navigate('ReportQuestion', { question: item })
          }
        >
          <Text style={styles.smallBtnText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() =>
            navigation.navigate('EditQuestion', { question: item })
          }
        >
          <Text style={styles.smallBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => handleDeleteQuestion(item.qid)}
        >
          <Text style={styles.smallBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentLeft}>
        <View style={styles.avatar}>
          <Image
            source={require('../../../assets/icons/Profilew.png')}
            style={{ width: 35, height: 35, marginTop: 10, marginLeft: 2 }}
          />
        </View>
        <View>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentInfo}>{item.regno}</Text>
          <Text style={styles.studentInfo}>Semester {item.semester}</Text>
          <Text style={styles.studentInfo}>CGPA {item.cgpa}</Text>
        </View>
      </View>
      <View style={styles.studentRight}>
        <TouchableOpacity
          style={styles.studentBtn}
          onPress={() =>
            navigation.navigate('StudentSession', { student: item })
          }
        >
          <Text style={styles.studentBtnText}>All Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.studentBtn}
          onPress={() => navigation.navigate('EditStudent', { student: item })}
        >
          <Text style={styles.studentBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.studentBtn}
          onPress={() => handleDeleteStudent(item.sid)}
        >
          <Text style={styles.studentBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.logoutText}>‹ Logout</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />
        <Text style={styles.hello}>Wellcome!</Text>
        <Text style={styles.subTitle}>
          Admin Portal ( Student & Question Management )
        </Text>
      </View>

      {/* Main Card */}
      <View style={styles.mainCard}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tab === 'students' && styles.tabActive]}
            onPress={() => setTab('students')}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'students' && styles.tabTextActive,
              ]}
            >
              Students
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'questions' && styles.tabActive]}
            onPress={() => setTab('questions')}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'questions' && styles.tabTextActive,
              ]}
            >
              Questions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {tab === 'questions' && (
          <FlatList
            data={questions}
            keyExtractor={item => item.qid.toString()}
            renderItem={renderQuestion}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.addQuestionBtn}
                onPress={() => navigation.navigate('AddQuestion')}
              >
                <Text style={styles.addQuestionText}>+ Add Question</Text>
              </TouchableOpacity>
            }
          />
        )}

        {tab === 'students' && (
          <FlatList
            data={students}
            keyExtractor={item => item.sid.toString()}
            renderItem={renderStudent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.addStudentBtn}
                onPress={() => navigation.navigate('AddStudent')}
              >
                <Text style={styles.addStudentText}>+ Add Students</Text>
              </TouchableOpacity>
            }
          />
        )}
      </View>
    </View>
  );
}

// Styles (same as before)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#48D1E4' },
  logoutBtn: { margin: 15, alignSelf: 'flex-start', marginTop: 25 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  header: { alignItems: 'center', marginTop: 10 },
  logo: { width: 90, height: 90, marginBottom: 5 },
  hello: { fontSize: 26, color: '#fff', fontWeight: '700' },
  subTitle: {
    fontSize: 13,
    color: '#eafcff',
    marginTop: 5,
    textAlign: 'center',
  },
  mainCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 25,
    padding: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f7fa',
    borderRadius: 30,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  tabActive: { backgroundColor: '#48D1E4' },
  tabText: { color: '#48D1E4', fontWeight: '600' },
  tabTextActive: { color: '#ffffff' },
  card: {
    backgroundColor: '#48D1E4',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  qTitle: { color: '#fff', fontWeight: '700', marginBottom: 5, fontSize: 15 },
  qText: { color: '#eafcff', fontSize: 14, fontWeight: '600' ,paddingLeft: 10},
  btnRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  smallBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  smallBtnText: { color: '#48D1E4', fontSize: 12, fontWeight: '600' },
  addQuestionBtn: {
    backgroundColor: '#eafcff',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
  },
  addQuestionText: { color: '#48D1E4', fontSize: 16, fontWeight: '600' },
  studentCard: {
    backgroundColor: '#48D1E4',
    borderRadius: 18,
    padding: 8,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studentLeft: { flexDirection: 'row' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 20,
    backgroundColor: '#48D1E4',
    marginRight: 12,
    marginTop: 4,
  },
  studentName: { color: '#fff', fontWeight: '700', fontSize: 16 },
  studentInfo: { color: '#eafcff', fontSize: 14 },
  studentRight: { justifyContent: 'space-between' },
  studentBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 5,
    alignItems: 'center',
  },
  studentBtnText: { color: '#48D1E4', fontSize: 11, fontWeight: '600' },
  addStudentBtn: {
    backgroundColor: '#eafcff',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  addStudentText: { color: '#48D1E4', fontSize: 16, fontWeight: '600' },
});
