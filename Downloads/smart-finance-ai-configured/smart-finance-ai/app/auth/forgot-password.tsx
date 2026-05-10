// ============================================================
// Smart Finance AI - Forgot Password Screen
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/state/authStore';
import { COLORS } from '../../src/constants';
import { isValidEmail } from '../../src/utils';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { resetPassword, isLoading } = useAuthStore();

  const handleReset = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to send reset email.');
    }
  };

  return (
    <LinearGradient colors={['#0A0A0F', '#13131A']} style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>{sent ? '📬' : '🔐'}</Text>
        <Text style={styles.title}>{sent ? 'Check your email' : 'Reset Password'}</Text>
        <Text style={styles.subtitle}>
          {sent
            ? `We've sent a password reset link to ${email}`
            : 'Enter your email and we\'ll send you a reset link'}
        </Text>

        {!sent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.dark.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              onPress={handleReset}
              disabled={isLoading}
            >
              <LinearGradient colors={['#6C63FF', '#4A42D4']} style={styles.btnGradient}>
                {isLoading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnText}>Send Reset Link</Text>
                }
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {sent && (
          <TouchableOpacity style={styles.btn} onPress={() => router.replace('/auth/login')}>
            <LinearGradient colors={['#6C63FF', '#4A42D4']} style={styles.btnGradient}>
              <Text style={styles.btnText}>Back to Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: { marginTop: 60, alignSelf: 'flex-start' },
  backText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 60, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 15, color: COLORS.dark.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 20 },
  input: {
    width: '100%', backgroundColor: COLORS.dark.card, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 15, fontSize: 16, color: '#fff',
    borderWidth: 1, borderColor: COLORS.dark.border, marginBottom: 20,
  },
  btn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  btnDisabled: { opacity: 0.7 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
