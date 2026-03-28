import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { getAllQuestions } from '../../../api/reportApi';
import { startSession } from '../../../api/sessionApi';

export default function TestScreen({ route, navigation }) {

  const { sid, name, semester } = route.params;

  // 🔥 Separate states
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [startingSession, setStartingSession] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getAllQuestions(sid);
      setQuestions(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // 🔥 START SESSION
  const handleStart = async () => {
    try {
      setStartingSession(true);

      const success = await startSession();

      if (success) {
        navigation.navigate('Baselinebp', {
          sid: sid,
          questions: questions,
        });
      } else {
        alert('Failed to start session');
      }

    } catch (error) {
      console.log(error);
    } finally {
      setStartingSession(false);
    }
  };

  // 🔥 Loading Questions Screen
  if (loadingQuestions) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={{ marginTop: 10 }}>Loading Questions...</Text>
      </View>
    );
  }

  // 🔥 No Questions
  if (!questions.length) {
    return (
      <View style={styles.center}>
        <Text>No Questions Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.back}>← Back</Text>

        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Programming Test</Text>

        <Image
          source={require('../../../../assets/icons/EEG Device copy.png')}
          style={styles.image}
        />
      </View>

      {/* CARD */}
      <ScrollView contentContainerStyle={styles.card}>

        {/* QUESTIONS */}
        {questions.map((q, index) => (
          <View key={q.qid} style={styles.questionBox}>
            <Text style={styles.heading}>Question {index + 1}</Text>

            <Text style={styles.text}>{q.description}</Text>

            <Text style={styles.duration}>
              Duration: {q.duration} minutes
            </Text>
          </View>
        ))}

        {/* NOTES */}
        <Text style={styles.note}>
          Your focus level, stress, and heart rate signals will be recorded during the test.
        </Text>

        <Text style={styles.warning}>
          Please turn ON the monitoring device before starting the test.
        </Text>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          disabled={startingSession}
        >
          {startingSession ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Start Test</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#43b7c5',
  },

  header: {
    alignItems: 'center',
    paddingTop: 40,
  },

  back: {
    position: 'absolute',
    left: 15,
    top: 40,
    color: 'white',
    fontSize: 16,
  },

  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },

  title: {
    color: 'white',
    fontSize: 22,
    marginTop: 10,
    fontWeight: 'bold',
  },

  image: {
    width: 150,
    height: 150,
    marginTop: 10,
    resizeMode: 'contain',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  

  card: {
    backgroundColor: '#ffffff',

    borderRadius: 20,
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
  },

  questionBox: {
    marginBottom: 15,
  },

  heading: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },

  text: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },

  duration: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#00bcd4',
  },

  note: {
    marginTop: 15,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },

  warning: {
    marginTop: 10,
    fontSize: 12,
    color: '#00bcd4',
    textAlign: 'center',
  },

  user: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
  },

  button: {
    marginTop: 20,
    backgroundColor: '#00bcd4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
