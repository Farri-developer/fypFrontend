import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReportQuestion({ navigation, route }) {
  // You can access the question passed from navigation
  const { question } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReportQuestion</Text>
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





