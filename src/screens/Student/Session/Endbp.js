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
  startRecording,
  resetAll, // ✅ FIXED NAME
} from '../../../api/sessionApi';

import { deleteSession } from '../../../api/reportApi';


export default function Endbp({ route, navigation }) {
  const params = route?.params || {};

  const sid = params.sid || null;
  const questions = params.questions || [];
  const sessionid = params.sessionid || null;

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
      console.log('BP ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEXT BUTTON (FULL FIXED)
  const handleNext = async () => {
    if (finishing) return;

    try {
      setFinishing(true);

      console.log('NEXT CLICKED');
      console.log('Remaining Questions:', questions);

      // 🔁 CASE 1: QUESTIONS AVAILABLE
      if (questions.length > 0) {
        const nextQuestion = questions[0];

        console.log('START RECORDING:', nextQuestion?.qid, sid);

        // ✅ START RECORDING WITH qid + sid
        const startRes = await startRecording(
          sid,
          nextQuestion?.qid, // ✅ FIXED: qid is now an array
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
      console.log('NO QUESTIONS → STOP STREAM');

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
      console.log('NEXT ERROR:', error);
      setFinishing(false);
    }
  };

  const handleBack = async () => {
    try {
      console.log('⬅️ Back pressed - stopping stream');

      // 🗑 DELETE SESSION (agar exist kare)
      if (sessionid) {
        await deleteSession(sessionid);
        console.log('🗑 Session Deleted');
      }

      // ♻ RESET SYSTEM
      await resetAll();

      // 🔙 Navigate
      navigation.replace('StudentTabs', { sid: sid });
    } catch (error) {
      console.log('BACK ERROR:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />
      </View>

      

      {/* IMAGE */}
      <Image
        source={require('../../../../assets/icons/Cuff Icon.jpg')}
        style={styles.bpImage}
      />

      {/* TITLE */}
      <Text style={styles.title}>After Question BP</Text>
      
      <Text style={[styles.title, { fontSize: 16 }] }>Remaining Questions: {questions.length}</Text>

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

       
      </View>

      {/* NEXT BUTTON */}
      <TouchableOpacity
        style={[
          styles.nextBtn,
          {
            opacity: bpData ? 1 : 0.5,
            backgroundColor: bpData ? '#ffffff' : '#f4f7f8',
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
    
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    
  },

  back: {
    
    left: 15,
    color: 'white',
    fontSize: 16,
    marginTop: 25,
  },

  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginLeft: 102,
  },

  title: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },

  bpImage: {
    width: 150,
    height: 150,
    marginTop: 20,
    resizeMode: 'contain',
  },

  card: {
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ffffff',
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
    color: '#48D1E4',
  },
});
