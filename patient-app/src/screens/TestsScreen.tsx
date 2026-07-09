import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useCart } from '../context/CartContext';

export default function TestsScreen({ navigation }: any) {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, toggleCart } = useCart();

  useEffect(() => {
    fetch('https://pathology-backend-ipnf.onrender.com/api/catalog/tests')
      .then(res => res.json())
      .then(data => {
        // Since we only loaded packages from the Excel, this might be empty
        // In the future, individual tests will have type === 'INDIVIDUAL'
        setTests(data.filter((t: any) => t.type === 'INDIVIDUAL'));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tests:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#272a56" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    const isAdded = cart.some(t => t.id === item.id);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.categoryBadge}>{item.category}</Text>
        </View>
        {item.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.price}>₹{item.price}</Text>
          <TouchableOpacity 
            style={[styles.addButton, isAdded && styles.addedButton]}
            onPress={() => toggleCart(item)}
          >
            <Text style={[styles.addButtonText, isAdded && styles.addedButtonText]}>
              {isAdded ? 'Remove' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredTests = tests.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search tests by name..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredTests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
        ListEmptyComponent={<Text style={styles.emptyText}>No individual tests available yet.</Text>}
      />
      {cart.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('Booking', { tests: cart })}
        >
          <Text style={styles.fabText}>Go to Cart ({cart.length} item{cart.length > 1 ? 's' : ''})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  searchContainer: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  searchInput: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#272a56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    color: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: '600',
    overflow: 'hidden',
  },
  description: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  addButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  addedButton: {
    backgroundColor: '#e2e8f0',
  },
  addedButtonText: {
    color: '#64748b',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#f0222c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#f0222c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
