import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { COLORS } from '../../constants';
import { isValidEmail, isStrongPassword } from '../../utils';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading, clearError } = useAuthStore();

const handleRegister = async () => {
  clearError();
  if (!fullName.trim()) { Alert.alert('Missing Name', 'Please enter your full name.'); return; }
  if (!isValidEmail(email)) { Alert.alert('Invalid Email', 'Please enter a valid email address.'); return; }
  if (!isStrongPassword(password)) { Alert.alert('Weak Password', 'Password must be at least 8 characters.'); return; }
  if (password !== confirmPassword) { Alert.alert('Password Mismatch', "Passwords don't match."); return; }
  try {
    await signUp(email, password, fullName);
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  } catch (e: any) {
    Alert.alert('Registration Failed', e.message ?? 'Please try again.');
  }
};

  const fields = [
    { label: 'FULL NAME', value: fullName, setter: setFullName, placeholder: 'John Mensah', icon: 'person-outline', keyboard: 'default', secure: false },
    { label: 'EMAIL', value: email, setter: setEmail, placeholder: 'john@example.com', icon: 'mail-outline', keyboard: 'email-address', secure: false },
    { label: 'PASSWORD', value: password, setter: setPassword, placeholder: 'Min. 8 characters', icon: 'lock-closed-outline', keyboard: 'default', secure: !showPassword },
    { label: 'CONFIRM PASSWORD', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Repeat password', icon: 'lock-closed-outline', keyboard: 'default', secure: !showPassword },
  ];

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <TouchableOpacity style={styles.backBtn} onPress={() => { if (typeof window !== 'undefined') window.location.href = '/auth/login'; }}>
            <Ionicons name="arrow-back-outline" size={20} color={COLORS.dark.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.logoMark}>
            <Ionicons name="stats-chart" size={28} color="#fff" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your financial journey today</Text>

          <View style={styles.card}>
            {fields.map(({ label, value, setter, placeholder, icon, keyboard, secure }) => (
              <View key={label} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name={icon as any} size={17} color={COLORS.dark.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, (label === 'PASSWORD' || label === 'CONFIRM PASSWORD') && { paddingRight: 44 }]}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.dark.textMuted}
                    value={value}
                    onChangeText={setter}
                    keyboardType={keyboard as any}
                    autoCapitalize={label === 'EMAIL' ? 'none' : 'words'}
                    secureTextEntry={secure}
                    autoCorrect={false}
                  />
                  {(label === 'PASSWORD') && (
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={17} color={COLORS.dark.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <Text style={styles.terms}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </Text>

            <TouchableOpacity style={[styles.submitBtn, isLoading && { opacity: 0.7 }]} onPress={handleRegister} disabled={isLoading}>
              <LinearGradient colors={['#5B5FEF', '#3D41CC']} style={styles.submitGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create Account</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => { if (typeof window !== 'undefined') window.location.href = '/auth/login'; }}>
              <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: COLORS.primary }}>Sign in</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.bg },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 48 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 32, alignSelf: 'flex-start' },
  backText: { fontSize: 14, color: COLORS.dark.textSecondary, fontWeight: '500' },
  logoMark: {
    width: 60, height: 60, borderRadius: 16, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: COLORS.dark.textSecondary, marginBottom: 28, marginTop: 4 },
  card: { backgroundColor: COLORS.dark.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: COLORS.dark.border },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: COLORS.dark.textMuted, letterSpacing: 1.2, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.dark.border },
  inputIcon: { paddingLeft: 14 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 15, color: COLORS.dark.text },
  eyeBtn: { padding: 13 },
  terms: { fontSize: 12, color: COLORS.dark.textMuted, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  submitBtn: { borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  submitGradient: { paddingVertical: 15, alignItems: 'center' },
  submitText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  loginLink: { alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: COLORS.dark.textSecondary },
});
