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
  startBaselineBP,
  startRecording,
  resetAll,
} from '../../../api/sessionApi';

export default function Baselinebp({ route, navigation }) {
  const { sid, questions } = route.params;

  const [loading, setLoading] = useState(false);
  const [bpData, setBpData] = useState(null);
  const [starting, setStarting] = useState(false);

  // 🔥 BP FUNCTION
  const handleMeasure = async () => {
    try {
      setLoading(true);

      const data = await startBaselineBP();

      if (data) {
        setBpData(data); // ✅ enable next button
      } else {
        alert('Failed to get BP');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEXT BUTTON FUNCTION
  const handleNext = async () => {
    try {
      setStarting(true);

      if (!questions || questions.length === 0) {
        alert('No questions available');
        return;
      }

      // ✅ first question
      const firstQuestion = questions[0];

      // 🔥 API CALL
      const data = await startRecording(sid, firstQuestion.qid);

      if (data && data.status === 'recording started') {
        // ✅ Navigate
        navigation.navigate('QuestionAttempt', {
          questions: questions,
          sid: sid,
          sessionid: data.sessionid,
        });
      } else {
        alert('Recording start failed');
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    } finally {
      setStarting(false);
    }
  };

  const handleBack = async () => {
    try {
      console.log('⬅️ Back pressed - stopping stream');

      // 🔥 STOP STREAM + RESET
      await resetAll();

      // 👇 screen wapas
      navigation.goBack();
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

      <Text style={styles.title}>Take Baseline Reading</Text>

      {/* IMAGE */}
      <Image
        source={require('../../../../assets/icons/Cuff Icon.jpg')}
        style={styles.bpImage}
      />

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Please turn on the Rossmax monitoring device and wear the cuff
          properly on your arm before taking the reading.
        </Text>

        <TouchableOpacity style={styles.measureBtn} onPress={handleMeasure}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.measureText}>Measure Blood Pressure</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* RESULT */}
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Your Blood Pressure Reading:</Text>

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
        disabled={!bpData || starting}
        onPress={handleNext}
      >
        {starting ? (
          <ActivityIndicator color="#ffffff" />
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
    alignItems: 'center',
    flexDirection: 'row',
  },

  back: {
   
    left: 15,
    fontSize: 16,
   
    color: 'white',
  },

  logo: {
    width: 75,
    height: 75,
    marginLeft: 100, 

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
