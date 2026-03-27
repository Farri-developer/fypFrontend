import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import {
  getStudentQuestionReport,
  getEEGDelta,
  getEEGTheta,
  getEEGAlpha,
  getEEGBeta,
  getEEGGamma
} from '../../../api/reportApi';

const screenWidth = Dimensions.get("window").width;

export default function StudentQuestionReport({ navigation, route }) {

  const { sid, sessionId, qid } = route.params;

  const [question, setQuestion] = useState(null);
  const [eeg, setEeg] = useState({});
  const [loading, setLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // ✅ STEP 1: FAST LOAD (question data)
      const q = await getStudentQuestionReport(sid, qid);
      setQuestion(q);
      setLoading(false); // screen show ho jaye

      // ✅ STEP 2: SLOW LOAD (graphs)
      const delta = await getEEGDelta(sid, sessionId, qid);
      const theta = await getEEGTheta(sid, sessionId, qid);
      const alpha = await getEEGAlpha(sid, sessionId, qid);
      const beta = await getEEGBeta(sid, sessionId, qid);
      const gamma = await getEEGGamma(sid, sessionId, qid);

      setEeg({ delta, theta, alpha, beta, gamma });

    } catch (err) {
      console.log("Error:", err);
    } finally {
      setGraphLoading(false); // graphs ready
    }
  };

  // ✅ GRAPH FUNCTION (FULL DATA + CLEAN LOOK)
  const renderChart = (data, label, color) => {
    if (!data?.time || !data[label]) return null;

    const values = data[label];
    const time = data.time;

    const labels = time.map((t, i) => (i % 20 === 0 ? t.toString() : ""));

    return (
      <View style={{ marginBottom: 25 }}>
        <Text style={styles.chartTitle}>{label.toUpperCase()}</Text>

        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: values,
                color: () => color,
                strokeWidth: 2
              }
            ]
          }}
          width={screenWidth - 60}
          height={180}
          withDots={false}
          withInnerLines={true}
          withOuterLines={true}
          withShadow={false}
          chartConfig={{
            backgroundGradientFrom: "#f9f9f9",
            backgroundGradientTo: "#f9f9f9",
            decimalPlaces: 2,
            color: () => color,
            labelColor: () => "#555",
            propsForBackgroundLines: {
              stroke: "#ccc",
              strokeDasharray: "5,5"
            }
          }}
          bezier
          style={{ borderRadius: 10 }}
        />
      </View>
    );
  };

  // ✅ LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* BACK */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      {/* LOGO */}
      <Image
        source={require('../../../../assets/icons/CodeMide.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Question Report</Text>

      {/* QUESTION */}
      <View style={styles.card}>
        <Text style={styles.question}>
          {question?.description || "No Question Found"}
        </Text>
      </View>

      {/* STRESS */}
      <View style={styles.card}>
        <Text style={styles.heading}>Overall Stress</Text>

        <Text>Final Stress Level: {question?.stress_level || "N/A"}</Text>
        <Text>Complete time: {question?.time_taken || "0"} sec</Text>

        <Text style={styles.subHeading}>Blood Pressure (BP) Analysis</Text>
        <Text>{question?.bp || "N/A"}</Text>

        <Text style={styles.subHeading}>Heart Rate Variability (PPG)</Text>
        <Text>HR: {question?.HR ?? "N/A"} BPM</Text>
        <Text>RMSSD: {question?.RMSSD ?? "N/A"} ms</Text>
        <Text>SDNN: {question?.SDNN ?? "N/A"} ms</Text>

        <Text style={styles.note}>
          Higher RMSSD and SDNN indicate better relaxation.
        </Text>
      </View>

      {/* EEG */}
      <View style={styles.card}>
        <Text style={styles.heading}>EEG Individual Bands</Text>

        {graphLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            {renderChart(eeg.delta, "delta", "#3b82f6")}
            {renderChart(eeg.theta, "theta", "#10b981")}
            {renderChart(eeg.alpha, "alpha", "#f59e0b")}
            {renderChart(eeg.beta, "beta", "#ef4444")}
            {renderChart(eeg.gamma, "gamma", "#8b5cf6")}
          </>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
    padding: 20
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48D1E4'
  },

  back: {
    color: '#fff',
    fontSize: 18,
    
  },

  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center'
  },

  title: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10
  },

  question: {
    textAlign: 'center',
    color: '#48D1E4',
    fontWeight: 'bold'
  },

  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },

  subHeading: {
    marginTop: 10,
    fontWeight: 'bold'
  },

  chartTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },

  note: {
    marginTop: 8,
    fontSize: 12,
    color: 'gray'
  }

});