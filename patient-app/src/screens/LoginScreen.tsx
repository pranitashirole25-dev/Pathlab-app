import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');

  const handleSendOTP = () => {
    // Mock API call
    if (phone.length >= 10) setStep('OTP');
  };

  const handleVerifyOTP = () => {
    // Mock API call
    if (otp.length === 6) {
      navigation.replace('MainApp');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brandName}>PATHOLAB</Text>
          <Text style={styles.subtitle}>Premium Diagnostics</Text>
        </View>

        <View style={styles.card}>
          {step === 'PHONE' ? (
            <>
              <Text style={styles.cardTitle}>Welcome</Text>
              <Text style={styles.cardDesc}>Enter your WhatsApp number to login or register.</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.prefix}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter mobile number"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={10}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, phone.length < 10 && styles.buttonDisabled]} 
                onPress={handleSendOTP}
                disabled={phone.length < 10}
              >
                <Text style={styles.buttonText}>Send OTP via WhatsApp</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Verify OTP</Text>
              <Text style={styles.cardDesc}>We've sent a 6-digit code to your WhatsApp +91 {phone}</Text>
              
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="• • • • • •"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                textAlign="center"
              />

              <TouchableOpacity 
                style={[styles.button, otp.length < 6 && styles.buttonDisabled]} 
                onPress={handleVerifyOTP}
                disabled={otp.length < 6}
              >
                <Text style={styles.buttonText}>Verify & Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setStep('PHONE')} style={{ marginTop: 20 }}>
                <Text style={styles.linkText}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0ea5e9',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#f8fafc',
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    fontSize: 24,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: '#0ea5e9',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#bae6fd',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  }
});
