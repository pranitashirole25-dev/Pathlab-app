import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PackagesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Packages Screen (Categories coming soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#64748b', fontSize: 16 }
});
