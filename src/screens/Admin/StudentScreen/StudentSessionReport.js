import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import {
  getStudentSessionReport,
  getEEGData,
  getSelfReport,
  getPPGAll,
} from '../../../api/reportApi';

export default function StudentSessionReport({ navigation, route }) {
  const { sessionId, studentId } = route.params;

  const [report, setReport] = useState(null);
  const [eeg, setEeg] = useState(null);

  const [ppg, setPpg] = useState(null);
  const [loading, setLoading] = useState(true); // main data
  const [graphLoading, setGraphLoading] = useState(true); // graph
  const [selfReport, setSelfReport] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getStudentSessionReport(studentId, sessionId);
      setReport(res);
      setLoading(false);

      const self = await getSelfReport(sessionId);
      setSelfReport(self);

      // EEG
      const eegData = await getEEGData(studentId, sessionId);
      setEeg(eegData);

      // 🔥 ADD PPG
      const ppgData = await getPPGAll(studentId, sessionId);
      setPpg(ppgData);
    } catch (error) {
      console.log('ERROR:', error);
    } finally {
      setGraphLoading(false);
    }
  };

  // ✅ MAIN LOADING
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />

        <Text style={styles.name}>
          {`- ${report?.student_name || 'Student'} -`}
        </Text>
      </View>

      {/* SUMMARY */}
      <View style={styles.card}>
        <Text style={styles.heading}>Overall Session Report</Text>

        {/* DATE */}
        <Text style={styles.subHeading}>Date</Text>
        <Text>{report?.date || '-'}</Text>

        {/* TOTAL TIME */}
        <Text style={styles.subHeading}>Complete Session Time</Text>
        <Text>{report?.total_minutes || '-'} mins</Text>

        {/* STRESS INDEX */}
        <Text style={styles.subHeading}>Average Stress Index</Text>
        <Text>
          {typeof report?.SI === 'number' ? report.SI.toFixed(3) : '-'}
        </Text>

        {/* FINAL STRESS */}
        <Text style={styles.subHeading}>Predicted Stress Level</Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Final Stress Level: </Text>
          {report?.final_stress_level == 0
            ? 'Low'
            : report?.final_stress_level == 1
            ? 'Medium'
            : report?.final_stress_level == 2
            ? 'High'
            : '-'}
        </Text>

        {/* BLOOD PRESSURE */}
        <Text style={styles.subHeading}>Average Blood Pressure</Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Start Question (BP): </Text>
          {report?.average_bpb || '-'}
        </Text>

        <Text>
          <Text style={{ fontWeight: 'bold' }}>End Question (BP): </Text>
          {report?.average_bpa || '-'}
        </Text>

        {/* HRV */}
        <Text style={styles.subHeading}>
          Average Heart Rate Variability (PPG)
        </Text>

        <Text>
          <Text style={{ fontWeight: 'bold' }}>HR: </Text>
          {report?.HR != null ? Math.round(report.HR) + ' bpm' : '-'}
        </Text>

        <Text>
          <Text style={{ fontWeight: 'bold' }}>RMSSD: </Text>
          {report?.RMSSD != null ? Math.round(report.RMSSD) + ' ms' : '-'}
        </Text>

        <Text>
          <Text style={{ fontWeight: 'bold' }}>SDNN: </Text>
          {report?.SDNN != null ? Math.round(report.SDNN) + ' ms' : '-'}
        </Text>

        <Text>
          <Text style={{ fontWeight: 'bold' }}>pNN50: </Text>
          {report?.pNN50 != null ? Math.round(report.pNN50) + ' %' : '-'}
        </Text>

        {/* NOTE */}
        <Text style={styles.note}>
          Higher heart rate and lower RMSSD/SDNN indicate increased stress,
          while higher values suggest relaxation.
        </Text>
      </View>

      {/* GRAPH */}
      <View style={styles.card}>
        <Text style={styles.heading}>Physiological Signals During Session</Text>
        {graphLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : eeg?.alpha?.length > 0 ? (
          (() => {
            const screenWidth = Dimensions.get('window').width;

            const clean = arr =>
              arr.map(v => (isNaN(v) || v === null ? 0 : Number(v)));

            const time = eeg.time || [];
            const alpha = eeg.alpha || [];
            const beta = eeg.beta || [];
            const theta = eeg.theta || [];
            const gamma = eeg.gamma || [];
             const delta = eeg.delta || [];
            const hr = ppg?.HR || [];

            // ✅ FIX LENGTH
            const minLength = Math.min(
              time.length,
              alpha.length,
              beta.length,
              theta.length,
              gamma.length,
              delta.length,

            );

            const safeTime = time.slice(0, minLength);
            const safeAlpha = clean(alpha.slice(0, minLength));
            const safeBeta = clean(beta.slice(0, minLength));
            const safeTheta = clean(theta.slice(0, minLength));
            const safeGamma = clean(gamma.slice(0, minLength));
            const safeDelta = clean(delta.slice(0, minLength));
            const safeHR = clean(hr.slice(0, minLength));

            // ✅ REDUCE FUNCTION
            const reduce = arr => {
              const step = Math.ceil(arr.length / 50);
              return arr.filter((_, i) => i % step === 0);
            };

            const finalTime = reduce(safeTime);
            const finalAlpha = reduce(safeAlpha);
            const finalBeta = reduce(safeBeta);
            const finalTheta = reduce(safeTheta);
            const finalGamma = reduce(safeGamma);
            const finalDelta = reduce(safeDelta);
            const finalHR = reduce(safeHR);

            const step = Math.ceil(finalTime.length / 8);

            const labels = finalTime.map((t, i) =>
              i % step === 0 ? `${Math.round(t)}s` : '',
            );

            return (
              <LineChart
                data={{
                  labels: labels,
                  datasets: [
                    { data: finalAlpha, color: () => '#3CBAC8' },
                    { data: finalBeta, color: () => '#FF6B6B' },
                    { data: finalTheta, color: () => '#FFD93D' },
                    { data: finalGamma, color: () => '#6BCB77' },
                    { data: finalDelta, color: () => '#4D96FF' },
                  ],
                  legend: ['Alpha', 'Beta', 'Theta', 'Gamma', 'Delta'],
                }}
                width={screenWidth - 40}
                height={260}
                withDots={false}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 2,
                  color: () => '#000',
                  labelColor: () => '#000',
                  propsForBackgroundLines: {
                    stroke: '#ccc',
                    strokeDasharray: '5,5',
                  },
                }}
                bezier={false}
                style={{ borderRadius: 10, marginTop: 10, marginLeft: -15 }}
              />
            );
          })()
        ) : (
          <Text style={styles.noData}>No Graph Data</Text>
        )}
    {/* PPG GRAPH */}
        <View style={styles.card}>
          <Text style={[styles.heading, { marginLeft: -20 }]}>PPG Graph (Heart Features)</Text>

          {ppg?.HR?.length > 0 ? (
            (() => {
              const screenWidth = Dimensions.get('window').width;

              const clean = arr =>
                arr.map(v => (isNaN(v) || v === null ? 0 : Number(v)));

              const time = ppg.time || [];
              const hr = ppg.HR || [];
              const sdnn = ppg.SDNN || [];
              const rmssd = ppg.RMSSD || [];
              const pnn50 = ppg.pNN50 || [];

              const minLength = Math.min(
                time.length,
                hr.length,
                sdnn.length,
                rmssd.length,
                pnn50.length,
              );

              const safeTime = time.slice(0, minLength);
              const safeHR = clean(hr.slice(0, minLength));
              const safeSDNN = clean(sdnn.slice(0, minLength));
              const safeRMSSD = clean(rmssd.slice(0, minLength));
              const safePNN50 = clean(pnn50.slice(0, minLength));

              // reduce for performance
              const reduce = arr => {
                const step = Math.ceil(arr.length / 50);
                return arr.filter((_, i) => i % step === 0);
              };

              const finalTime = reduce(safeTime);
              const finalHR = reduce(safeHR);
              const finalSDNN = reduce(safeSDNN);
              const finalRMSSD = reduce(safeRMSSD);
              const finalPNN50 = reduce(safePNN50);

              const step = Math.ceil(finalTime.length / 8);

              const labels = finalTime.map((t, i) =>
                i % step === 0 ? `${Math.round(t)}s` : '',
              );

              return (
                <LineChart
                  data={{
                    labels: labels,
                    datasets: [
                      { data: finalHR, color: () => '#ff0000' }, // HR
                      { data: finalSDNN, color: () => '#00bcd4' }, // SDNN
                      { data: finalRMSSD, color: () => '#4caf50' }, // RMSSD
                      { data: finalPNN50, color: () => '#9c27b0' }, // pNN50
                    ],
                    legend: ['HR', 'SDNN', 'RMSSD', 'pNN50'],
                  }}
                  width={screenWidth - 40}
                  height={260}
                  withDots={false}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 2,
                    color: () => '#000',
                    labelColor: () => '#000',
                    propsForBackgroundLines: {
                      stroke: '#ccc',
                      strokeDasharray: '5,5',
                    },
                  }}
                  bezier={false}
                  style={{ borderRadius: 10, marginTop: 10,  marginLeft: -50  }}
                />
              );
            })()
          ) : (
            <Text style={styles.noData}>No PPG Graph Data</Text>
          )}
        </View>


        <Text style={{ marginTop: 10 }}>EEG Band Power Summary:</Text>
        <Text>Alpha → Relaxation</Text>
        <Text>Beta → Focus / Stress</Text>
        <Text>Theta → Mental Workload</Text>
        <Text>Delta → Deep Sleep</Text>
      </View>

      {/* Self Report */}
      <View style={styles.card}>
        <Text style={styles.heading}>Self Report (User Feedback)</Text>

        {selfReport ? (
          <>
            <Text>Mental Load: {selfReport.mentalLoad}</Text>
            <Text>Frustration: {selfReport.frustration}</Text>
            <Text>Effort: {selfReport.effort}</Text>

            <Text style={styles.subHeading}>Comment</Text>
            <Text>{selfReport.comment || 'No comment'}</Text>
          </>
        ) : (
          <Text style={styles.noData}>No Self Report Data</Text>
        )}
      </View>

      {/* QUESTIONS */}
      <View style={styles.reportSection}>
        <Text style={styles.reportTitle}>Reports of Each Question</Text>

        {report?.attempted_questions?.length > 0 ? (
          report.attempted_questions.map((item, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionText}>{item.description}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('StudentQuestionReport', {
                    sid: studentId,
                    sessionId: sessionId,
                    qid: item.qid,
                  })
                }
              >
                <Text style={styles.buttonText}>Report</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No Data Exist</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48D1E4',
  },

  header: {
    marginTop: 20,
    alignItems: 'center',
  },

  backBtn: {
    position: 'absolute',
    left: 15,
    top: 18,
  },

  back: {
    color: '#fff',
    fontSize: 16,
  },

  logo: {
    width: 55,
    height: 80,
    marginBottom: 20,
  },

  name: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: -5,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#48D1E4',
  },

  subHeading: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#48D1E4',
  },

  reportSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
    marginTop: 20,
  },

  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  questionCard: {
    backgroundColor: '#48D1E4',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 15,
  },

  questionText: {
    color: '#fff',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'center',
    width: 100,
    alignItems: 'center',
  },

  buttonText: {
    color: '#48D1E4',
    fontWeight: 'bold',
  },

  noData: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: 'gray',
  },
});
