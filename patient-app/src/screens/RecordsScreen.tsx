import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FileText, Download } from 'lucide-react-native';

export default function RecordsScreen() {
  // Mock history
  const history = [
    { id: '1', patient: 'Ravi Kumar', age: 65, test: 'Comprehensive Heart Panel', date: 'Oct 15, 2023', status: 'COMPLETED' },
    { id: '2', patient: 'Amit Kumar', age: 34, test: 'Lipid Profile', date: 'Sep 20, 2023', status: 'COMPLETED' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Past Records</Text>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.patientName}>{item.patient} (Age {item.age})</Text>
                <Text style={styles.testName}>{item.test}</Text>
              </View>
              <FileText color="#272a56" size={24} />
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.date}>{item.date}</Text>
              <TouchableOpacity style={styles.downloadBtn} onPress={() => alert('Downloading PDF...')}>
                <Download color="#fff" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.downloadText}>Download Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  testName: { fontSize: 14, color: '#64748b' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  date: { fontSize: 12, color: '#94a3b8' },
  downloadBtn: { backgroundColor: '#272a56', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  downloadText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
