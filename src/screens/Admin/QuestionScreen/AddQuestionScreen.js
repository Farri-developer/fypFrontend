import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddQuestion({ navigation, route }) {
  // You can access the question passed from navigation
  const { question } = route.params || {};

  // Screen name
  const screenName = "Add Question";

  return (
    <View style={styles.container}>
      {/* Show screen name */}
      <Text style={styles.screenName}>{screenName}</Text>

      <Text style={styles.title}>Editing Question</Text>

      {question && (
        <>
          <Text style={styles.code}>{question.code}</Text>
          <Text style={styles.text}>{question.text}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  screenName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#FF6347', // Tomato color for screen name
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#48D1E4',
  },
  code: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
  },
});
