import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
} from 'react-native';

export default function AdminScreen({ navigation }) {
  const [tab, setTab] = useState('questions');

  // Unique IDs and clean array
  const questions = [
    { id: '1', code: 'Q01', text: 'Write a C++ Program that performs and displays arithmetic operations using both integer and floating-point data types.' },
    { id: '2', code: 'Q02', text: 'Explain OOP concepts with real-world examples.' },
    { id: '3', code: 'Q03', text: 'What is the difference between stack and heap memory?' },
    { id: '4', code: 'Q04', text: 'Describe polymorphism with examples.' },
    { id: '5', code: 'Q05', text: 'Explain inheritance and encapsulation in OOP.' },
  ];

  const renderQuestion = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.qTitle}>{item.code}:</Text>
      <Text style={styles.qText}>{item.text}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => navigation.navigate('ReportQuestion', { question: item })}
        >
          <Text style={styles.smallBtnText}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => navigation.navigate('EditQuestion', { question: item })}
        >
          <Text style={styles.smallBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#48D1E4" barStyle="light-content" />

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.logoutText}>‹ Logout</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.hello}>Hello Abrar Ahmed!</Text>
        <Text style={styles.subTitle}>
          Admin Portal (Student & Question Management)
        </Text>

        <View style={styles.wholeview}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, tab === 'students' && styles.tabActive]}
              onPress={() => setTab('students')}
            >
              <Text style={[styles.tabText, tab === 'students' && styles.tabTextActive]}>
                Students
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, tab === 'questions' && styles.tabActive]}
              onPress={() => setTab('questions')}
            >
              <Text style={[styles.tabText, tab === 'questions' && styles.tabTextActive]}>
                Questions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {/* QUESTIONS TAB */}
            {tab === 'questions' && (
              <FlatList
                data={questions}
                keyExtractor={item => item.id}
                renderItem={renderQuestion}
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

            {/* STUDENTS TAB */}
            {tab === 'students' && (
              <View style={styles.studentWrapper}>
                {['Ali', 'Ahmed', 'Usman'].map((name, index) => (
                  <View key={index} style={styles.studentCard}>
                    <Text style={styles.studentText}>{name}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
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

  headerContainer: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 20,
  },

  logo: {
    width: 120,
    height: 120,
  },

  hello: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
    marginTop: 10,
  },

  subTitle: {
    fontSize: 13,
    color: '#eafcff',
    textAlign: 'center',
    marginTop: 4,
  },

  wholeview: {
    margin: 40,
    backgroundColor: '#8fe6f2',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    width: '93%',
  },

  tabContainer: {
    flexDirection: 'row',
    borderRadius: 40,
    alignSelf: 'center',
    padding: 5,
    marginTop: 20,
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

  tabContent: {
    backgroundColor: '#f0f4f8',
    alignSelf: 'center',
    borderRadius: 25,
    padding: 5,
    flex: 1,
    width: '100%',
    marginTop: 20,
  },

  card: {
    backgroundColor: '#48D1E4',
    borderRadius: 15,
    padding: 15,
    margin: 5,
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
    marginTop: 10,
  },

  smallBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 5,
  },

  smallBtnText: {
    color: '#48D1E4',
    fontSize: 12,
    fontWeight: '600',
  },

  addQuestionBtn: {
    backgroundColor: '#48D1E4',
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  addQuestionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  studentWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },

  studentCard: {
    backgroundColor: '#48D1E4',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    width: '90%',
  },

  studentText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
