import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useFinanceStore } from '../../state/financeStore';
import { COLORS, CATEGORY_CONFIG, NEEDS_CATEGORIES, WANTS_CATEGORIES } from '../../constants';
import { formatCurrency, getProgressColor, getPercentage, daysRemainingInMonth } from '../../utils';

export default function BudgetScreen() {
  const { user, profile } = useAuthStore();
  const { budget, budgetAnalysis, dashboardStats, isLoading, isRefreshing, loadAll, refreshAll, updateBudget } = useFinanceStore();
  const [editMode, setEditMode] = useState(false);
  const [needsPct, setNeedsPct] = useState('50');
  const [wantsPct, setWantsPct] = useState('30');
  const [savingsPct, setSavingsPct] = useState('20');
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [isSaving, setIsSaving] = useState(false);
  const currency = profile?.currency ?? 'GHS';

  useEffect(() => { if (user?.id) loadAll(user.id); }, [user?.id]);
  useEffect(() => {
    if (budget) {
      setNeedsPct(budget.needs_percentage.toString());
      setWantsPct(budget.wants_percentage.toString());
      setSavingsPct(budget.savings_percentage.toString());
      setAlertThreshold(budget.alert_threshold.toString());
    }
  }, [budget]);

  const handleSaveBudget = async () => {
    const n = parseFloat(needsPct), w = parseFloat(wantsPct), s = parseFloat(savingsPct);
    if (isNaN(n) || isNaN(w) || isNaN(s)) { Alert.alert('Invalid values', 'Please enter valid percentages.'); return; }
    if (Math.round(n + w + s) !== 100) { Alert.alert('Invalid Budget', `Must add up to 100%. Currently: ${n + w + s}%`); return; }
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await updateBudget(user.id, { needs_percentage: n, wants_percentage: w, savings_percentage: s, alert_threshold: parseFloat(alertThreshold) || 80 });
      setEditMode(false);
    } catch (e: any) { Alert.alert('Error', e.message); }
    finally { setIsSaving(false); }
  };

  const totalIncome = dashboardStats?.totalIncome ?? 0;
  const totalExpenses = dashboardStats?.totalExpenses ?? 0;
  const safeToSpend = dashboardStats?.spendableBalance ?? 0;
  const daysLeft = daysRemainingInMonth();
  const dailySafe = daysLeft > 0 ? safeToSpend / daysLeft : 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => user?.id && refreshAll(user.id)} tintColor={COLORS.primary} />}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Budget</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => editMode ? handleSaveBudget() : setEditMode(true)} disabled={isSaving}>
            {isSaving ? <ActivityIndicator size="small" color={COLORS.primary} /> : (
              <View style={styles.editBtnInner}>
                <Ionicons name={editMode ? 'checkmark-outline' : 'pencil-outline'} size={15} color={COLORS.primary} />
                <Text style={styles.editBtnText}>{editMode ? 'Save' : 'Edit'}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Safe to Spend Hero */}
        <View style={styles.heroSection}>
          <LinearGradient colors={safeToSpend > 0 ? ['#00C896', '#00A87A'] : ['#E84545', '#C01A1A']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.heroLabel}>SAFE TO SPEND</Text>
            <Text style={styles.heroAmount}>{formatCurrency(safeToSpend, currency)}</Text>
            <View style={styles.heroDailyRow}>
              <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.75)" />
              <Text style={styles.heroDailyText}> {formatCurrency(dailySafe, currency)}/day · {daysLeft} days remaining</Text>
            </View>
            {budgetAnalysis?.isOverBudget && (
              <View style={styles.overBudgetBadge}>
                <Ionicons name="warning-outline" size={13} color="#fff" />
                <Text style={styles.overBudgetText}> Budget threshold exceeded</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Allocation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Allocation</Text>
          {editMode ? (
            <View style={styles.editCard}>
              <View style={styles.editHintRow}>
                <Ionicons name="information-circle-outline" size={15} color={COLORS.warning} />
                <Text style={styles.editHint}> Allocations must add up to 100%</Text>
              </View>
              {[
                { label: 'Needs', sublabel: 'Essentials', value: needsPct, setter: setNeedsPct, color: COLORS.info, icon: 'home-outline' },
                { label: 'Wants', sublabel: 'Lifestyle', value: wantsPct, setter: setWantsPct, color: COLORS.warning, icon: 'happy-outline' },
                { label: 'Savings', sublabel: 'Future', value: savingsPct, setter: setSavingsPct, color: COLORS.success, icon: 'trending-up-outline' },
                { label: 'Alert at', sublabel: 'Threshold', value: alertThreshold, setter: setAlertThreshold, color: COLORS.danger, icon: 'notifications-outline' },
              ].map(({ label, sublabel, value, setter, color, icon }) => (
                <View key={label} style={styles.editRow}>
                  <View style={styles.editRowLeft}>
                    <View style={[styles.editRowIcon, { backgroundColor: color + '18' }]}>
                      <Ionicons name={icon as any} size={15} color={color} />
                    </View>
                    <View>
                      <Text style={styles.editLabel}>{label}</Text>
                      <Text style={styles.editSublabel}>{sublabel}</Text>
                    </View>
                  </View>
                  <View style={styles.editInputRow}>
                    <TextInput style={[styles.editInput, { borderColor: color + '60' }]} value={value} onChangeText={setter} keyboardType="decimal-pad" maxLength={5} />
                    <Text style={styles.editPctSymbol}>%</Text>
                  </View>
                </View>
              ))}
              <View style={styles.editTotalRow}>
                <Text style={styles.editTotalLabel}>Total</Text>
                <Text style={[styles.editTotalValue, { color: Math.round(parseFloat(needsPct || '0') + parseFloat(wantsPct || '0') + parseFloat(savingsPct || '0')) === 100 ? COLORS.success : COLORS.danger }]}>
                  {(parseFloat(needsPct || '0') + parseFloat(wantsPct || '0') + parseFloat(savingsPct || '0')).toFixed(0)}%
                </Text>
              </View>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.allocRow}>
              {[
                { label: 'Needs', pct: budget?.needs_percentage ?? 50, amount: totalIncome * (budget?.needs_percentage ?? 50) / 100, color: COLORS.info, icon: 'home-outline' },
                { label: 'Wants', pct: budget?.wants_percentage ?? 30, amount: totalIncome * (budget?.wants_percentage ?? 30) / 100, color: COLORS.warning, icon: 'happy-outline' },
                { label: 'Savings', pct: budget?.savings_percentage ?? 20, amount: totalIncome * (budget?.savings_percentage ?? 20) / 100, color: COLORS.success, icon: 'trending-up-outline' },
              ].map(({ label, pct, amount, color, icon }) => (
                <View key={label} style={[styles.allocCard, { borderTopColor: color }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                  <Text style={[styles.allocPct, { color }]}>{pct}%</Text>
                  <Text style={styles.allocLabel}>{label}</Text>
                  <Text style={styles.allocAmount}>{formatCurrency(amount, currency)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Spending Progress */}
        {budgetAnalysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Spending</Text>
            <View style={styles.card}>
              <View style={styles.spendHeaderRow}>
                <View>
                  <Text style={styles.spendLabel}>Spent this month</Text>
                  <Text style={styles.spendAmount}>{formatCurrency(totalExpenses, currency)}</Text>
                </View>
                <View style={styles.spendRight}>
                  <Text style={[styles.spendPct, { color: getProgressColor(budgetAnalysis.spentPercentage) }]}>{budgetAnalysis.spentPercentage.toFixed(0)}%</Text>
                  <Text style={styles.spendOf}>of income</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(100, budgetAnalysis.spentPercentage)}%` as any, backgroundColor: getProgressColor(budgetAnalysis.spentPercentage) }]} />
              </View>
              <View style={styles.spendFooterRow}>
                <Ionicons name="notifications-outline" size={13} color={COLORS.dark.textMuted} />
                <Text style={styles.spendFooterText}> Alert at {budget?.alert_threshold ?? 80}% · {budgetAnalysis.isOverBudget ? 'Threshold exceeded' : 'Within budget'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Breakdown */}
        {budgetAnalysis && budgetAnalysis.categoryBreakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            {budgetAnalysis.categoryBreakdown.sort((a, b) => b.amount - a.amount).map(cat => {
              const config = CATEGORY_CONFIG[cat.category];
              const usedPct = getPercentage(cat.amount, cat.limit);
              return (
                <View key={cat.category} style={styles.catCard}>
                  <View style={styles.catHeaderRow}>
                    <View style={styles.catLeft}>
                      <View style={[styles.catIconBox, { backgroundColor: config.color + '18' }]}>
                        <Ionicons name={config.icon as any} size={17} color={config.color} />
                      </View>
                      <View>
                        <Text style={styles.catName}>{config.label}</Text>
                        <Text style={styles.catGroup}>{NEEDS_CATEGORIES.includes(cat.category) ? 'Needs' : WANTS_CATEGORIES.includes(cat.category) ? 'Wants' : 'Savings'}</Text>
                      </View>
                    </View>
                    <View style={styles.catRight}>
                      <Text style={[styles.catAmount, cat.isOver && { color: COLORS.danger }]}>{formatCurrency(cat.amount, currency)}</Text>
                      {cat.isOver && <Text style={styles.overLabel}>Over limit</Text>}
                    </View>
                  </View>
                  <View style={styles.catProgressBar}>
                    <View style={[styles.catProgressFill, { width: `${Math.min(100, usedPct)}%` as any, backgroundColor: cat.isOver ? COLORS.danger : config.color }]} />
                  </View>
                  <Text style={styles.catLimit}>Limit: {formatCurrency(cat.limit, currency)} · {usedPct.toFixed(0)}% used</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>50/30/20 Rule</Text>
          <View style={styles.tipsCard}>
            {[
              { tip: '50% for needs: rent, food, transport, utilities', icon: 'home-outline', color: COLORS.info },
              { tip: '30% for wants: entertainment, dining out, shopping', icon: 'happy-outline', color: COLORS.warning },
              { tip: '20% for savings: emergency fund, investments', icon: 'trending-up-outline', color: COLORS.success },
              { tip: 'Set alert at 80% to get notified before overspending', icon: 'notifications-outline', color: COLORS.danger },
            ].map(({ tip, icon, color }) => (
              <View key={tip} style={styles.tipRow}>
                <View style={[styles.tipIconBox, { backgroundColor: color + '15' }]}>
                  <Ionicons name={icon as any} size={15} color={color} />
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  heroSection: { paddingHorizontal: 24, marginBottom: 4 },
  heroCard: { borderRadius: 22, padding: 26 },
  heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, fontWeight: '600', marginBottom: 8 },
  heroAmount: { fontSize: 42, fontWeight: '700', color: '#fff', letterSpacing: -1, marginBottom: 14 },
  heroDailyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, alignSelf: 'flex-start' },
  heroDailyText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  overBudgetBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  overBudgetText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  section: { paddingHorizontal: 24, marginTop: 28 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.dark.text, marginBottom: 14, letterSpacing: -0.2 },
  allocRow: { flexDirection: 'row', gap: 10 },
  allocCard: { flex: 1, backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 16, alignItems: 'center', borderTopWidth: 3, borderWidth: 1, borderColor: COLORS.dark.border, gap: 4 },
  allocPct: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  allocLabel: { fontSize: 12, color: COLORS.dark.textSecondary, fontWeight: '500' },
  allocAmount: { fontSize: 11, color: COLORS.dark.text, fontWeight: '600', textAlign: 'center' },
  editCard: { backgroundColor: COLORS.dark.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.dark.border },
  editHintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  editHint: { fontSize: 13, color: COLORS.warning },
  editRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  editRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  editRowIcon: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  editLabel: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  editSublabel: { fontSize: 11, color: COLORS.dark.textMuted, marginTop: 1 },
  editInputRow: { flexDirection: 'row', alignItems: 'center' },
  editInput: { backgroundColor: COLORS.dark.surface, borderRadius: 10, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 8, fontSize: 18, fontWeight: '700', color: COLORS.dark.text, width: 66, textAlign: 'center' },
  editPctSymbol: { fontSize: 16, color: COLORS.dark.textSecondary, marginLeft: 6 },
  editTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.dark.border, marginTop: 4 },
  editTotalLabel: { fontSize: 14, color: COLORS.dark.textSecondary, fontWeight: '500' },
  editTotalValue: { fontSize: 18, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  cancelBtnText: { color: COLORS.dark.textSecondary, fontSize: 14 },
  card: { backgroundColor: COLORS.dark.card, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: COLORS.dark.border },
  spendHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  spendLabel: { fontSize: 12, color: COLORS.dark.textSecondary, marginBottom: 4 },
  spendAmount: { fontSize: 26, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.5 },
  spendRight: { alignItems: 'flex-end' },
  spendPct: { fontSize: 28, fontWeight: '700' },
  spendOf: { fontSize: 12, color: COLORS.dark.textSecondary },
  progressBar: { height: 6, backgroundColor: COLORS.dark.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', borderRadius: 3 },
  spendFooterRow: { flexDirection: 'row', alignItems: 'center' },
  spendFooterText: { fontSize: 12, color: COLORS.dark.textMuted },
  catCard: { backgroundColor: COLORS.dark.card, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.dark.border },
  catHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catIconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  catName: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  catGroup: { fontSize: 11, color: COLORS.dark.textMuted, marginTop: 2 },
  catRight: { alignItems: 'flex-end' },
  catAmount: { fontSize: 15, fontWeight: '700', color: COLORS.dark.text },
  overLabel: { fontSize: 10, color: COLORS.danger, fontWeight: '700', marginTop: 2 },
  catProgressBar: { height: 5, backgroundColor: COLORS.dark.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  catProgressFill: { height: '100%', borderRadius: 3 },
  catLimit: { fontSize: 11, color: COLORS.dark.textMuted },
  tipsCard: { backgroundColor: COLORS.dark.card, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: COLORS.dark.border, gap: 14 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  tipIconBox: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  tipText: { flex: 1, fontSize: 13, color: COLORS.dark.textSecondary, lineHeight: 19 },
});
