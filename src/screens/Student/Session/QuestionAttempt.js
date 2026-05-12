import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Switch,
  Modal,
} from 'react-native';

import { stopRecording, resetAll, midQuestionBP } from '../../../api/sessionApi';
import { deleteSession } from '../../../api/reportApi';

export default function QuestionAttempt({ route, navigation }) {
  const params = route?.params || {};
  const sessionid = params.sessionid || null;
  const currentQuestion = params.questions[0] || null;
  const remainingQuestions = params.questions.slice(1) || [];
  const sid = params.sid || null;

  const totalSeconds = (currentQuestion?.duration || 1) * 60;

  const [seconds, setSeconds] = useState(totalSeconds);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatgptEnabled, setChatgptEnabled] = useState(false);

  // =====================
  // MID BP POPUP STATE
  // =====================
  const [showMidPopup, setShowMidPopup] = useState(false);
  const [midBpLoading, setMidBpLoading] = useState(false);
  const [midBpError, setMidBpError] = useState(false);   // ✅ error state
  const midPopupShown = useRef(false);

  const hasNavigated = useRef(false);

  // =====================
  // TIMER
  // =====================
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds(prev => {
        const newVal = prev - 1;

        // 1 minute baad popup dikhao - sirf ek baar
        const midPoint = totalSeconds - 300;
        if (newVal === midPoint && !midPopupShown.current) {
          midPopupShown.current = true;
          setShowMidPopup(true);
        }

        // Timer khatam - next screen
        if (newVal === 0 && !hasNavigated.current) {
          hasNavigated.current = true;
          setTimeout(() => handleNext(), 0);
        }

        return newVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // =====================
  // MID BP OK BUTTON
  // =====================
  const handleMidBpOk = async () => {
    setMidBpLoading(true);
    setMidBpError(false); // ✅ pehle error clear karo

    try {
      const result = await midQuestionBP();

      // ✅ SIRF is condition pe popup band hoga
      if (result?.status === 'mid question BP saved') {
        setShowMidPopup(false);
        console.log('✅ Mid BP saved successfully');
      } else {
        // Unexpected response - popup khula raho
        console.log('⚠️ Unexpected response:', result);
        setMidBpError(true);
      }
    } catch (error) {
      // Network error / device disconnect - popup khula raho
      console.log('❌ Mid BP Error:', error);
      setMidBpError(true);
    } finally {
      setMidBpLoading(false); // loading band karo (chahe success ho ya error)
    }
  };

  // =====================
  // SUBMIT / NEXT
  // =====================
  const handleNext = async () => {
    if (loading || hasNavigated.current) return;
    hasNavigated.current = true;

    try {
      setLoading(true);

      const data = await stopRecording(answer, chatgptEnabled);

      if (!data) {
        alert('Recording stop failed');
        hasNavigated.current = false;
        return;
      }

      navigation.replace('Endbp', {
        sid: sid,
        questions: remainingQuestions,
        sessionid: sessionid,
      });
    } catch (error) {
      console.log(error);
      hasNavigated.current = false;
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // BACK
  // =====================
  const handleBack = async () => {
    try {
      if (sessionid) {
        await deleteSession(sessionid);
        console.log('🗑 Session Deleted');
      }
      await resetAll();

      navigation.reset({
        index: 0,
        routes: [{ name: 'StudentTabs', params: { sid: sid } }],
      });
    } catch (error) {
      console.log('BACK ERROR:', error);
    }
  };

  // =====================
  // RENDER
  // =====================
  return (
    <View style={styles.container}>

      {/* ========================
          MID BP POPUP
      ======================== */}
      <Modal
        visible={showMidPopup}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            {/* Icon */}
            <Text style={styles.modalIcon}>🩺</Text>

            {/* Title */}
            <Text style={styles.modalTitle}>Blood Pressure Check</Text>

            {/* Message */}
            <Text style={styles.modalMessage}>
              Please turn ON your BP device and press OK when ready.
            </Text>

            {/* ✅ Error message - sirf tab dikhao jab error ho */}
            {midBpError && (
              <Text style={styles.modalErrorText}>
                ⚠️ Device disconnected or failed. Please reconnect and try again.
              </Text>
            )}

            {/* OK / Retry Button */}
            <TouchableOpacity
              style={[styles.modalBtn, midBpLoading && styles.modalBtnDisabled]}
              onPress={handleMidBpOk}
              disabled={midBpLoading}
            >
              {midBpLoading ? (
                <View style={styles.modalBtnRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.modalBtnText}>  Reading BP...</Text>
                </View>
              ) : (
                <Text style={styles.modalBtnText}>
                  {midBpError ? '🔄 Retry' : "OK - I'm Ready"}
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

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

      {/* CARD */}
      <View style={styles.card}>
        <View style={styles.topBox}>
          <Text style={styles.qTitle}>Question Attempt</Text>
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>⏱ {formatTime()}</Text>
          </View>
        </View>

        <Text style={styles.label}>Question Statement:</Text>
        <Text style={styles.question}>
          {currentQuestion?.description || 'No Question'}
        </Text>

        <View style={styles.gptRow}>
          <Text style={styles.gptText}>ChatGPT</Text>
          <Switch value={chatgptEnabled} onValueChange={setChatgptEnabled} />
        </View>

        <Text style={styles.inputLabel}>Write Your Code Below</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your program..."
          placeholderTextColor="#999"
          multiline
          value={answer}
          onChangeText={setAnswer}
        />

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextText}>Submit</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>Auto move when time ends</Text>
      </View>
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
    marginLeft: '17%',
  },

  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 25,
    padding: 20,
  },

  topBox: {
    backgroundColor: '#48D1E4',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },

  qTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },

  timerBox: {
    marginTop: 8,
    backgroundColor: '#dff6f9',
    padding: 6,
    borderRadius: 10,
  },

  timerText: {
    fontSize: 12,
  },

  label: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#48D1E4',
  },

  question: {
    marginTop: 5,
    fontSize: 13,
  },

  gptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  gptText: {
    color: '#48D1E4',
    fontWeight: 'bold',
  },

  inputLabel: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#48D1E4',
  },

  input: {
    marginTop: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    height: 120,
    textAlignVertical: 'top',
  },

  nextBtn: {
    marginTop: 20,
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  nextText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  footer: {
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
    color: 'gray',
  },

  // ========================
  // MODAL STYLES
  // ========================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },

  modalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#48D1E4',
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  // ✅ Error message style
  modalErrorText: {
    fontSize: 12,
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 18,
    paddingHorizontal: 10,
  },

  modalBtn: {
    backgroundColor: '#48D1E4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },

  modalBtnDisabled: {
    backgroundColor: '#90dce8',
  },

  modalBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
