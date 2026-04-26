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
    setPatients([...patients, { id: Date.now().toString(), name: `${newPatient.firstName} ${newPatient.lastName}`, dob: newPatient.dob, gender: newPatient.gender }]);
    setIsAdding(false);
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
            <TextInput style={styles.input} placeholder="First Name" onChangeText={t => setNewPatient({...newPatient, firstName: t})} />
            <TextInput style={styles.input} placeholder="Last Name" onChangeText={t => setNewPatient({...newPatient, lastName: t})} />
            <TextInput style={styles.input} placeholder="DOB (YYYY-MM-DD)" onChangeText={t => setNewPatient({...newPatient, dob: t})} />
            <TextInput style={styles.input} placeholder="Gender" onChangeText={t => setNewPatient({...newPatient, gender: t})} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => setIsAdding(true)}>
            <UserPlus color="#0ea5e9" size={20} style={{ marginRight: 8 }} />
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
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  details: { fontSize: 14, color: '#64748b' },
  addBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', borderRadius: 16, marginTop: 10 },
  addBtnText: { color: '#0ea5e9', fontWeight: 'bold', fontSize: 16 },
  addForm: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 10 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  saveBtn: { backgroundColor: '#0ea5e9', padding: 16, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});
