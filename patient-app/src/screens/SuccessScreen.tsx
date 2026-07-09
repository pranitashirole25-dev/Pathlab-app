import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

export default function SuccessScreen({ route, navigation }: any) {
  const { amount, slot, itemsCount } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CheckCircle color="#63ad30" size={100} style={styles.icon} />
        
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your appointment has been booked.</Text>
        
        <View style={styles.detailsCard}>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Tests Booked: </Text>{itemsCount}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Time Slot: </Text>{slot}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Amount Paid: </Text>₹{amount}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate('MainApp', { screen: 'Home' })}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 40,
  },
  detailText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  homeBtn: {
    backgroundColor: '#272a56',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
