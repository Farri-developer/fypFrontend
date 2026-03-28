import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';

import { startBaselineBP } from '../../../api/sessionApi';

export default function Baselinebp({ route, navigation }) {

  const { sid, questions } = route.params;

  const [loading, setLoading] = useState(false);
  const [bpData, setBpData] = useState(null);

  const handleMeasure = async () => {
    try {
      setLoading(true);

      const data = await startBaselineBP();

      if (data) {
        setBpData(data);
      } else {
        alert("Failed to get BP");
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.back}>← Back</Text>

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

      {/* INSTRUCTION CARD */}
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Please turn on the Rossmax monitoring device and wear the cuff properly on your arm before taking the reading.
        </Text>

        <TouchableOpacity style={styles.measureBtn} onPress={handleMeasure}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.measureText}>Measure Blood Pressure</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* RESULT CARD */}
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
        style={[styles.nextBtn, { opacity: bpData ? 1 : 0.5 }]}
        disabled={!bpData}
        onPress={() =>
          navigation.navigate('QuestionScreen', {
            sid,
            questions
          })
        }
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#43b7c5',
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
    top: 0,
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
    backgroundColor: '#00bcd4',
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
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },

  nextText: {
    fontWeight: 'bold',
  }

});