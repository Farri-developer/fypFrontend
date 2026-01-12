import React from 'react';
import { View, Text, StyleSheet ,Button} from 'react-native';

export default function AdminScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome Admin 👑</Text>
      <Button title="logout" onPress={() => navigation.navigate('Student')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
