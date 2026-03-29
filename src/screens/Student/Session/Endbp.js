import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import {
  afterQuestionBP,
  stopStream,
  startRecording   // ✅ FIXED NAME
} from '../../../api/sessionApi';

export default function Endbp({ route, navigation }) {

  const params = route?.params || {};

  const sid = params.sid || null;
  const questions = params.questions || [];

  const [loading, setLoading] = useState(false);
  const [bpData, setBpData] = useState(null);
  const [finishing, setFinishing] = useState(false);

  // ✅ BP MEASURE
  const handleMeasure = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const data = await afterQuestionBP();

      if (data) {
        setBpData(data);
      } else {
        alert('Failed to get BP');
      }

    } catch (error) {
      console.log("BP ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEXT BUTTON (FULL FIXED)
  const handleNext = async () => {
    if (finishing) return;

    try {
      setFinishing(true);

      console.log("NEXT CLICKED");
      console.log("Remaining Questions:", questions);

      // 🔁 CASE 1: QUESTIONS AVAILABLE
      if (questions.length > 0) {

        const nextQuestion = questions[0];
         

        console.log("START RECORDING:", nextQuestion?.qid, sid);

        // ✅ START RECORDING WITH qid + sid
        const startRes = await startRecording(
          sid,
          nextQuestion?.qid // ✅ FIXED: qid is now an array
          
        );

        if (!startRes) {
          alert('Failed to start recording');
          setFinishing(false);
          return;
        }

        // ✅ NAVIGATE TO QUESTION
        navigation.replace('QuestionAttempt', {
          questions: questions,
          sid: sid,
        });

        return;
      }

      // 🛑 CASE 2: NO QUESTIONS → STOP STREAM
      console.log("NO QUESTIONS → STOP STREAM");

      const stopRes = await stopStream();

      if (!stopRes) {
        alert('Failed to stop session');
        setFinishing(false);
        return;
      }

      // ✅ GO TO SELF REPORT
      navigation.replace('SelfReport', {
        sid: sid,
      });

    } catch (error) {
      console.log("NEXT ERROR:", error);
      setFinishing(false);
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

      {/* TITLE */}
      <Text style={styles.title}>After Question BP</Text>
      <Text style={styles.title}>Session ID: {sid}</Text>
      <Text style={styles.title}>Questions: {questions.length}</Text>

      {/* IMAGE */}
      <Image
        source={require('../../../../assets/icons/Cuff Icon.jpg')}
        style={styles.bpImage}
      />

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Please take your blood pressure after this question.
        </Text>

        <TouchableOpacity style={styles.measureBtn} onPress={handleMeasure}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.measureText}>Measure BP</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* RESULT */}
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>BP Reading:</Text>

        <Text style={styles.resultText}>
          Systolic: {bpData ? bpData.SYS : '___'} mmHg
        </Text>

        <Text style={styles.resultText}>
          Diastolic: {bpData ? bpData.DIA : '___'} mmHg
        </Text>

        <Text style={styles.resultText}>
          Pulse: {bpData ? bpData.PULSE : '___'} bpm
        </Text>

        <Text style={styles.resultText}>
          Session ID: {bpData ? bpData.SESSIONID : '___'}
        </Text>
      </View>

      {/* NEXT BUTTON */}
      <TouchableOpacity
        style={[
          styles.nextBtn,
          {
            opacity: bpData ? 1 : 0.5,
            backgroundColor: bpData ? '#48D1E4' : '#ccc',
          },
        ]}
        disabled={!bpData || finishing}
        onPress={handleNext}
      >
        {finishing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.nextText}>Next</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
    alignItems: 'center',
    paddingTop: 40,
  },

  header: {
    width: '100%',
    alignItems: 'center',
  },

  back: {
    position: 'absolute',
    left: 15,
    color: 'white',
  },

  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },

  title: {
    color: 'white',
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },

  bpImage: {
    width: 150,
    height: 150,
    marginTop: 20,
    resizeMode: 'contain',
  },

  card: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    width: '85%',
    alignItems: 'center',
  },

  cardText: {
    textAlign: 'center',
    marginBottom: 10,
  },

  measureBtn: {
    backgroundColor: '#48D1E4',
    padding: 10,
    borderRadius: 10,
  },

  measureText: {
    color: 'white',
    fontWeight: 'bold',
  },

  resultCard: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    width: '85%',
  },

  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  resultText: {
    marginTop: 5,
  },

  nextBtn: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },

  nextText: {
    fontWeight: 'bold',
    color: 'white',
  }

});