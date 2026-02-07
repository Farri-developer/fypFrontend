import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';

import { getQuestionById, updateQuestion } from '../../../api/questionApi';

export default function EditQuestion({ navigation, route }) {
  const { question } = route.params || {};
  const questionId = question?.qid;

  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const levels = ['Hard', 'Medium', 'Low'];

  // 🔹 Load question data
  useEffect(() => {
    if (!questionId) return;

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const data = await getQuestionById(questionId);

        setDescription(data.description || '');
        setDuration(String(data.duration || ''));
        setLevel(
          data.questionlevel
            ? data.questionlevel.charAt(0).toUpperCase() + data.questionlevel.slice(1)
            : ''
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  // 🔹 Update question
  const handleUpdate = async () => {
    if (!description.trim() || !duration || !level) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    if (isNaN(duration) || parseInt(duration) <= 0) {
      Alert.alert('Validation Error', 'Duration must be greater than 0 minutes');
      return;
    }

    const updatedData = {
      description: description.trim(),
      duration: parseInt(duration),
      questionlevel: level.toLowerCase(),
    };

    try {
      setLoading(true);
      await updateQuestion(questionId, updatedData);

      Alert.alert('Success', 'Question updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Update Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const LevelOption = ({ label }) => (
    <TouchableOpacity onPress={() => setLevel(label)} style={styles.levelOption}>
      <View style={[styles.radio, level === label && styles.radioSelected]} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <Image
          source={require('../../../../assets/icons/CodeMide.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Edit Coding Question</Text>

        <View style={styles.box}>
          {/* Description */}
          <Text style={styles.label}>Question Description :</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Write coding question here..."
            placeholderTextColor="black"
            multiline
            numberOfLines={6}
          />

          {/* Duration */}
          <Text style={styles.label}>Duration (Minutes) :</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="Enter duration in minutes"
            placeholderTextColor="black"
          />

          {/* Level */}
          <Text style={styles.label}>Question Level :</Text>
          <View style={styles.levelRow}>
            {levels.map((lvl) => (
              <LevelOption key={lvl} label={lvl} />
            ))}
          </View>

          {/* Update Button */}
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} disabled={loading}>
            <Text style={styles.updateText}>{loading ? 'Updating...' : 'Update Question'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#48D1E4' },

  backButton: { alignSelf: 'flex-start', margin: 15, marginTop: 25 },
  backText: { color: 'white', fontSize: 16, fontWeight: '600' },

  scrollContent: { paddingTop: 10, alignItems: 'center', paddingBottom: 30 },

  logo: { width: 150, height: 150, marginTop: 10 },

  title: {
    fontSize: 20,
    color: 'white',
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '700',
  },

  box: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
  },

  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },

  input: {
    borderWidth: 1,
    borderColor: '#D9FAFF',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#D9FAFF',
    color: 'black',
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  levelRow: { flexDirection: 'row', marginVertical: 5 },
  levelOption: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#48D1E4',
    marginRight: 5,
  },

  radioSelected: { backgroundColor: '#48D1E4' },

  updateBtn: {
    backgroundColor: '#48D1E4',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },

  updateText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
