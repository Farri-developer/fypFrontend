import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudentReport({ navigation, route }) {
  // You can access the student passed from navigation
  const { student } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editing Student</Text>
      {student && (
        <>
          <Text style={styles.code}>{student.code}</Text>
          <Text style={styles.text}>{student.text}</Text>
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



