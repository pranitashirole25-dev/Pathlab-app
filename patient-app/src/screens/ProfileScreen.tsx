import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { UserPlus, User } from 'lucide-react-native';

export default function ProfileScreen() {
  const [patients, setPatients] = useState([
    { id: '1', name: 'Amit Kumar', dob: '1990-05-15', gender: 'Male' }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newPatient, setNewPatient] = useState({ firstName: '', lastName: '', dob: '', gender: '' });

  const handleAdd = () => {
    if (!newPatient.firstName || !newPatient.dob || !newPatient.gender) {
      alert("Please fill all fields");
      return;
    }
    setPatients([...patients, { id: Date.now().toString(), name: `${newPatient.firstName} ${newPatient.lastName}`, dob: newPatient.dob, gender: newPatient.gender }]);
    setIsAdding(false);
    setNewPatient({ firstName: '', lastName: '', dob: '', gender: '' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Members</Text>
      </View>
      
      <View style={styles.content}>
        {patients.map(p => (
          <View key={p.id} style={styles.card}>
            <View style={styles.avatar}><User color="#fff" size={24} /></View>
            <View>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.details}>DOB: {p.dob} • {p.gender}</Text>
            </View>
          </View>
        ))}

        {isAdding ? (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add Family Member</Text>
            <TextInput style={styles.input} placeholder="First Name" value={newPatient.firstName} onChangeText={t => setNewPatient({...newPatient, firstName: t})} />
            <TextInput style={styles.input} placeholder="Last Name" value={newPatient.lastName} onChangeText={t => setNewPatient({...newPatient, lastName: t})} />
            <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={newPatient.dob} onChangeText={t => setNewPatient({...newPatient, dob: t})} keyboardType="numeric" maxLength={10} />
            
            <Text style={{marginBottom: 8, fontWeight: '600', color: '#64748b'}}>Gender</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
              {['Male', 'Female', 'Other'].map(g => (
                <TouchableOpacity 
                  key={g} 
                  onPress={() => setNewPatient({...newPatient, gender: g})}
                  style={[styles.genderBtn, newPatient.gender === g && styles.genderBtnActive]}
                >
                  <Text style={[styles.genderBtnText, newPatient.gender === g && styles.genderBtnTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAdding(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveBtnText}>Save Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => setIsAdding(true)}>
            <UserPlus color="#272a56" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.addBtnText}>Add Family Member</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#272a56', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  details: { fontSize: 14, color: '#64748b' },
  addBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', borderRadius: 16, marginTop: 10 },
  addBtnText: { color: '#272a56', fontWeight: 'bold', fontSize: 16 },
  addForm: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 10 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  genderBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, marginHorizontal: 4, alignItems: 'center' },
  genderBtnActive: { backgroundColor: '#272a56', borderColor: '#272a56' },
  genderBtnText: { color: '#64748b', fontWeight: '600' },
  genderBtnTextActive: { color: '#fff', fontWeight: '600' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center', marginRight: 8, backgroundColor: '#f1f5f9' },
  cancelBtnText: { color: '#64748b', fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#272a56', padding: 16, borderRadius: 8, alignItems: 'center', marginLeft: 8 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});
