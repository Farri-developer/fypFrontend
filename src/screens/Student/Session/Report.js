import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { CommonActions } from '@react-navigation/native';

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

import { getStudentSessionReport, getEEGData } from '../../../api/reportApi';

export default function Report({ navigation, route }) {
  const { sessionId, studentId } = route.params;

  const [report, setReport] = useState(null);
  const [eeg, setEeg] = useState(null);

  const [loading, setLoading] = useState(true); // main data
  const [graphLoading, setGraphLoading] = useState(true); // graph

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ✅ STEP 1: FAST LOAD
      const res = await getStudentSessionReport(studentId, sessionId);
      setReport(res);
      setLoading(false); // screen show

      // ✅ STEP 2: GRAPH LOAD (slow)
      const eegData = await getEEGData(studentId, sessionId);
      setEeg(eegData);
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
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'StudentTabs',
                    params: { sid: studentId },
                  },
                ],
              }),
            )
          }
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
        <Text style={styles.heading}>Overall Stress & Performance Summary</Text>

        <Text>Final Stress Level: {report?.final_stress_level || '-'}</Text>
        <Text>Date: {report?.date || '-'}</Text>
        <Text>Time: {report?.total_minutes || '-'} mins</Text>

        <Text style={styles.subHeading}>Blood Pressure (BP)</Text>
        <Text>{report?.average_bp || '-'}</Text>

        <Text style={styles.subHeading}>Heart Rate Variability</Text>
        <Text>HR: {report?.HR || '-'}</Text>
        <Text>RMSSD: {report?.RMSSD || '-'}</Text>
        <Text>SDNN: {report?.SDNN || '-'}</Text>

        <Text>pNN50: {report?.pNN50 || '-'}</Text>

        <Text style={styles.note}>
          Higher RMSSD and SDNN indicate better relaxation.
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
      
                  const minLength = Math.min(
                    time.length,
                    alpha.length,
                    beta.length,
                    theta.length,
                    gamma.length,
                  );
      
                  const safeTime = time.slice(0, minLength);
                  const safeAlpha = clean(alpha.slice(0, minLength));
                  const safeBeta = clean(beta.slice(0, minLength));
                  const safeTheta = clean(theta.slice(0, minLength));
                  const safeGamma = clean(gamma.slice(0, minLength));
      
                  // 🔥 Reduce data (important for fitting screen)
                  const reduce = (arr, step = 5) =>
                    arr.filter((_, i) => i % step === 0);
      
                  const finalTime = reduce(safeTime);
                  const finalAlpha = reduce(safeAlpha);
                  const finalBeta = reduce(safeBeta);
                  const finalTheta = reduce(safeTheta);
                  const finalGamma = reduce(safeGamma);
      
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
                        ],
                        legend: ['Alpha', 'Beta', 'Theta', 'Gamma'],
                      }}
                      width={screenWidth - 40} // ✅ FULL WIDTH (NO SCROLL)
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
                      bezier={false} // ✅ stable graph
                        style={{ borderRadius: 10, marginTop: 10 ,marginLeft:-15 }}
                    />
                  );
                })()
              ) : (
                <Text style={styles.noData}>No Graph Data</Text>
              )}
      
              <Text style={{ marginTop: 10 }}>EEG Band Power Summary:</Text>
              <Text>Alpha → Relaxation</Text>
              <Text>Beta → Focus / Stress</Text>
              <Text>Theta → Mental Workload</Text>
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
  },

  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 15,
  },

  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subHeading: {
    marginTop: 10,
    fontWeight: 'bold',
  },

  reportSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
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
    color: 'gray'
  }
});
