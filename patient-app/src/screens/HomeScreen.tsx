import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Modal } from 'react-native';
import { Sparkles, Bone, Heart, Activity, Droplet, Dna, Users, Thermometer, TestTube, Stethoscope } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [popularTests, setPopularTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const getCategoryIcon = (name: string, size = 28) => {
    const lower = name.toLowerCase();
    
    // Colorful exact/partial matches based on actual data
    if (lower.includes('full body')) return <Activity size={size} color="#10b981" />; // Emerald
    if (lower.includes('senior')) return <Users size={size} color="#8b5cf6" />; // Violet
    if (lower.includes('diabet')) return <Droplet size={size} color="#ef4444" />; // Red
    if (lower.includes('anc') || lower.includes('pregnancy')) return <Heart size={size} color="#ec4899" />; // Pink
    if (lower.includes('arthritis') || lower.includes('bone')) return <Bone size={size} color="#f97316" />; // Orange
    
    // Old matches
    if (lower.includes('skin') || lower.includes('women')) return <Sparkles size={size} color="#ec4899" />;
    if (lower.includes('heart') || lower.includes('cardiac') || lower.includes('lipid')) return <Heart size={size} color="#ef4444" />;
    if (lower.includes('thyroid')) return <Activity size={size} color="#8b5cf6" />;
    if (lower.includes('tumor') || lower.includes('cancer')) return <Dna size={size} color="#6366f1" />;
    if (lower.includes('premarital') || lower.includes('couple')) return <Users size={size} color="#f43f5e" />;
    if (lower.includes('fever') || lower.includes('infection')) return <Thermometer size={size} color="#f59e0b" />;
    if (lower.includes('liver') || lower.includes('hepatic')) return <Activity size={size} color="#eab308" />;
    if (lower.includes('kidney') || lower.includes('renal')) return <Activity size={size} color="#3b82f6" />;
    if (lower.includes('thalassemia') || lower.includes('apla')) return <TestTube size={size} color="#14b8a6" />;
    
    return <Stethoscope size={size} color="#272a56" />; // Default brand blue
  };

  useEffect(() => {
    fetch('https://pathology-backend-ipnf.onrender.com/api/catalog/tests')
      .then(res => res.json())
      .then(data => {
        // Derive unique categories
        const catMap: Record<string, number> = {};
        data.forEach((t: any) => {
          catMap[t.category] = (catMap[t.category] || 0) + 1;
        });
        
        const catArray = Object.keys(catMap).map((k, i) => ({
          id: i.toString(),
          name: k,
          icon: getCategoryIcon(k), 
          count: catMap[k]
        }));
        
        setCategories(catArray.slice(0, 5)); // Show top 5 categories
        setPopularTests(data.slice(0, 4)); // Show top 4 packages
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching home data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#272a56" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/nidan-logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.greeting}>Dr. Shirke's Pathology Lab</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => setMenuVisible(true)}>
          <Text style={styles.profileInitials}>J</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuBox}>
            <Text style={styles.menuName}>John Doe</Text>
            <Text style={styles.menuPhone}>+91 9876543210</Text>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Records'); }}>
              <Text style={styles.menuItemText}>View Past History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Profile'); }}>
              <Text style={styles.menuItemText}>Manage Family Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Login'); }}>
              <Text style={[styles.menuItemText, { color: '#f0222c' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.searchBox}>
        <Text style={styles.searchPlaceholder}>🔍 Search for tests, packages...</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Packages')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Packages', { category: cat.name })}
            >
              <View style={styles.categoryIconContainer}>
                {cat.icon}
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count} Tests</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Tests & Packages</Text>
        
        {popularTests.map(test => (
          <View key={test.id} style={styles.testCard}>
            <View style={styles.testHeader}>
              <Text style={styles.testName}>{test.name}</Text>
            </View>
            
            <View style={styles.testDetails}>
              <Text style={styles.testDetailTag}>📊 {test.type}</Text>
            </View>
            
            <View style={styles.testFooter}>
              <View>
                <Text style={styles.testPrice}>₹{test.price}</Text>
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
  headerLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 45,
    marginBottom: 8,
    marginLeft: -10, // Adjust for image padding
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: '#63ad30',
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
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#272a56',
    fontWeight: '700',
    fontSize: 18,
  },
  searchBox: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: -20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#272a56',
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
    color: '#272a56',
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
    shadowColor: '#272a56',
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
    shadowColor: '#272a56',
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
    backgroundColor: '#272a56',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuBox: {
    backgroundColor: '#fff',
    marginTop: 80,
    marginRight: 20,
    padding: 16,
    borderRadius: 12,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  menuPhone: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 8,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  }
});
