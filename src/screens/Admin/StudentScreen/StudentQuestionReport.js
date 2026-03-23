import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function StudentQuestionReport({ navigation, route }) {

  const { sid, sessionId, qid } = route.params;

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Question Report</Text>

      <Text style={styles.text}>Student ID: {sid}</Text>
      <Text style={styles.text}>Session ID: {sessionId}</Text>
      <Text style={styles.text}>Question ID: {qid}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },

  text: {
    fontSize: 18,
    marginBottom: 10
  },

  back: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 18
  }
});