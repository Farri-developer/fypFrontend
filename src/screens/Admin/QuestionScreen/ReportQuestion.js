import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from "react-native";

import { getQuestionReport } from "../../../api/reportApi"; // API import

export default function ReportQuestion({ navigation, route }) {

  // Get question object from navigation params
  const { question } = route.params || {};
  const qid = question?.qid;

  // State for report data
  const [report, setReport] = useState(null);

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // Fetch report when screen loads
  useEffect(() => {
    fetchReport();
  }, []);

  // API call function
  const fetchReport = async () => {
    try {
      const data = await getQuestionReport(qid);
      setReport(data);
    } catch (error) {
      console.log("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loader while API data is loading
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#48D1E4" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Header Section */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        {/* Logo */}
        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />

      </View>

      {/* Screen Title */}
      <Text style={styles.title}>Question Report</Text>

      {/* Total Attempts */}
      <Text style={styles.attempts}>
        {`Total Student Attempts - ${report?.total_attempts ?? "No data"}`}
      </Text>

      {/* Question Duration */}
      <Text style={styles.attempts}>
        {report?.duration ? `${report.duration}:00 minutes` : "No data"}
      </Text>

      {/* Question Description */}
      <View style={styles.card}>
        <Text style={styles.questionTitle}>Question Statement</Text>
        <Text style={styles.questionText}>
          {report?.description ?? "No description"}
        </Text>
      </View>

      {/* WITH GPT REPORT */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Overall Average Stress with ChatGPT
        </Text>

        <Text>
          {`Student Attempts - ${report?.with_gpt?.total_attempts ?? "No data"}`}
        </Text>

        <Text style={styles.bold}>
          {`Final Stress Level: ${report?.with_gpt?.most_common_stress_level ?? "No data"}`}
        </Text>

        <Text style={styles.bold}>Blood Pressure</Text>
        <Text>
          {
            report?.with_gpt?.avg_bp === "/" || !report?.with_gpt?.avg_bp
              ? "No data"
              : report?.with_gpt?.avg_bp
          }
        </Text>

        <Text style={styles.bold}>Heart Rate</Text>
        <Text>{`${report?.with_gpt?.avg_hr ?? "No data"} BPM`}</Text>

        <Text style={styles.bold}>SDNN</Text>
        <Text>{`${report?.with_gpt?.avg_sdnn ?? "No data"} ms`}</Text>

        <Text style={styles.bold}>RMSSD</Text>
        <Text>{`${report?.with_gpt?.avg_rmssd ?? "No data"} ms`}</Text>
      </View>

      {/* WITHOUT GPT REPORT */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Overall Average Stress without ChatGPT
        </Text>

        <Text>
          {`Student Attempts - ${report?.without_gpt?.total_attempts ?? "No data"}`}
        </Text>

        <Text style={styles.bold}>
          {`Final Stress Level: ${report?.without_gpt?.most_common_stress_level ?? "No data"}`}
        </Text>

        <Text style={styles.bold}>Blood Pressure</Text>
        <Text>
          {
            report?.without_gpt?.avg_bp === "/" || !report?.without_gpt?.avg_bp
              ? "No data"
              : report?.without_gpt?.avg_bp
          }
        </Text>

        <Text style={styles.bold}>Heart Rate</Text>
        <Text>{`${report?.without_gpt?.avg_hr ?? "No data"} BPM`}</Text>

        <Text style={styles.bold}>SDNN</Text>
        <Text>{`${report?.without_gpt?.avg_sdnn ?? "No data"} ms`}</Text>

        <Text style={styles.bold}>RMSSD</Text>
        <Text>{`${report?.without_gpt?.avg_rmssd ?? "No data"} ms`}</Text>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 40 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  // Back button style
  backButton: {
    alignSelf: 'flex-start',
    margin: 5,
    marginTop: 25
  },

  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },

  // Logo style
   logo: {
    height:75,
    width: 120,
    marginLeft: 52,
  },

  // Main container
  container: {
    flex: 1,
    backgroundColor: "#59C6D8",
    padding: 15
  },

  // Loader center alignment
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  // Screen title
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15
  },

  // Attempts text
  attempts: {
    textAlign: "center",
    color: "white"
  },

  // Card UI
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 15
  },

  questionTitle: {
    fontWeight: "bold",
    marginBottom: 5
  },

  questionText: {
    color: "#555"
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#48D1E4",
    marginBottom: 5
  },

  bold: {
    fontWeight: "bold",
    marginTop: 5
  }

});