import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

import { getTopSessions } from '../../api/reportApi'; // adjust path

export default function HomeScreen({ navigation, route }) {

  const { sid, name, semester } = route.params;
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getTopSessions(sid);
    setSessions(data);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logout}>‹ Logout</Text>
        </TouchableOpacity>

        <Image
          source={require('../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.hello}>Hello {name}!</Text>
      <Text style={styles.semester}>Semester {semester}</Text>

      {/* CARD */}
      <View style={styles.dashboard}>

        <Text style={styles.heading}>Student Dashboard</Text>

        {/* BUTTON */}
        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startText}>▶ Start New Test</Text>
        </TouchableOpacity>

        {/* SUMMARY HEADER */}
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryText}>Last Test Summary</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>see all ›</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {sessions.map((item, index) => (
            <View key={index} style={styles.card}>

              {/* TOP */}
              <View style={styles.rowBetween}>
                <Text style={styles.date}>
                  Date: {item.date || 'N/A'}
                </Text>

                {/* 3 DOT */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('StudentSessionReport', {

                      sessionId: item.sessionId,
                      studentId: sid
                    })
                  }
                >
                  <Image
                    source={require('../../../assets/icons/three-dot-menu.png')}
                    style={styles.dot}
                    
                  />
                </TouchableOpacity>
              </View>

              {/* DATA */}
              <View style={styles.row}>

                {/* BP */}
                <View style={styles.box}>
                  <Image
                    source={require('../../../assets/icons/Cuff Icon.jpg')}
                    style={styles.icon}
                  />
                  <Text style={styles.value}>
                    {item.afterQuestionBP || '--'}
                  </Text>
                  <Text style={styles.label}>mmHg</Text>
                </View>

                {/* HEART */}
                <View style={styles.box}>
                  <Image
                    source={require('../../../assets/icons/Heart Icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.value}>
                    {item.heartRate || '--'}
                  </Text>
                  <Text style={styles.label}>BPM</Text>
                </View>

                {/* HRV */}
                <View style={styles.box}>
                  <Image
                    source={require('../../../assets/icons/heart.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.value}>
                    {item.sdnn || '--'}
                  </Text>
                  <Text style={styles.label}>ms</Text>
                </View>

              </View>

              <Text style={styles.stress}>
                Overall Stress Level: {item.stressLevel || 'Unknown'}
              </Text>

            </View>
          ))}
        </ScrollView>

      </View>


    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
    padding: 15
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  logout: {
    color: '#fff',
    fontSize: 16
  },

  logo: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
    marginRight: 130
  },

  hello: {
    fontSize: 22,
    color: '#fff',
    marginTop: 20
  },

  semester: {
    color: '#fff',
    marginBottom: 15
  },

  dashboard: {
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 15,
    flex: 1
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#48D1E4'
  },

  startBtn: {
    backgroundColor: '#48D1E4',
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
    alignItems: 'center'
  },

  startText: {
    color: '#fff',
    fontSize: 16
  },

  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  summaryText: {
    color: '#48D1E4'
  },

  seeAll: {
    color: '#48D1E4'
  },

  card: {
    backgroundColor: '#cfe8eb',
    padding: 15,
    borderRadius: 15,
    marginTop: 10
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  box: {
    backgroundColor: '#48D1E4',
    width: '30%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center'
  },

  icon: {
    width: 20,
    height: 20,
    marginBottom: 5
  },

  value: {
    color: '#fff',
    fontWeight: 'bold'
  },

  label: {
    color: '#fff',
    fontSize: 10
  },

  stress: {
    marginTop: 10,
    textAlign: 'center',
    color: '#333'
  },

  dot: {
    width: 20,
    height: 20
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 20,
    marginTop: 10
  }

});