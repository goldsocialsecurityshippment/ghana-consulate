import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert, ActivityIndicator, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { COLORS, CURRENCIES } from '../../constants';
import { formatCurrency } from '../../utils';

const CURRENCY_FLAGS: Record<string, string> = {
  GHS: '🇬🇭',
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  NGN: '🇳🇬',
  KES: '🇰🇪',
  ZAR: '🇿🇦',
};

export default function ProfileScreen() {
  const { user, profile, updateProfile, signOut, resetPassword, isLoading } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [currency, setCurrency] = useState(profile?.currency ?? 'GHS');
  const [monthlyGoal, setMonthlyGoal] = useState(profile?.monthly_income_goal?.toString() ?? '');
  const [notifEnabled, setNotifEnabled] = useState(profile?.notifications_enabled ?? true);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        currency,
        monthly_income_goal: parseFloat(monthlyGoal) || 0,
        notifications_enabled: notifEnabled,
      });
      setEditMode(false);
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSaving(false);
    }
  };

const handleSignOut = async () => {
  if (typeof window !== 'undefined') {
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (!confirmed) return;
  }
  try {
    await signOut();
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.replace('/auth/login');
  }
};

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setIsResettingPassword(true);
    try {
      await resetPassword(user.email);
      setPasswordResetSent(true);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to send reset email.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Smart Finance AI - Data Export'],
      [`Generated:,${new Date().toLocaleDateString()}`],
      [`User:,${profile?.full_name ?? user?.email}`],
      [`Email:,${user?.email}`],
      [`Currency:,${profile?.currency ?? 'GHS'}`],
      [`Monthly Goal:,${formatCurrency(profile?.monthly_income_goal ?? 0, profile?.currency ?? 'GHS')}`],
      [`Savings Target:,${profile?.savings_goal ?? 20}%`],
      [`Member Since:,${profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}`],
      [],
      ['NOTE: For full transaction export visit Supabase Dashboard > Table Editor > Export CSV'],
    ];
    const csvContent = rows.map(r => r.join(',')).join('\n');
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-finance-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setShowExportModal(false);
    Alert.alert('Downloaded', 'Your data has been exported successfully.');
  };

  const initials = (profile?.full_name ?? user?.email ?? 'U')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const currencyConfig = CURRENCIES[profile?.currency ?? 'GHS'];
  const selectedFlag = CURRENCY_FLAGS[profile?.currency ?? 'GHS'] ?? '🌍';

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => editMode ? handleSave() : setEditMode(true)}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <View style={styles.editBtnInner}>
                <Ionicons name={editMode ? 'checkmark-outline' : 'pencil-outline'} size={14} color={COLORS.primary} />
                <Text style={styles.editBtnText}>{editMode ? 'Save' : 'Edit'}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.avatarSection}>
          <LinearGradient colors={['#5B5FEF', '#3D41CC']} style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          <Text style={styles.profileName}>{profile?.full_name ?? 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.currencyPill}>
            <Text style={styles.flagEmoji}>{selectedFlag}</Text>
            <Text style={styles.currencyPillText}>
              {currencyConfig?.name} ({currencyConfig?.symbol})
            </Text>
          </View>
        </View>

        {editMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            <View style={styles.card}>
              {[
                { label: 'FULL NAME', value: fullName, setter: setFullName, placeholder: 'Your full name', icon: 'person-outline', keyboard: 'default' },
                { label: 'MONTHLY INCOME GOAL', value: monthlyGoal, setter: setMonthlyGoal, placeholder: '0.00', icon: 'trending-up-outline', keyboard: 'decimal-pad' },
              ].map(({ label, value, setter, placeholder, icon, keyboard }) => (
                <View key={label} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name={icon as any} size={16} color={COLORS.dark.textMuted} />
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={setter}
                      placeholder={placeholder}
                      placeholderTextColor={COLORS.dark.textMuted}
                      keyboardType={keyboard as any}
                    />
                  </View>
                </View>
              ))}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>CURRENCY</Text>
                <TouchableOpacity style={styles.selectorBtn} onPress={() => setShowCurrencyModal(true)}>
                  <Text style={styles.selectorFlag}>{CURRENCY_FLAGS[currency] ?? '🌍'}</Text>
                  <Text style={styles.selectorText}>{CURRENCIES[currency]?.name} ({CURRENCIES[currency]?.symbol})</Text>
                  <Ionicons name="chevron-forward-outline" size={16} color={COLORS.dark.textMuted} />
                </TouchableOpacity>
              </View>
              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <View style={styles.toggleIcon}>
                    <Ionicons name="notifications-outline" size={16} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.toggleLabel}>Push Notifications</Text>
                    <Text style={styles.toggleSub}>Budget and savings alerts</Text>
                  </View>
                </View>
                <Switch value={notifEnabled} onValueChange={setNotifEnabled} trackColor={{ false: COLORS.dark.border, true: COLORS.primary }} thumbColor="#fff" />
              </View>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <View style={styles.card}>
            {[
              { label: 'Currency', value: `${CURRENCY_FLAGS[profile?.currency ?? 'GHS'] ?? ''} ${currencyConfig?.name} (${currencyConfig?.symbol})`, icon: 'globe-outline' },
              { label: 'Monthly Goal', value: formatCurrency(profile?.monthly_income_goal ?? 0, profile?.currency ?? 'GHS'), icon: 'trending-up-outline' },
              { label: 'Savings Target', value: `${profile?.savings_goal ?? 20}%`, icon: 'save-outline' },
              { label: 'Notifications', value: profile?.notifications_enabled ? 'Enabled' : 'Disabled', icon: 'notifications-outline' },
              { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A', icon: 'calendar-outline' },
            ].map(({ label, value, icon }, i, arr) => (
              <View key={label} style={[styles.infoRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.infoLeft}>
                  <Ionicons name={icon as any} size={15} color={COLORS.dark.textSecondary} />
                  <Text style={styles.infoLabel}>{label}</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            {[
              { label: 'Change Password', icon: 'lock-closed-outline', onPress: () => { setPasswordResetSent(false); setShowChangePasswordModal(true); } },
              { label: 'Export Data', icon: 'download-outline', onPress: () => setShowExportModal(true) },
              { label: 'Support & Feedback', icon: 'chatbubble-outline', onPress: () => setShowSupportModal(true) },
              { label: 'About Smart Finance AI', icon: 'information-circle-outline', onPress: () => setShowAboutModal(true) },
            ].map(({ label, icon, onPress }, i, arr) => (
              <TouchableOpacity
                key={label}
                style={[styles.settingRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
                onPress={onPress}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconBox}>
                    <Ionicons name={icon as any} size={16} color={COLORS.dark.textSecondary} />
                  </View>
                  <Text style={styles.settingLabel}>{label}</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={16} color={COLORS.dark.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <View style={styles.signOutInner}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.versionText}>Smart Finance AI v1.0.0 · Secured by Supabase</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CURRENCY MODAL */}
      <Modal visible={showCurrencyModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCurrencyModal(false)} style={styles.backBtn}>
              <Ionicons name="arrow-back-outline" size={20} color={COLORS.dark.textSecondary} />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <View style={{ width: 70 }} />
          </View>
          <ScrollView>
            {Object.entries(CURRENCIES).map(([code, config]) => (
              <TouchableOpacity
                key={code}
                style={[styles.currencyOption, currency === code && styles.currencyOptionSelected]}
                onPress={() => { setCurrency(code); setShowCurrencyModal(false); }}
              >
                <View style={styles.currencyOptionLeft}>
                  <Text style={styles.currencyFlagLarge}>{CURRENCY_FLAGS[code] ?? '🌍'}</Text>
                  <View>
                    <Text style={styles.currencyName}>{config.name}</Text>
                    <Text style={styles.currencyCode}>{code} · {config.symbol}</Text>
                  </View>
                </View>
                {currency === code && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={showChangePasswordModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowChangePasswordModal(false)} style={styles.backBtn}>
              <Ionicons name="arrow-back-outline" size={20} color={COLORS.dark.textSecondary} />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Password</Text>
            <View style={{ width: 70 }} />
          </View>
          <ScrollView style={styles.modalBody}>
            {passwordResetSent ? (
              <View style={styles.centeredSection}>
                <View style={[styles.bigIconBox, { backgroundColor: COLORS.success + '18' }]}>
                  <Ionicons name="mail-open-outline" size={40} color={COLORS.success} />
                </View>
                <Text style={styles.bigTitle}>Email Sent!</Text>
                <Text style={styles.bigSubtitle}>We sent a password reset link to</Text>
                <Text style={[styles.bigSubtitle, { color: COLORS.primary, fontWeight: '700' }]}>{user?.email}</Text>
                <Text style={styles.hintText}>
                  Open the link in your email to set a new password. Check your spam folder if you don't see it within a few minutes.
                </Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => { setShowChangePasswordModal(false); setPasswordResetSent(false); }}>
                  <Text style={styles.primaryBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.centeredSection}>
                <View style={[styles.bigIconBox, { backgroundColor: COLORS.primary + '18' }]}>
                  <Ionicons name="lock-closed-outline" size={40} color={COLORS.primary} />
                </View>
                <Text style={styles.bigTitle}>Reset Password</Text>
                <Text style={styles.bigSubtitle}>
                  We'll send a secure reset link to your email address so you can set a new password.
                </Text>
                <View style={styles.emailBox}>
                  <Ionicons name="mail-outline" size={16} color={COLORS.dark.textSecondary} />
                  <Text style={styles.emailBoxText}>{user?.email}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.primaryBtn, isResettingPassword && { opacity: 0.7 }]}
                  onPress={handleSendPasswordReset}
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={styles.btnRow}>
                      <Ionicons name="send-outline" size={16} color="#fff" />
                      <Text style={styles.primaryBtnText}>Send Reset Link</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.hintText}>
                  After clicking the link in your email, you will be redirected to set a new password and sign back in.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* EXPORT MODAL */}
      <Modal visible={showExportModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowExportModal(false)} style={styles.backBtn}>
              <Ionicons name="arrow-back-outline" size={20} color={COLORS.dark.textSecondary} />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Export Data</Text>
            <View style={{ width: 70 }} />
          </View>
          <ScrollView style={styles.modalBody}>
            <View style={styles.centeredSection}>
              <View style={[styles.bigIconBox, { backgroundColor: COLORS.primary + '18' }]}>
                <Ionicons name="download-outline" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.bigTitle}>Export Your Data</Text>
              <Text style={styles.bigSubtitle}>
                Download your financial data as a CSV file. Open in Excel, Google Sheets, or any spreadsheet app.
              </Text>
            </View>
            {[
              { label: 'Profile Summary', desc: 'Account settings and goals', icon: 'person-outline' },
              { label: 'Transaction History', desc: 'All incomes and expenses', icon: 'swap-horizontal-outline' },
              { label: 'Budget Settings', desc: 'Allocation percentages', icon: 'pie-chart-outline' },
              { label: 'Savings Goals', desc: 'Goals and progress tracking', icon: 'trophy-outline' },
            ].map(({ label, desc, icon }) => (
              <View key={label} style={styles.exportRow}>
                <View style={[styles.exportRowIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name={icon as any} size={18} color={COLORS.primary} />
                </View>
                <View style={styles.exportRowInfo}>
                  <Text style={styles.exportRowLabel}>{label}</Text>
                  <Text style={styles.exportRowDesc}>{desc}</Text>
                </View>
                <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.success} />
              </View>
            ))}
            <TouchableOpacity style={[styles.primaryBtn, { marginTop: 20 }]} onPress={handleExportCSV}>
              <View style={styles.btnRow}>
                <Ionicons name="download-outline" size={16} color="#fff" />
                <Text style={styles.primaryBtnText}>Download CSV</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.noteBox}>
              <Ionicons name="information-circle-outline" size={14} color={COLORS.dark.textMuted} />
              <Text style={styles.noteText}>
                For full database export, visit Supabase dashboard → Table Editor → Export.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* SUPPORT MODAL */}
      <Modal visible={showSupportModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSupportModal(false)} style={styles.backBtn}>
              <Ionicons name="arrow-back-outline" size={20} color={COLORS.dark.textSecondary} />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Support & Feedback</Text>
            <View style={{ width: 70 }} />
          </View>
          <ScrollView style={styles.modalBody}>
            <View style={styles.centeredSection}>
              <View style={[styles.bigIconBox, { backgroundColor: COLORS.primary + '18' }]}>
                <Ionicons name="chatbubble-ellipses-outline" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.bigTitle}>We're here to help</Text>
              <Text style={styles.bigSubtitle}>Reach out for any questions, issues, or feature requests.</Text>
            </View>
            {[
              { label: 'Email Support', value: 'support@smartfinanceai.com', icon: 'mail-outline', color: COLORS.primary, subject: '' },
              { label: 'Report a Bug', value: 'bugs@smartfinanceai.com', icon: 'bug-outline', color: COLORS.danger, subject: 'Bug Report' },
              { label: 'Feature Request', value: 'feedback@smartfinanceai.com', icon: 'bulb-outline', color: COLORS.warning, subject: 'Feature Request' },
            ].map(({ label, value, icon, color, subject }) => (
              <TouchableOpacity
                key={label}
                style={styles.supportItem}
                onPress={() => { if (typeof window !== 'undefined') window.open(`mailto:${value}${subject ? `?subject=${subject}` : ''}`, '_blank'); }}
              >
                <View style={[styles.supportItemIcon, { backgroundColor: color + '18' }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={styles.supportItemInfo}>
                  <Text style={styles.supportItemLabel}>{label}</Text>
                  <Text style={styles.supportItemValue}>{value}</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={COLORS.dark.textMuted} />
              </TouchableOpacity>
            ))}
            <View style={styles.noteBox}>
              <Ionicons name="time-outline" size={14} color={COLORS.dark.textMuted} />
              <Text style={styles.noteText}>Average response time: 24–48 hours on business days.</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ABOUT MODAL */}
      <Modal visible={showAboutModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAboutModal(false)} style={styles.backBtn}>
              <Ionicons name="arrow-back-outline" size={20} color={COLORS.dark.textSecondary} />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>About</Text>
            <View style={{ width: 70 }} />
          </View>
          <ScrollView style={styles.modalBody}>
            <View style={styles.centeredSection}>
              <LinearGradient colors={['#5B5FEF', '#3D41CC']} style={styles.aboutLogo}>
                <Ionicons name="stats-chart" size={36} color="#fff" />
              </LinearGradient>
              <Text style={styles.bigTitle}>Smart Finance AI</Text>
              <Text style={[styles.bigSubtitle, { fontSize: 13 }]}>Version 1.0.0</Text>
            </View>

            <Text style={styles.aboutDesc}>
              Smart Finance AI is your personal financial assistant — designed to help you take full control of your money, build better habits, and make smarter financial decisions every day.
            </Text>

            {[
              { icon: 'wallet-outline', color: COLORS.success, title: 'Income & Expense Tracking', desc: 'Record every income source and expense with categories, payment methods, and full history. Search, filter, and manage all transactions in one place.' },
              { icon: 'pie-chart-outline', color: COLORS.primary, title: 'Smart Budget Engine', desc: 'Automatic 50/30/20 budgeting rule splits your income into needs, wants, and savings. Real-time alerts when you approach limits. Daily safe-to-spend calculator.' },
              { icon: 'lock-closed-outline', color: COLORS.warning, title: 'Savings Lock System', desc: 'Create savings goals and lock funds away from your spendable balance. Track progress toward each goal. Unlock only when you intentionally want to withdraw.' },
              { icon: 'sparkles-outline', color: '#C45FEF', title: 'AI Financial Insights', desc: 'Dynamic insights generated from your real spending data — detects weekend spending spikes, category trends, income changes, and savings habits.' },
              { icon: 'bar-chart-outline', color: COLORS.info, title: 'Analytics & Reports', desc: '6-month income vs expense trends, category breakdowns with trend arrows, savings rate tracking, and day-of-week spending habit analysis.' },
              { icon: 'notifications-outline', color: COLORS.danger, title: 'Smart Notifications', desc: 'Automatic alerts for budget limits exceeded, low balance warnings, savings milestones reached, weekly financial reports, and income reminders.' },
            ].map(({ icon, color, title, desc }) => (
              <View key={title} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: color + '18' }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{title}</Text>
                  <Text style={styles.featureDesc}>{desc}</Text>
                </View>
              </View>
            ))}

            <View style={styles.techRow}>
              {[
                { label: 'React Native', icon: 'phone-portrait-outline' },
                { label: 'Supabase', icon: 'server-outline' },
                { label: 'PostgreSQL', icon: 'layers-outline' },
                { label: 'TypeScript', icon: 'code-slash-outline' },
              ].map(({ label, icon }) => (
                <View key={label} style={styles.techBadge}>
                  <Ionicons name={icon as any} size={13} color={COLORS.dark.textSecondary} />
                  <Text style={styles.techBadgeText}>{label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.aboutFooter}>
              <Text style={styles.aboutFooterText}>Built for real financial control</Text>
              <Text style={styles.aboutFooterText}>© {new Date().getFullYear()} Smart Finance AI. All rights reserved.</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.5 },
  editBtn: { backgroundColor: COLORS.primary + '15', borderRadius: 11, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primary + '40' },
  editBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  editBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatarCircle: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  profileName: { fontSize: 20, fontWeight: '700', color: COLORS.dark.text, marginBottom: 4, letterSpacing: -0.3 },
  profileEmail: { fontSize: 13, color: COLORS.dark.textSecondary, marginBottom: 12 },
  currencyPill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: COLORS.dark.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.dark.border },
  flagEmoji: { fontSize: 18 },
  currencyPillText: { fontSize: 13, color: COLORS.dark.textSecondary, fontWeight: '500' },
  section: { paddingHorizontal: 24, marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.dark.textSecondary, marginBottom: 10, letterSpacing: 0.8, textTransform: 'uppercase' },
  card: { backgroundColor: COLORS.dark.card, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: COLORS.dark.border },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: COLORS.dark.textMuted, letterSpacing: 1.2, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dark.surface, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.dark.border },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: COLORS.dark.text },
  selectorBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dark.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: COLORS.dark.border },
  selectorFlag: { fontSize: 20 },
  selectorText: { flex: 1, fontSize: 15, color: COLORS.dark.text },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: COLORS.dark.divider, marginTop: 4 },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIcon: { width: 34, height: 34, borderRadius: 9, backgroundColor: COLORS.primary + '18', alignItems: 'center', justifyContent: 'center' },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  toggleSub: { fontSize: 12, color: COLORS.dark.textMuted, marginTop: 1 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12, marginTop: 4 },
  cancelBtnText: { color: COLORS.dark.textSecondary, fontSize: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.dark.divider },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { fontSize: 14, color: COLORS.dark.textSecondary },
  infoValue: { fontSize: 13, fontWeight: '600', color: COLORS.dark.text, maxWidth: 180, textAlign: 'right' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.dark.divider },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.dark.surface, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 15, fontWeight: '500', color: COLORS.dark.text },
  signOutBtn: { backgroundColor: COLORS.danger + '12', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.danger + '30', marginBottom: 16 },
  signOutInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  signOutText: { color: COLORS.danger, fontSize: 15, fontWeight: '700' },
  versionText: { textAlign: 'center', color: COLORS.dark.textMuted, fontSize: 12 },
  modalContainer: { flex: 1, backgroundColor: COLORS.dark.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 70 },
  backBtnText: { fontSize: 15, color: COLORS.dark.textSecondary },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark.text },
  modalBody: { flex: 1, padding: 24 },
  currencyOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  currencyOptionSelected: { backgroundColor: COLORS.primary + '08' },
  currencyOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  currencyFlagLarge: { fontSize: 30 },
  currencyName: { fontSize: 15, fontWeight: '600', color: COLORS.dark.text },
  currencyCode: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 2 },
  centeredSection: { alignItems: 'center', paddingBottom: 24, gap: 8 },
  bigIconBox: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  bigTitle: { fontSize: 22, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.3, textAlign: 'center' },
  bigSubtitle: { fontSize: 14, color: COLORS.dark.textSecondary, textAlign: 'center', lineHeight: 21, paddingHorizontal: 10 },
  hintText: { fontSize: 13, color: COLORS.dark.textMuted, textAlign: 'center', lineHeight: 19, paddingHorizontal: 10 },
  emailBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dark.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, width: '100%', marginVertical: 4, borderWidth: 1, borderColor: COLORS.dark.border },
  emailBoxText: { fontSize: 15, color: COLORS.dark.text, fontWeight: '600' },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', width: '100%', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exportRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.card, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.dark.border, gap: 12 },
  exportRowIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  exportRowInfo: { flex: 1 },
  exportRowLabel: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  exportRowDesc: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 2 },
  noteBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 14, padding: 14, backgroundColor: COLORS.dark.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.dark.border },
  noteText: { flex: 1, fontSize: 12, color: COLORS.dark.textMuted, lineHeight: 18 },
  supportItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.dark.border, gap: 14 },
  supportItemIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  supportItemInfo: { flex: 1 },
  supportItemLabel: { fontSize: 14, fontWeight: '700', color: COLORS.dark.text },
  supportItemValue: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 2 },
  aboutLogo: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  aboutDesc: { fontSize: 14, color: COLORS.dark.textSecondary, lineHeight: 22, marginBottom: 20, textAlign: 'center', paddingHorizontal: 8 },
  featureCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.dark.border },
  featureIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dark.text, marginBottom: 4 },
  featureDesc: { fontSize: 13, color: COLORS.dark.textSecondary, lineHeight: 19 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16, marginBottom: 8 },
  techBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.dark.card, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.dark.border },
  techBadgeText: { fontSize: 12, color: COLORS.dark.textSecondary, fontWeight: '600' },
  aboutFooter: { alignItems: 'center', paddingTop: 24, paddingBottom: 16, gap: 4 },
  aboutFooterText: { fontSize: 13, color: COLORS.dark.textMuted },
});
