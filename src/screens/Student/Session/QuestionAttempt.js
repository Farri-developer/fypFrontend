import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Switch
} from 'react-native';

import { stopRecording } from '../../../api/sessionApi';

export default function QuestionAttempt({ route, navigation }) {

  const params = route?.params || {};
  const currentQuestion = params.questions[0] || null;
  const remainingQuestions = params.questions.slice(1) || [];


  const sid = params.sid || null;

  const [seconds, setSeconds] = useState(
    (currentQuestion?.duration || 1) * 60
  );

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatgptEnabled, setChatgptEnabled] = useState(false);

  const hasNavigated = useRef(false);

  // ✅ TIMER
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev === 1 && !hasNavigated.current) {
          hasNavigated.current = true;
          setTimeout(() => handleNext(), 0);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ✅ NEXT → GO TO END BP WITH REMAINING QUESTIONS
  const handleNext = async () => {
    if (loading || hasNavigated.current) return;

    hasNavigated.current = true;

    try {
      setLoading(true);

      const data = await stopRecording(answer, chatgptEnabled);

      if (!data) {
        alert("Recording stop failed");
        hasNavigated.current = false;
        return;
      }

      navigation.replace("Endbp", {
        sid: sid,
        questions: remainingQuestions   // 👈 pass remaining
      });

    } catch (error) {
      console.log(error);
      hasNavigated.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />
      </View>

      {/* CARD */}
      <View style={styles.card}>

        <View style={styles.topBox}>
          <Text style={styles.qTitle}>Question</Text>
          


          <View style={styles.timerBox}>
            <Text style={styles.timerText}>
              ⏱ {formatTime()}
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Question Statement:</Text>
        <Text style={styles.question}>
          {currentQuestion?.description || "No Question"}
        </Text>

        <Text style={styles.question}>
          {currentQuestion?.qid || "No Question"}
        </Text>

        <View style={styles.gptRow}>
          <Text style={styles.gptText}>ChatGPT</Text>
          <Switch
            value={chatgptEnabled}
            onValueChange={setChatgptEnabled}
          />
        </View>

        <Text style={styles.inputLabel}>Write Your Code Below</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your program..."
          multiline
          value={answer}
          onChangeText={setAnswer}
        />

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextText}>Submit</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Auto move when time ends
        </Text>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
    paddingTop: 40
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  back: {
    position: 'absolute',
    left: 15,
    color: 'white'
  },

  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain'
  },

  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 25,
    padding: 20
  },

  topBox: {
    backgroundColor: '#48D1E4',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center'
  },

  qTitle: {
    color: '#fff',
    fontWeight: 'bold'
  },

  timerBox: {
    marginTop: 8,
    backgroundColor: '#dff6f9',
    padding: 6,
    borderRadius: 10
  },

  timerText: {
    fontSize: 12
  },

  label: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#48D1E4'
  },

  question: {
    marginTop: 5,
    fontSize: 13
  },

  gptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },

  gptText: {
    color: '#48D1E4',
    fontWeight: 'bold'
  },

  inputLabel: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#48D1E4'
  },

  input: {
    marginTop: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    height: 120
  },

  nextBtn: {
    marginTop: 20,
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },

  nextText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  footer: {
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
    color: 'gray'
  }

});