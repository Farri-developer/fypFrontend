import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';

import { getAllSessions } from '../../api/reportApi'; // adjust path as needed

export default function ReportScreen({ navigation, route }) {

  const { sid, name, semester } = route.params;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getAllSessions(sid);
      setSessions(data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading Screen
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Image
          source={require('../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      
      {/* Sessions */}
      <View style={styles.mainCard}>
        <Text style={styles.heading}>Session History</Text>

        {sessions.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No Sessions Found
          </Text>
        ) : (
          sessions.map(item => (
            <View key={item.sessionId} style={styles.sessionCard}>

              {/* Date + Menu */}
              <View style={styles.dateRow}>
                <Text style={styles.date}>
                  Date: {item.date ?? 'No Date'}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('StudentSessionReport', {
                      sessionId: item.sessionId,
                      studentId: sid,
                    })
                  }
                >
                  <Image
                    source={require('../../../assets/icons/three-dot-menu.png')}
                    style={styles.menuIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Metrics */}
              <View style={styles.metricsRow}>

                {/* BP */}
                <View style={styles.metricBox}>
                  <Image
                    source={require('../../../assets/icons/Cuff Icon.jpg')}
                    style={styles.icon}
                  />
                  <Text style={styles.metricTitle}>BP</Text>
                  <Text style={styles.metricValue}>
                    {item.afterQuestionBP ?? '--'}
                  </Text>
                </View>

                {/* HR */}
                <View style={styles.metricBox}>
                  <Image
                    source={require('../../../assets/icons/Heart Icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.metricTitle}>HR</Text>
                  <Text style={styles.metricValue}>
                    {item.heartRate ?? '--'}
                  </Text>
                </View>

                {/* HRV */}
                <View style={styles.metricBox}>
                  <Image
                    source={require('../../../assets/icons/heart.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.metricTitle}>HRV</Text>
                  <Text style={styles.metricValue}>
                    {item.sdnn ?? '--'}
                  </Text>
                </View>
              </View>

              {/* Stress */}
              <Text style={styles.stress}>
                Stress Level: {item.stressLevel ?? 'Unknown'}
              </Text>

            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
    padding: 15,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    marginTop: 20,
  },

  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  logo: {
    height: 75,
    width: 120,
    marginLeft: 60,
  },

  studentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
  },

  info: {
    fontSize: 14,
    marginBottom: 4,
  },

  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48D1E4',
    marginBottom: 10,
  },

  sessionCard: {
    backgroundColor: '#CBEAF0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

 
  

  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  metricBox: {
    alignItems: 'center',
    backgroundColor: '#48D1E4',
    padding: 5,
    borderRadius: 10,
    width: '32%',
  },

  metricTitle: {
    color: '#fff',
    fontSize: 11,
  },

  metricValue: {
    color: '#fff',
    fontWeight: 'bold',
  },

  icon: {
    width: 30,
    height: 30,
  },

  menuIcon: {
    width: 25,
    height: 25,
  },

  stress: {
    textAlign: 'center',
    marginTop: 8,
  },
});