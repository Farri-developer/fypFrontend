import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
} from 'react-native';
import { getAllStudents } from '../../api/studentApi';
import { getAllQuestions } from '../../api/questionApi';

export default function AdminScreen({ navigation }) {
  // Variable to manage


  //tab Control
  const [tab, setTab] = useState('questions');

  //Question  Data
  const [questions, setQuestions] = useState([]);
  const [qLoading, setQLoading] = useState(true);

  //Student   Data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);



  // When Screen was  load
  useEffect(() => {
    fetchStudents();
    fetchQuestions();
  }, []);


  //student Api
  const fetchStudents = async () => {
    const data = await getAllStudents();
    setStudents(data);
    setLoading(false);
  };


  //Question Api
  const fetchQuestions = async () => {
  const data = await getAllQuestions();
  setQuestions(data);
  setQLoading(false);
};


  // Function to render each question item

  //questions Function
  const renderQuestion = ({ item,index }) => (
    <View style={styles.card}>
      <Text style={styles.qTitle}>Q{index+1}:</Text>
      <Text style={styles.qText}>{item.description}</Text>

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
      </View>
    </View>
  );

  //Student Function
  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentLeft}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentInfo}>{item.regno}</Text>
          <Text style={styles.studentInfo}>Semester {item.semester}</Text>
        </View>
      </View>

      <View style={styles.studentRight}>
        <TouchableOpacity
          style={styles.studentBtn}
          onPress={() =>
            navigation.navigate('StudentReport', { student: item })
          }
        >
          <Text style={styles.studentBtnText}>View Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.studentBtn}
          onPress={() => navigation.navigate('EditStudent', { student: item })}
        >
          <Text style={styles.studentBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // View Render

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#48D1E4" barStyle="light-content" />

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

      {/* White Card Area */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
  },

  logoutBtn: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 10,
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  header: {
    alignItems: 'center',
    marginTop: 90,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 5,
  },

  hello: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
  },

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

  tabActive: {
    backgroundColor: '#48D1E4',
  },

  tabText: {
    color: '#48D1E4',
    fontWeight: '600',
  },

  tabTextActive: {
    color: '#ffffff',
  },

  card: {
    backgroundColor: '#48D1E4',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },

  qTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 5,
  },

  qText: {
    color: '#eafcff',
    fontSize: 13,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },

  smallBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
  },

  smallBtnText: {
    color: '#48D1E4',
    fontSize: 12,
    fontWeight: '600',
  },

  addQuestionBtn: {
    backgroundColor: '#eafcff',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
  },

  addQuestionText: {
    color: '#48D1E4',
    fontSize: 16,
    fontWeight: '600',
  },



  studentText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

  //student Styles

  studentCard: {
    backgroundColor: '#48D1E4',
    borderRadius: 18,
    padding: 15,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  studentLeft: {
    flexDirection: 'row',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 10,
  },

  studentName: {
    color: '#fff',
    fontWeight: '700',
  },

  studentInfo: {
    color: '#eafcff',
    fontSize: 12,
  },

  studentRight: {
    justifyContent: 'space-between',
  },

  studentBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 5,
    alignItems: 'center',
  },

  studentBtnText: {
    color: '#48D1E4',
    fontSize: 11,
    fontWeight: '600',
  },

  addStudentBtn: {
    backgroundColor: '#eafcff',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },

  addStudentText: {
    color: '#48D1E4',
    fontSize: 16,
    fontWeight: '600',
  },
});
