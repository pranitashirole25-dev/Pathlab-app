import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Modal, ActivityIndicator } from 'react-native';
import { User } from 'lucide-react-native';
import { useCart } from '../context/CartContext';

export default function BookingScreen({ route, navigation }: any) {
  const { testName, price, tests } = route.params;
  const { clearCart } = useCart();
  
  // Normalize tests: either an array from TestsScreen or a single test from PackagesScreen
  const bookingItems = tests || [{ name: testName, price: price }];
  const subtotal = bookingItems.reduce((sum: number, item: any) => sum + Number(item.price || 0), 0);

  const [collectionType, setCollectionType] = useState<'HOME' | 'LAB'>('HOME');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  const SLOTS = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '04:00 PM', '05:00 PM'];
  
  // Mock patients for demo
  const PATIENTS = [
    { id: '1', name: 'John Doe', age: 34 },
    { id: '2', name: 'Robert Doe', age: 65 } // Senior Citizen
  ];

  useEffect(() => {
    setSelectedPatient(PATIENTS[0]);
  }, []);

  const handleConfirm = async () => {
    // Show our robust mock payment gateway modal instead of throwing an API error
    setPaymentModalVisible(true);
  };

  const processMockPayment = async () => {
    setProcessing(true);
    
    try {
      // Create real booking in database
      const response = await fetch('https://pathology-backend-ipnf.onrender.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // Mocked user ID from init script
          patientId: 1, // Mocked patient ID from init script
          testIds: bookingItems.map((item: any) => item.id),
          collectionType: collectionType,
          addressId: collectionType === 'HOME' ? 1 : null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create booking on server');
      }

      setProcessing(false);
      setPaymentModalVisible(false);
      clearCart();
      navigation.navigate('Success', { 
        amount: calculateTotal(), 
        slot: selectedSlot, 
        itemsCount: bookingItems.length 
      });
    } catch (err) {
      console.error(err);
      alert('Error creating booking. Please try again.');
      setProcessing(false);
    }
  };

  const calculateDiscount = () => {
    if (selectedPatient?.age >= 60) {
      return subtotal * 0.15; // 15% discount
    }
    return 0;
  };

  const calculateTotal = () => {
    const discount = calculateDiscount();
    const homeFee = collectionType === 'HOME' ? 100 : 0;
    return subtotal - discount + homeFee;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Test</Text>
        <View style={{ width: 40 }} />
      </View>

      <Modal visible={paymentModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <Text style={styles.paymentHeader}>Dr. Shirke's Pathology Lab</Text>
            <View style={styles.paymentDivider} />
            <Text style={styles.paymentLabel}>Amount to Pay</Text>
            <Text style={styles.paymentAmount}>₹{calculateTotal()}</Text>
            <Text style={styles.paymentDesc}>Booking for {bookingItems.length} Test(s) - {selectedPatient?.name}</Text>
            
            <View style={{marginTop: 30}}>
              {processing ? (
                <View style={styles.processingBtn}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.payNowBtn} onPress={processMockPayment}>
                  <Text style={styles.payNowText}>Pay ₹{calculateTotal()} securely</Text>
                </TouchableOpacity>
              )}
              {!processing && (
                <TouchableOpacity style={styles.cancelPayBtn} onPress={() => setPaymentModalVisible(false)}>
                  <Text style={styles.cancelPayText}>Cancel Payment</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.testSummaryCard}>
          <Text style={styles.sectionTitle}>Selected Tests</Text>
          {bookingItems.map((item: any, idx: number) => (
            <View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
              <Text style={[styles.testName, {flex: 1, marginRight: 8}]}>{item.name}</Text>
              <Text style={styles.testPrice}>₹{Number(item.price)}</Text>
            </View>
          ))}
          <View style={{height: 1, backgroundColor: '#e2e8f0', marginVertical: 8}} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: 'bold', color: '#0f172a'}}>Subtotal</Text>
            <Text style={{fontWeight: 'bold', color: '#0f172a'}}>₹{subtotal}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Who is this booking for?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientsContainer}>
          {PATIENTS.map(patient => (
            <TouchableOpacity 
              key={patient.id} 
              style={[styles.patientCard, selectedPatient?.id === patient.id && styles.patientCardActive]}
              onPress={() => setSelectedPatient(patient)}
            >
              <User color={selectedPatient?.id === patient.id ? '#fff' : '#64748b'} size={20} />
              <Text style={[styles.patientNameText, selectedPatient?.id === patient.id && styles.patientNameTextActive]}>
                {patient.name}
              </Text>
              <Text style={[styles.patientAgeText, selectedPatient?.id === patient.id && styles.patientNameTextActive]}>
                {patient.age} yrs {patient.age >= 60 ? '(Senior)' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Collection Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity 
            style={[styles.typeCard, collectionType === 'HOME' && styles.typeCardActive]}
            onPress={() => setCollectionType('HOME')}
          >
            <Text style={styles.typeIcon}>🏠</Text>
            <Text style={[styles.typeText, collectionType === 'HOME' && styles.typeTextActive]}>Home Visit</Text>
            {collectionType === 'HOME' && <View style={styles.activeDot} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.typeCard, collectionType === 'LAB' && styles.typeCardActive]}
            onPress={() => setCollectionType('LAB')}
          >
            <Text style={styles.typeIcon}>🏥</Text>
            <Text style={[styles.typeText, collectionType === 'LAB' && styles.typeTextActive]}>Lab Visit</Text>
            {collectionType === 'LAB' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <Text style={styles.dateSubtitle}>Tomorrow, Oct 27</Text>
        
        <View style={styles.slotsContainer}>
          {SLOTS.map(slot => (
            <TouchableOpacity 
              key={slot} 
              style={[styles.slotCard, selectedSlot === slot && styles.slotCardActive]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.billSummary}>
          <Text style={styles.billTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
              <Text style={styles.billLabel}>Total Tests ({bookingItems.length})</Text>
              <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          {calculateDiscount() > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: '#16a34a' }]}>Senior Citizen Discount (15%)</Text>
              <Text style={[styles.billValue, { color: '#16a34a' }]}>-₹{calculateDiscount()}</Text>
            </View>
          )}
          {collectionType === 'HOME' && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Home Visit Charge</Text>
              <Text style={styles.billValue}>₹100</Text>
            </View>
          )}
          <View style={[styles.billRow, styles.billTotalRow]}>
            <Text style={styles.billTotalLabel}>To Pay</Text>
            <Text style={styles.billTotalValue}>₹{calculateTotal()}</Text>
          </View>
          {collectionType === 'HOME' && (
            <Text style={styles.cancellationPolicyText}>
              * Cancellation charges of ₹100 apply if cancelled less than 30 mins prior.
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Amount</Text>
          <Text style={styles.footerPrice}>₹{calculateTotal()}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.confirmBtn, !selectedSlot && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!selectedSlot}
        >
          <Text style={styles.confirmBtnText}>Proceed to Pay • ₹{calculateTotal()}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  backBtnText: {
    fontSize: 20,
    color: '#0f172a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  testSummaryCard: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  testName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  testPrice: {
    color: '#38bdf8',
    fontSize: 24,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  patientsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    overflow: 'visible',
  },
  patientCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 120,
    shadowColor: '#272a56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  patientCardActive: {
    borderColor: '#272a56',
    backgroundColor: '#272a56',
  },
  patientNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
  patientAgeText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  patientNameTextActive: {
    color: '#ffffff',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  typeCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#272a56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  typeCardActive: {
    borderColor: '#272a56',
    backgroundColor: '#f0f9ff',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  typeTextActive: {
    color: '#272a56',
  },
  activeDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#272a56',
  },
  dateSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 16,
    marginTop: -8,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  slotCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  slotCardActive: {
    backgroundColor: '#272a56',
    borderColor: '#272a56',
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  slotTextActive: {
    color: '#ffffff',
  },
  billSummary: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  billValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  billTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
    paddingTop: 16,
    marginBottom: 0,
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#272a56',
  },
  cancellationPolicyText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 16,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  confirmBtn: {
    backgroundColor: '#272a56',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#272a56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  paymentModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  paymentHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 20,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#272a56',
    textAlign: 'center',
    marginBottom: 8,
  },
  paymentDesc: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },
  payNowBtn: {
    backgroundColor: '#63ad30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  payNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processingBtn: {
    backgroundColor: '#94a3b8',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cancelPayBtn: {
    padding: 16,
    alignItems: 'center',
  },
  cancelPayText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  }
});
