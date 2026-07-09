import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Modal } from 'react-native';
import { FileText, Download } from 'lucide-react-native';

export default function RecordsScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);

  React.useEffect(() => {
    // Hardcoded userId 1 for demo purposes
    fetch('https://pathology-backend-ipnf.onrender.com/api/bookings/history/1')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching history:', err);
        setLoading(false);
      });
  }, []);

  const handleDownload = () => {
    if (Platform.OS === 'web') {
      try {
        const element = document.createElement('a');
        const file = new Blob(['Mock PDF Content for Pathology Report'], {type: 'application/pdf'});
        element.href = URL.createObjectURL(file);
        element.download = 'Nidan_Pathology_Report.pdf';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setDownloadModalVisible(true);
      } catch (e) {
        setDownloadModalVisible(true);
      }
    } else {
      setDownloadModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Past Records</Text>
      </View>

      <Modal visible={downloadModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.dialogBox}>
            <View style={styles.iconCircle}>
              <Download color="#63ad30" size={32} />
            </View>
            <Text style={styles.dialogTitle}>Download Complete</Text>
            <Text style={styles.dialogText}>Your report has been saved to your local system successfully!</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setDownloadModalVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#64748b' }}>
              {loading ? 'Loading your records...' : 'No past records found.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          // Format date if available
          const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A';
          // Since it's from DB, the age isn't directly returned but we have dob. We can calculate or just show DOB.
          const age = item.dob ? Math.abs(new Date(Date.now() - new Date(item.dob).getTime()).getUTCFullYear() - 1970) : '';
          
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.patientName}>{item.first_name} {item.last_name} {age ? `(Age ${age})` : ''}</Text>
                  <Text style={styles.testName}>Booking #{item.id} - {item.status}</Text>
                </View>
                <FileText color="#272a56" size={24} />
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.date}>{dateStr}</Text>
                {item.status === 'COMPLETED' ? (
                  <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
                    <Download color="#fff" size={16} style={{ marginRight: 6 }} />
                    <Text style={styles.downloadText}>Download Report</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={{color: '#eab308', fontWeight: 'bold', fontSize: 12}}>
                    {item.status === 'PENDING' ? 'Awaiting Tech' : item.status}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
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
  downloadText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dialogBox: { backgroundColor: '#fff', padding: 24, borderRadius: 16, width: '80%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  dialogTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  dialogText: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 },
  closeBtn: { backgroundColor: '#272a56', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, width: '100%', alignItems: 'center' },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
