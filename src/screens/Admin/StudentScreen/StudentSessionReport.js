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

import { getStudentSessionReport } from '../../../api/reportApi';

export default function StudentSessionReport({ navigation, route }) {

  const { sessionId, studentId } = route.params;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getStudentSessionReport(studentId, sessionId);
    setReport(res);
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />

        <Text style={styles.name}>
          { `- ${report?.student_name} -` || "Student"}
        </Text>
      </View>

      {/* SUMMARY CARD */}
      <View style={styles.card}>
        <Text style={styles.heading}>Overall Stress & Performance Summary</Text>

        <Text>Final Stress Level: <Text style={styles.bold}>{report?.final_stress_level || "-"}</Text></Text>
        <Text>Date: {report?.date || "-"}</Text>
        <Text>Time: {report?.total_minutes || "-"} mins</Text>

        <Text style={styles.subHeading}>Blood Pressure (BP)</Text>
        <Text>{report?.average_bp || "-"}</Text>

        <Text style={styles.subHeading}>Heart Rate Variability</Text>
        <Text>HR: {report?.HR || "-"} BPM</Text>
        <Text>RMSSD: {report?.RMSSD || "-"}</Text>
        <Text>SDNN: {report?.SDNN || "-"}</Text>
      </View>

      {/* QUESTIONS SECTION */}
      <View style={styles.reportSection}>
        <Text style={styles.reportTitle}>Reports of Each Question</Text>

        {report?.attempted_questions?.length > 0 ? (
          report.attempted_questions.map((item, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionText}>{item.description}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("StudentQuestionReport", {
                    sid: studentId,
                    sessionId: sessionId,
                    qid: item.qid
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
    backgroundColor: '#3CBAC8'
  },

  header: {
    marginTop: 20,
    alignItems: 'center'
  },

  backBtn: {
    position: 'absolute',
    left: 15,
    top: 18
  },

  back: {
    color: '#fff',
    fontSize: 18
  },

  logo: {
    width: 55,
    height: 80,
    marginBottom: 20
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
    borderRadius: 15
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

  bold: {
    fontWeight: 'bold'
  },

  /* ✅ WHITE SECTION */
  reportSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 30
  },

  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },

  questionCard: {
    backgroundColor: '#5ED0DB',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15
  },

  questionText: {
    color: '#fff',
    marginBottom: 10
  },

  button: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'center',
    width: 100,
    alignItems: 'center'
  },

  buttonText: {
    color: '#3CBAC8',
    fontWeight: 'bold'
  },

  /* ✅ NO DATA */
  noData: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 10
  }

});