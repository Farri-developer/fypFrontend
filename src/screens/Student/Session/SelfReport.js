import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';

import { deleteSession } from '../../../api/reportApi';
import {
  submitSelfReport,
  resetAll,
  predictSession,
} from '../../../api/sessionApi';

export default function SelfReport({ route, navigation }) {
  const params = route?.params || {};
  const sid = params.sid || null;

  const [mentalLoad, setMentalLoad] = useState(3);
  const [frustration, setFrustration] = useState(3);
  const [effort, setEffort] = useState(3);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  let sessionid = null;

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const data = await submitSelfReport(
        mentalLoad,
        frustration,
        effort,
        comment,
      );

      if (!data) {
        alert('Failed to submit report');
        return;
      }

      const sessionid = data.sessionid;
      console.log('🧾 Report Submitted, Session ID:', sessionid);

      // 🔥 STEP 1: CALL PREDICT API
      console.log('🧠 Calling Prediction before Report... after selfreport');
      const predictRes = await predictSession(sessionid);

      if (!predictRes) {
        alert('Prediction failed');
        return;
      }

      console.log('✅ Prediction Done:', predictRes);

      // 🔥 STEP 2: NAVIGATE AFTER SUCCESS
      navigation.replace('Report', {
        sessionId: sessionid,
        studentId: sid,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // 🔙 BACK
  const handleBack = async () => {
    try {
      console.log('⬅️ Back pressed - stopping stream');

      // 🗑 DELETE SESSION
      if (sessionid) {
        await deleteSession(sessionid);
        console.log('🗑 Session Deleted');
      }

      // ♻ RESET SYSTEM
      await resetAll();

      // 🔥 STACK RESET + NAVIGATE
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'StudentTabs',
            params: { sid: sid },
          },
        ],
      });
    } catch (error) {
      console.log('BACK ERROR:', error);
    }
  };

  // 🎯 SECTION UI
  const renderSection = (title, question, value, setValue) => {
    const emojis = ['😐', '🙂', '😐', '😕', '😡'];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}:</Text>

        <Text style={styles.question}>Question:</Text>
        <Text style={styles.questionText}>{question}</Text>

        <Text style={styles.helper}>Helper text:</Text>
        <Text style={styles.helperText}>
          Did the task require a lot of thinking, concentration or
          problem-solving?
        </Text>

        {/* EMOJI */}
        <View style={styles.emojiRow}>
          {emojis.map((emoji, index) => (
            <TouchableOpacity key={index} onPress={() => setValue(index + 1)}>
              <Text
                style={[
                  styles.emoji,
                  value === index + 1 && styles.activeEmoji,
                ]}
              >
                {emoji}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* COLOR BAR */}
        <View style={styles.colorBar}>
          <View style={[styles.bar, { backgroundColor: 'green' }]} />
          <View style={[styles.bar, { backgroundColor: '#9be79b' }]} />
          <View style={[styles.bar, { backgroundColor: 'yellow' }]} />
          <View style={[styles.bar, { backgroundColor: 'orange' }]} />
          <View style={[styles.bar, { backgroundColor: 'red' }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          <Text style={styles.heading}>
            Coding Workload & Stress Assessment
          </Text>

          <Text style={styles.subHeading}>
            Please rate your experience during this coding task. There are no
            right or wrong answers.
          </Text>

          {/* SECTIONS */}
          {renderSection(
            'Mental Demand',
            'How mentally demanding was this coding task?',
            mentalLoad,
            setMentalLoad,
          )}

          {renderSection(
            'Effort',
            'How much effort did you put into completing this task?',
            effort,
            setEffort,
          )}

          {renderSection(
            'Frustration',
            'How frustrated or stressed did you feel during the task?',
            frustration,
            setFrustration,
          )}

          {/* INPUT */}
          <TextInput
            style={styles.input}
            placeholder="Type your coding experience. Your response helps us understand your coding experience."
            placeholderTextColor="#999"
            // ✅ ADD THIS
            value={comment}
            onChangeText={setComment}
            multiline
          />

          {/* BUTTON */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
  },

  header: {
    flexDirection: 'row',
  },

  back: {
    margin: 20,
    color: 'white',
    fontSize: 16,
  },

  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginLeft: '65',
  },

  mainCard: {
    backgroundColor: '#dff6f8',
    margin: 15,
    borderRadius: 20,
    padding: 15,
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#48D1E4',
  },

  subHeading: {
    fontSize: 14,
    color: '#48D1E4',
    marginBottom: 10,
  },

  section: {
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    padding: 12,
    marginTop: 10,
  },

  sectionTitle: {
    color: '#48D1E4',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  question: {
    fontSize: 16,
    color: '#48D1E4',
    fontWeight: 'bold',
  },

  questionText: {
    fontSize: 15,
    marginBottom: 5,
  },

  helper: {
    fontSize: 14,
    color: '#48D1E4',
    fontWeight: 'bold',
  },

  helperText: {
    fontSize: 14,
    marginBottom: 10,
  },

  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  emoji: {
    fontSize: 18,
    opacity: 0.2,
  },

  activeEmoji: {
    opacity: 1,
  },

  colorBar: {
    flexDirection: 'row',
    marginTop: 5,
  },

  bar: {
    flex: 1,
    height: 5,
  },

  input: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    height: 110,
    textAlignVertical: 'top',
  },

  submitBtn: {
    marginTop: 15,
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
