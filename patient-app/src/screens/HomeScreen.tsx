import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';

const CATEGORIES = [
  { id: '1', name: 'Full Body Checkup', icon: '🩺', count: 12 },
  { id: '2', name: 'Diabetes', icon: '🩸', count: 8 },
  { id: '3', name: 'Thyroid', icon: '🦋', count: 4 },
  { id: '4', name: 'Fever', icon: '🤒', count: 6 },
];

const POPULAR_TESTS = [
  { id: 't1', name: 'Comprehensive Full Body Checkup', params: 84, price: 2999, originalPrice: 4500, time: '10-12 hrs fasting' },
  { id: 't2', name: 'Advanced Lipid Profile', params: 8, price: 799, originalPrice: 1200, time: '12 hrs fasting' },
  { id: 't3', name: 'Thyroid Profile Total (T3, T4, TSH)', params: 3, price: 499, originalPrice: 800, time: 'Non-fasting' },
];

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, John!</Text>
          <Text style={styles.location}>📍 Mumbai, Maharashtra</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileInitials}>J</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchPlaceholder}>🔍 Search for tests, packages...</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <View style={styles.categoryIconContainer}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count} Tests</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Tests & Packages</Text>
        
        {POPULAR_TESTS.map(test => (
          <View key={test.id} style={styles.testCard}>
            <View style={styles.testHeader}>
              <Text style={styles.testName}>{test.name}</Text>
            </View>
            
            <View style={styles.testDetails}>
              <Text style={styles.testDetailTag}>📊 {test.params} Parameters</Text>
              <Text style={styles.testDetailTag}>⏱ {test.time}</Text>
            </View>
            
            <View style={styles.testFooter}>
              <View>
                <Text style={styles.testPrice}>₹{test.price}</Text>
                <Text style={styles.testOriginalPrice}>₹{test.originalPrice}</Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('Booking', { testId: test.id, testName: test.name, price: test.price })}
              >
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60, // Safe area for iOS notch
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  location: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#0ea5e9',
    fontWeight: '700',
    fontSize: 18,
  },
  searchBox: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: -20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchPlaceholder: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  seeAll: {
    color: '#0ea5e9',
    fontWeight: '600',
    fontSize: 14,
  },
  categoriesList: {
    overflow: 'visible',
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    marginRight: 16,
    width: 130,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  testHeader: {
    marginBottom: 12,
  },
  testName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
  },
  testDetails: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  testDetailTag: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginRight: 12,
    overflow: 'hidden'
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  testPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  testOriginalPrice: {
    fontSize: 14,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    fontWeight: '500',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  }
});
