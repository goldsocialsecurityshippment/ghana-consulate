import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useFinanceStore } from '../../state/financeStore';
import { COLORS } from '../../constants';
import { formatCurrency, formatDate, getPercentage, getTodayString } from '../../utils';
import { SavingsGoal, CreateSavingsGoalDto } from '../../types';

export default function SavingsScreen() {
  const { user, profile } = useAuthStore();
  const { savingsGoals, dashboardStats, isLoading, isRefreshing, loadAll, refreshAll, addSavingsGoal, deleteSavingsGoal, addFundsToGoal, toggleGoalLock } = useFinanceStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const currency = profile?.currency ?? 'GHS';

  useEffect(() => { if (user?.id) loadAll(user.id); }, [user?.id]);

  const totalLocked = savingsGoals.filter(g => g.locked).reduce((s, g) => s + g.current_amount, 0);
  const completedGoals = savingsGoals.filter(g => g.completed).length;

  const handleAddGoal = async () => {
    const amount = parseFloat(targetAmount);
    if (!goalName.trim()) { Alert.alert('Missing Name', 'Enter a goal name.'); return; }
    if (isNaN(amount) || amount <= 0) { Alert.alert('Invalid Amount', 'Enter a valid amount.'); return; }
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await addSavingsGoal(user.id, { goal_name: goalName.trim(), target_amount: amount, current_amount: 0, locked: true, target_date: targetDate || undefined });
      setShowAddModal(false); setGoalName(''); setTargetAmount(''); setTargetDate('');
    } catch (e: any) { Alert.alert('Error', e.message); }
    finally { setIsSaving(false); }
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(fundAmount);
    if (!selectedGoal || isNaN(amount) || amount <= 0) { Alert.alert('Invalid Amount', 'Enter a valid amount.'); return; }
    setIsSaving(true);
    try {
      await addFundsToGoal(selectedGoal.id, amount);
      setShowFundModal(false); setFundAmount(''); setSelectedGoal(null);
    } catch (e: any) { Alert.alert('Error', e.message); }
    finally { setIsSaving(false); }
  };

  const handleToggleLock = (goal: SavingsGoal) => {
    if (!goal.locked) { toggleGoalLock(goal.id, true); return; }
    Alert.alert('Unlock Savings?', `Unlocking "${goal.goal_name}" removes it from locked savings. Continue?`, [
      { text: 'Keep Locked', style: 'cancel' },
      { text: 'Unlock', style: 'destructive', onPress: () => toggleGoalLock(goal.id, false) },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => user?.id && refreshAll(user.id)} tintColor={COLORS.primary} />}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Savings</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-outline" size={16} color="#fff" />
            <Text style={styles.addBtnText}>New Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <LinearGradient colors={['#5B5FEF', '#00C896']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.heroLabel}>TOTAL LOCKED SAVINGS</Text>
            <Text style={styles.heroAmount}>{formatCurrency(totalLocked, currency)}</Text>
            <View style={styles.heroStatsRow}>
              {[
                { label: 'Goals', value: savingsGoals.length.toString() },
                { label: 'Completed', value: completedGoals.toString() },
                { label: 'Target', value: formatCurrency(savingsGoals.reduce((s, g) => s + g.target_amount, 0), currency) },
              ].map(({ label, value }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <View style={styles.heroStatDivider} />}
                  <View style={styles.heroStat}>
                    <Text style={styles.heroStatValue}>{value}</Text>
                    <Text style={styles.heroStatLabel}>{label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Lock Protection Notice */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeIconBox}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Savings Protection Active</Text>
            <Text style={styles.noticeText}>Locked savings are excluded from your spendable balance.</Text>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          {isLoading && savingsGoals.length === 0 ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : savingsGoals.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}><Ionicons name="trophy-outline" size={32} color={COLORS.dark.textMuted} /></View>
              <Text style={styles.emptyTitle}>No savings goals yet</Text>
              <Text style={styles.emptySubtitle}>Create your first goal to start building wealth</Text>
              <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setShowAddModal(true)}>
                <Text style={styles.emptyAddBtnText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            savingsGoals.map(goal => {
              const pct = getPercentage(goal.current_amount, goal.target_amount);
              const remaining = goal.target_amount - goal.current_amount;
              return (
                <View key={goal.id} style={[styles.goalCard, goal.completed && styles.goalCardCompleted]}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleRow}>
                      <View style={[styles.goalIconBox, { backgroundColor: goal.completed ? COLORS.success + '20' : COLORS.primary + '18' }]}>
                        <Ionicons name={goal.completed ? 'checkmark-circle-outline' : 'trophy-outline'} size={16} color={goal.completed ? COLORS.success : COLORS.primary} />
                      </View>
                      <View>
                        <Text style={styles.goalName}>{goal.goal_name}</Text>
                        {goal.completed && <Text style={styles.completedLabel}>Completed</Text>}
                      </View>
                    </View>
                    <TouchableOpacity style={[styles.lockBtn, { backgroundColor: goal.locked ? COLORS.primary + '15' : COLORS.warning + '15' }]} onPress={() => handleToggleLock(goal)}>
                      <Ionicons name={goal.locked ? 'lock-closed-outline' : 'lock-open-outline'} size={16} color={goal.locked ? COLORS.primary : COLORS.warning} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(100, pct)}%` as any, backgroundColor: goal.completed ? COLORS.success : pct > 75 ? COLORS.success : pct > 40 ? COLORS.warning : COLORS.primary }]} />
                  </View>
                  <View style={styles.goalStatsRow}>
                    <View>
                      <Text style={styles.goalSavedLabel}>Saved</Text>
                      <Text style={styles.goalSavedAmount}>{formatCurrency(goal.current_amount, currency)}</Text>
                    </View>
                    <View style={styles.goalPctBadge}>
                      <Text style={styles.goalPctText}>{pct.toFixed(0)}%</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.goalTargetLabel}>Target</Text>
                      <Text style={styles.goalTargetAmount}>{formatCurrency(goal.target_amount, currency)}</Text>
                    </View>
                  </View>
                  {!goal.completed && (
                    <Text style={styles.goalRemaining}>
                      {formatCurrency(remaining, currency)} remaining{goal.target_date ? ` · Due ${formatDate(goal.target_date, 'MMM d, yyyy')}` : ''}
                    </Text>
                  )}
                  {!goal.completed && (
                    <View style={styles.goalActions}>
                      <TouchableOpacity style={styles.addFundsBtn} onPress={() => { setSelectedGoal(goal); setShowFundModal(true); }}>
                        <Ionicons name="add-outline" size={15} color="#fff" />
                        <Text style={styles.addFundsBtnText}>Add Funds</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteGoalBtn} onPress={() => Alert.alert('Delete Goal', `Delete "${goal.goal_name}"?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deleteSavingsGoal(goal.id) }])}>
                        <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}><Text style={styles.modalCancel}>Cancel</Text></TouchableOpacity>
            <Text style={styles.modalTitle}>New Savings Goal</Text>
            <TouchableOpacity onPress={handleAddGoal} disabled={isSaving}>
              {isSaving ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={styles.modalSave}>Create</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {[
              { label: 'GOAL NAME', value: goalName, setter: setGoalName, placeholder: 'e.g. Emergency Fund, New Laptop', icon: 'trophy-outline' },
              { label: 'TARGET AMOUNT', value: targetAmount, setter: setTargetAmount, placeholder: '0.00', icon: 'cash-outline', keyboard: 'decimal-pad' },
              { label: 'TARGET DATE (OPTIONAL)', value: targetDate, setter: setTargetDate, placeholder: 'YYYY-MM-DD', icon: 'calendar-outline' },
            ].map(({ label, value, setter, placeholder, icon, keyboard }) => (
              <View key={label}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <View style={styles.fieldInputWrapper}>
                  <Ionicons name={icon as any} size={16} color={COLORS.dark.textMuted} />
                  <TextInput style={styles.fieldInput} placeholder={placeholder} placeholderTextColor={COLORS.dark.textMuted} value={value} onChangeText={setter} keyboardType={keyboard as any ?? 'default'} />
                </View>
              </View>
            ))}
            <View style={styles.lockNotice}>
              <Ionicons name="lock-closed-outline" size={15} color={COLORS.primary} />
              <Text style={styles.lockNoticeText}> Goal will be locked by default to protect your savings.</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Funds Modal */}
      <Modal visible={showFundModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFundModal(false)}><Text style={styles.modalCancel}>Cancel</Text></TouchableOpacity>
            <Text style={styles.modalTitle}>Add Funds</Text>
            <TouchableOpacity onPress={handleAddFunds} disabled={isSaving}>
              {isSaving ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={styles.modalSave}>Add</Text>}
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            {selectedGoal && (
              <View style={styles.selectedGoalInfo}>
                <Text style={styles.selectedGoalName}>{selectedGoal.goal_name}</Text>
                <Text style={styles.selectedGoalProgress}>{formatCurrency(selectedGoal.current_amount, currency)} / {formatCurrency(selectedGoal.target_amount, currency)}</Text>
              </View>
            )}
            <Text style={styles.fieldLabel}>AMOUNT TO ADD</Text>
            <TextInput style={styles.bigAmountInput} placeholder="0.00" placeholderTextColor={COLORS.dark.textMuted} value={fundAmount} onChangeText={setFundAmount} keyboardType="decimal-pad" autoFocus />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.5 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primary, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 9 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  heroSection: { paddingHorizontal: 24 },
  heroCard: { borderRadius: 22, padding: 26 },
  heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, fontWeight: '600', marginBottom: 8 },
  heroAmount: { fontSize: 38, fontWeight: '700', color: '#fff', letterSpacing: -1, marginBottom: 22 },
  heroStatsRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  heroStatDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },
  noticeCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginTop: 16, backgroundColor: COLORS.primary + '12', borderRadius: 14, padding: 14, gap: 12, borderWidth: 1, borderColor: COLORS.primary + '25' },
  noticeIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary + '20', alignItems: 'center', justifyContent: 'center' },
  noticeContent: { flex: 1 },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  noticeText: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: 24, marginTop: 28 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.dark.text, marginBottom: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.dark.card, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark.text },
  emptySubtitle: { fontSize: 13, color: COLORS.dark.textSecondary, textAlign: 'center' },
  emptyAddBtn: { backgroundColor: COLORS.primary, borderRadius: 13, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  emptyAddBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  goalCard: { backgroundColor: COLORS.dark.card, borderRadius: 18, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: COLORS.dark.border },
  goalCardCompleted: { borderColor: COLORS.success + '35' },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  goalIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  goalName: { fontSize: 15, fontWeight: '700', color: COLORS.dark.text },
  completedLabel: { fontSize: 11, color: COLORS.success, fontWeight: '600', marginTop: 2 },
  lockBtn: { padding: 9, borderRadius: 10 },
  progressBar: { height: 6, backgroundColor: COLORS.dark.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 14 },
  progressFill: { height: '100%', borderRadius: 3 },
  goalStatsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goalSavedLabel: { fontSize: 11, color: COLORS.dark.textSecondary, marginBottom: 2 },
  goalSavedAmount: { fontSize: 15, fontWeight: '700', color: COLORS.dark.text },
  goalPctBadge: { backgroundColor: COLORS.primary + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  goalPctText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  goalTargetLabel: { fontSize: 11, color: COLORS.dark.textSecondary, marginBottom: 2 },
  goalTargetAmount: { fontSize: 15, fontWeight: '700', color: COLORS.dark.text },
  goalRemaining: { fontSize: 12, color: COLORS.dark.textSecondary, marginBottom: 14 },
  goalActions: { flexDirection: 'row', gap: 10 },
  addFundsBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: COLORS.primary, borderRadius: 11, paddingVertical: 11 },
  addFundsBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  deleteGoalBtn: { backgroundColor: COLORS.danger + '15', borderRadius: 11, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.danger + '25' },
  modalContainer: { flex: 1, backgroundColor: COLORS.dark.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  modalCancel: { fontSize: 15, color: COLORS.dark.textSecondary },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark.text },
  modalSave: { fontSize: 15, color: COLORS.primary, fontWeight: '700' },
  modalBody: { flex: 1, padding: 24 },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: COLORS.dark.textMuted, letterSpacing: 1.2, marginBottom: 8, marginTop: 20 },
  fieldInputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dark.card, borderRadius: 13, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.dark.border },
  fieldInput: { flex: 1, paddingVertical: 13, fontSize: 15, color: COLORS.dark.text },
  lockNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '12', borderRadius: 12, padding: 14, marginTop: 24, borderWidth: 1, borderColor: COLORS.primary + '25' },
  lockNoticeText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  selectedGoalInfo: { alignItems: 'center', paddingVertical: 28 },
  selectedGoalName: { fontSize: 20, fontWeight: '700', color: COLORS.dark.text, marginBottom: 6 },
  selectedGoalProgress: { fontSize: 14, color: COLORS.dark.textSecondary },
  bigAmountInput: { fontSize: 48, fontWeight: '700', color: COLORS.dark.text, textAlign: 'center', paddingVertical: 20, letterSpacing: -2 },
});
