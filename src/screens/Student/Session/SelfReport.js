import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native';

import { submitSelfReport } from '../../../api/sessionApi';

export default function SelfReport({ route, navigation }) {

  const params = route?.params || {};
  const sid = params.sid || null;

  const [mentalLoad, setMentalLoad] = useState(5);
  const [frustration, setFrustration] = useState(5);
  const [effort, setEffort] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 SUBMIT FUNCTION
  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const data = await submitSelfReport(
        mentalLoad,
        frustration,
        effort,
        comment
      );

      if (!data) {
        alert("Failed to submit report");
        return;
      }

      // ✅ SESSION ID FROM API
      const sessionid = data.sessionid;

      console.log("SESSION ID:", sessionid);

      // ✅ NAVIGATE TO REPORT SCREEN
      navigation.replace("StudentSessionReport", {
        sessionId: sessionid,
        studentId: sid
        
      });

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔢 SCALE BUTTONS
  const renderScale = (value, setValue) => {
    return (
      <View style={styles.scaleRow}>
        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.scaleBtn,
              value === num && styles.activeBtn
            ]}
            onPress={() => setValue(num)}
          >
            <Text style={[
              styles.scaleText,
              value === num && { color: '#fff' }
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.back}>‹ Back</Text>

        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Self Assessment</Text>

      {/* CARD */}
      <View style={styles.card}>

        {/* Mental Load */}
        <Text style={styles.label}>Mental Load</Text>
        {renderScale(mentalLoad, setMentalLoad)}

        {/* Frustration */}
        <Text style={styles.label}>Frustration</Text>
        {renderScale(frustration, setFrustration)}

        {/* Effort */}
        <Text style={styles.label}>Effort</Text>
        {renderScale(effort, setEffort)}

        {/* Comment */}
        <Text style={styles.label}>Comment</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your feedback..."
          value={comment}
          onChangeText={setComment}
        />

        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>

      </View>

    </View>
  );
}const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
    paddingTop: 40
  },

  header: {
    alignItems: 'center'
  },

  back: {
    position: 'absolute',
    left: 15,
    color: 'white'
  },

  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain'
  },

  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  },

  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20
  },

  label: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#48D1E4'
  },

  scaleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },

  scaleBtn: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#eee',
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },

  activeBtn: {
    backgroundColor: '#48D1E4'
  },

  scaleText: {
    fontSize: 12
  },

  input: {
    marginTop: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10
  },

  submitBtn: {
    marginTop: 20,
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },

  submitText: {
    color: '#fff',
    fontWeight: 'bold'
  }

});