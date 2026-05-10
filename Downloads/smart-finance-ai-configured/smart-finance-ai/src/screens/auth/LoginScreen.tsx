import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { COLORS } from '../../constants';
import { isValidEmail } from '../../utils';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const { signIn, isLoading, clearError } = useAuthStore();

  const handleLogin = async () => {
    clearError();
    if (!isValidEmail(email)) { Alert.alert('Invalid Email', 'Please enter a valid email address.'); return; }
    if (password.length < 6) { Alert.alert('Invalid Password', 'Password must be at least 6 characters.'); return; }
    try {
      await signIn(email, password);
      if (typeof window !== 'undefined') window.location.href = '/dashboard';
    } catch (e: any) {
      Alert.alert('Login Failed', e.message ?? 'Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoMark}>
              <Ionicons name="stats-chart" size={32} color="#fff" />
            </View>
            <Text style={styles.appName}>Smart Finance AI</Text>
            <Text style={styles.tagline}>Intelligent money management</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSub}>Welcome back</Text>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={COLORS.dark.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.dark.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.dark.textMuted} style={styles.inputIcon} />
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, { paddingRight: 44 }]}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.dark.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.dark.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => { if (typeof window !== 'undefined') window.location.href = '/auth/forgot-password'; }} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.submitBtn, isLoading && { opacity: 0.7 }]} onPress={handleLogin} disabled={isLoading}>
              <LinearGradient colors={['#5B5FEF', '#3D41CC']} style={styles.submitGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Sign In</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => { if (typeof window !== 'undefined') window.location.href = '/auth/register'; }}>
              <Text style={styles.secondaryBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={13} color={COLORS.dark.textMuted} />
            <Text style={styles.footerText}> Secured by Supabase • 256-bit encryption</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.bg },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },

  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoMark: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  appName: { fontSize: 26, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 4, fontWeight: '400' },

  card: { backgroundColor: COLORS.dark.card, borderRadius: 24, padding: 28, borderWidth: 1, borderColor: COLORS.dark.border },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.5 },
  cardSub: { fontSize: 13, color: COLORS.dark.textSecondary, marginBottom: 28, marginTop: 4 },

  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: COLORS.dark.textMuted, letterSpacing: 1.2, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.dark.surface, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.dark.border,
  },
  inputIcon: { paddingLeft: 14 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 15, color: COLORS.dark.text },
  eyeBtn: { padding: 14 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -8 },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  submitBtn: { borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  submitGradient: { paddingVertical: 15, alignItems: 'center' },
  submitText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.dark.border },
  dividerLabel: { color: COLORS.dark.textMuted, marginHorizontal: 12, fontSize: 12 },

  secondaryBtn: {
    borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.dark.border,
    paddingVertical: 14, alignItems: 'center',
  },
  secondaryBtnText: { color: COLORS.dark.text, fontWeight: '600', fontSize: 15 },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  footerText: { fontSize: 12, color: COLORS.dark.textMuted },
});
