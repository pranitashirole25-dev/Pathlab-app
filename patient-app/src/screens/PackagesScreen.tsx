import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';

export default function PackagesScreen({ route, navigation }: any) {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const categoryFilter = route.params?.category;

  useEffect(() => {
    let url = 'https://pathology-backend-ipnf.onrender.com/api/catalog/tests';
    if (categoryFilter) {
      url += `?category=${encodeURIComponent(categoryFilter)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPackages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching packages:', err);
        setLoading(false);
      });
  }, [categoryFilter]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#272a56" />
      </View>
    );
  }

  const toggleCart = (item: any) => {
    const exists = cart.find(t => t.id === item.id);
    if (exists) {
      setCart(cart.filter(t => t.id !== item.id));
    } else {
      setCart([...cart, item]);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isAdded = cart.some(t => t.id === item.id);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.categoryBadge}>{item.category}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          Includes: {item.description}
        </Text>
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

  const filteredPackages = packages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search packages by name..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {categoryFilter && (
        <View style={styles.filterHeader}>
          <Text style={styles.filterText}>Showing packages for: {categoryFilter}</Text>
          <TouchableOpacity onPress={() => navigation.setParams({ category: null })}>
            <Text style={styles.clearFilter}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={filteredPackages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
        ListEmptyComponent={<Text style={styles.emptyText}>No packages found.</Text>}
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
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#bae6fd',
  },
  filterText: { color: '#0369a1', fontWeight: '600', fontSize: 14 },
  clearFilter: { color: '#0284c7', fontWeight: '700', fontSize: 14 },
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
    marginBottom: 8,
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
