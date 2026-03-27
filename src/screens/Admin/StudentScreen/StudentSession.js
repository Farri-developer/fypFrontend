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

import { getAllSessions } from '../../../api/reportApi';

export default function StudentSession({ navigation, route }) {
  const { student } = route.params || {};
  const studentId = student?.sid;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchSessions();
    }
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getAllSessions(studentId);
      setSessions(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.heading}>Session History:</Text>
        <Text style={styles.subHeading}>All Sessions</Text>

        {sessions.map(item => (
          <View key={item.sessionId} style={styles.sessionCard}>
            {/* DATE + 3 DOT MENU */}
            <View style={styles.dateRow}>
              <Text style={styles.date}>Date: {item.date ?? 'No Date'}</Text>
          
              <TouchableOpacity

              
                onPress={() =>
                  navigation.navigate('StudentSessionReport', {
                    sessionId: item.sessionId,
                    studentId: student?.sid,
                    
                    
                  })
                }
              >
                
                <Image
                  source={require('../../../../assets/icons/three-dot-menu.png')}
                  style={styles.menuIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.metricsRow}>
              {/* BP */}
              <View style={styles.metricBox}>
                <Image
                  source={require('../../../../assets/icons/Cuff Icon.jpg')}
                  style={styles.icon}
                />
                <Text style={styles.metricTitle}>Blood Pressure</Text>
                <Text style={styles.metricValue}>
                  {item.afterQuestionBP ?? '--'}
                </Text>
              </View>

              {/* HR */}
              <View style={styles.metricBox}>
                <Image
                  source={require('../../../../assets/icons/Heart Icon.png')}
                  style={styles.icon}
                />
                <Text style={styles.metricTitle}>Heart Rate</Text>
                <Text style={styles.metricValue}>
                  {item.heartRate ?? '--'} bpm
                </Text>
              </View>

              {/* HRV */}
              <View style={styles.metricBox}>
                <Image
                  source={require('../../../../assets/icons/heart.png')}
                  style={styles.icon}
                />
                <Text style={styles.metricTitle}>HRV</Text>
                <Text style={styles.metricValue}>{item.sdnn ?? '--'} ms</Text>
              </View>
            </View>

            <Text style={styles.stress}>
              Overall Stress Level: {item.stressLevel ?? 'Unknown'}
            </Text>
          </View>
        ))}
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

  // Back button style
  backButton: {
    alignSelf: 'flex-start',
    margin: 5,
    marginTop: 20,
  },

  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Logo style
  logo: {
    height: 75,
    width: 120,
    marginLeft: 52,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    marginBottom: 10,
  },

  back: {
    color: '#fff',
    fontSize: 16,
  },

  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48D1E4',
    marginLeft: 10,
    marginTop: 10,
  },

  subHeading: {
    color: '#777',
    marginBottom: 10,
    marginLeft: 10,
  },

  sessionCard: {
    backgroundColor: '#CBEAF0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  date: {
    fontWeight: 'bold',
    marginBottom: 8,
  },

  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  metricBox: {
    alignItems: 'center',
    backgroundColor: '#48D1E4',
    padding: 5,
    margin: 2,
    borderRadius: 10,
    width: '33%',
  },

  metricTitle: {
    color: '#fff',
    fontSize: 11,
  },

  metricValue: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 4,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 4,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuIcon: {
    width: 28,
    height: 25,
    marginRight: 8,
    marginBottom: 4,
  },

  stress: {
    textAlign: 'center',
    marginTop: 8 ,
    fontSize: 12,
  },
});
