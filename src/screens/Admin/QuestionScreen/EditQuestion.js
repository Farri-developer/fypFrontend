import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function AddQuestion({ navigation, route }) {
  const { question } = route.params || {};
  const [questionText, setQuestionText] = useState(question?.description || '');
  const [duration, setDuration] = useState(question?.duration?.toString() || '');

  const handleSave = () => {
    if (!questionText || !duration) {
      Alert.alert('Missing Fields', 'Please fill out both fields.');
      return;
    }

    console.log('Saved:', { questionText, duration });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerText}>Edit Question</Text>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Question Text</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your question"
          value={questionText}
          onChangeText={setQuestionText}
        />

        <Text style={styles.label}>Duration (seconds)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter duration"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
    padding: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerText: {
    marginTop: 80,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#006994',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: '#555',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
