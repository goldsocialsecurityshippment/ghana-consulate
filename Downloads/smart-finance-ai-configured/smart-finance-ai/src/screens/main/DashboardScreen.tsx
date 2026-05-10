import React, { useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useFinanceStore } from '../../state/financeStore';
import { COLORS, CATEGORY_CONFIG, INCOME_TYPE_CONFIG } from '../../constants';
import { formatCurrency, formatDate, getPercentage, getProgressColor, daysRemainingInMonth } from '../../utils';

export default function DashboardScreen() {
  const { user, profile } = useAuthStore();
  const { dashboardStats, budgetAnalysis, incomes, expenses, savingsGoals, isLoading, isRefreshing, loadAll, refreshAll } = useFinanceStore();
  const currency = profile?.currency ?? 'GHS';

  useEffect(() => { if (user?.id) loadAll(user.id); }, [user?.id]);
  const onRefresh = useCallback(() => { if (user?.id) refreshAll(user.id); }, [user?.id]);

  const recentTransactions = [
    ...incomes.slice(0, 3).map(i => ({ ...i, txType: 'income' as const })),
    ...expenses.slice(0, 5).map(e => ({ ...e, txType: 'expense' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  const stats = dashboardStats;
  const daysLeft = daysRemainingInMonth();
  const dailyBudget = stats && daysLeft > 0 ? stats.spendableBalance / daysLeft : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (isLoading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your finances...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{profile?.full_name?.split(' ')[0] ?? 'there'}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.dark.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceSection}>
          <LinearGradient colors={['#5B5FEF', '#3D41CC']} style={styles.balanceCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(stats?.totalBalance ?? 0, currency)}</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <View style={styles.balanceItemHeader}>
                  <Ionicons name="wallet-outline" size={13} color="rgba(255,255,255,0.65)" />
                  <Text style={styles.balanceItemLabel}>Spendable</Text>
                </View>
                <Text style={styles.balanceItemValue}>{formatCurrency(stats?.spendableBalance ?? 0, currency)}</Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceItem}>
                <View style={styles.balanceItemHeader}>
                  <Ionicons name="lock-closed-outline" size={13} color="rgba(255,255,255,0.65)" />
                  <Text style={styles.balanceItemLabel}>Locked</Text>
                </View>
                <Text style={styles.balanceItemValue}>{formatCurrency(stats?.lockedSavings ?? 0, currency)}</Text>
              </View>
            </View>
            <View style={styles.dailyRow}>
              <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.65)" />
              <Text style={styles.dailyText}> {formatCurrency(dailyBudget, currency)}/day safe to spend • {daysLeft} days left</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Income', value: stats?.totalIncome ?? 0, icon: 'arrow-down-outline', color: COLORS.success },
            { label: 'Expenses', value: stats?.totalExpenses ?? 0, icon: 'arrow-up-outline', color: COLORS.danger },
          ].map(({ label, value, icon, color }) => (
            <View key={label} style={[styles.statCard, { borderLeftColor: color }]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIconBox, { backgroundColor: color + '18' }]}>
                  <Ionicons name={icon as any} size={15} color={color} />
                </View>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
              <Text style={[styles.statValue, { color }]}>{formatCurrency(value, currency)}</Text>
            </View>
          ))}
        </View>

        {/* Budget Overview */}
        {budgetAnalysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Overview</Text>
            <View style={styles.card}>
              <View style={styles.budgetHeaderRow}>
                <Text style={styles.budgetLabel}>Monthly spending</Text>
                <Text style={[styles.budgetPct, { color: getProgressColor(budgetAnalysis.spentPercentage) }]}>
                  {budgetAnalysis.spentPercentage.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(100, budgetAnalysis.spentPercentage)}%` as any, backgroundColor: getProgressColor(budgetAnalysis.spentPercentage) }]} />
              </View>
              <View style={styles.budgetAllocRow}>
                {[
                  { label: 'Needs', amount: budgetAnalysis.needsAllocation, color: COLORS.info },
                  { label: 'Wants', amount: budgetAnalysis.wantsAllocation, color: COLORS.warning },
                  { label: 'Savings', amount: budgetAnalysis.savingsAllocation, color: COLORS.success },
                ].map(({ label, amount, color }) => (
                  <View key={label} style={styles.allocItem}>
                    <View style={[styles.allocDot, { backgroundColor: color }]} />
                    <Text style={styles.allocLabel}>{label}</Text>
                    <Text style={styles.allocValue}>{formatCurrency(amount, currency)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Savings Goals */}
        {savingsGoals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savings Goals</Text>
              <Text style={styles.seeAll}>See all</Text>
            </View>
            {savingsGoals.slice(0, 2).map(goal => {
              const pct = getPercentage(goal.current_amount, goal.target_amount);
              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalRow}>
                    <View style={styles.goalLeft}>
                      <View style={styles.goalIcon}>
                        <Ionicons name={goal.locked ? 'lock-closed-outline' : 'lock-open-outline'} size={15} color={COLORS.primary} />
                      </View>
                      <Text style={styles.goalName}>{goal.goal_name}</Text>
                    </View>
                    <Text style={styles.goalPct}>{pct.toFixed(0)}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: COLORS.success }]} />
                  </View>
                  <View style={styles.goalAmounts}>
                    <Text style={styles.goalCurrent}>{formatCurrency(goal.current_amount, currency)}</Text>
                    <Text style={styles.goalTarget}>of {formatCurrency(goal.target_amount, currency)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Income Sources */}
        {((stats?.salaryTotal ?? 0) + (stats?.freelanceTotal ?? 0)) > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Income Sources</Text>
            <View style={styles.incomeSourceRow}>
              {stats?.salaryTotal ? (
                <View style={[styles.incomeSourceCard, { borderTopColor: COLORS.success }]}>
                  <Ionicons name="briefcase-outline" size={18} color={COLORS.success} />
                  <Text style={styles.incomeSourceLabel}>Salary</Text>
                  <Text style={[styles.incomeSourceValue, { color: COLORS.success }]}>{formatCurrency(stats.salaryTotal, currency)}</Text>
                </View>
              ) : null}
              {stats?.freelanceTotal ? (
                <View style={[styles.incomeSourceCard, { borderTopColor: COLORS.primary }]}>
                  <Ionicons name="laptop-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.incomeSourceLabel}>Freelance</Text>
                  <Text style={[styles.incomeSourceValue, { color: COLORS.primary }]}>{formatCurrency(stats.freelanceTotal, currency)}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={36} color={COLORS.dark.textMuted} />
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySubtitle}>Add your first income or expense</Text>
            </View>
          ) : (
            recentTransactions.map(tx => {
              const isIncome = tx.txType === 'income';
              const label = isIncome ? (tx as any).source_name : CATEGORY_CONFIG[(tx as any).category]?.label ?? (tx as any).category;
              const iconName = isIncome ? INCOME_TYPE_CONFIG[(tx as any).income_type]?.icon ?? 'cash-outline' : CATEGORY_CONFIG[(tx as any).category]?.icon ?? 'receipt-outline';
              const iconColor = isIncome ? COLORS.success : CATEGORY_CONFIG[(tx as any).category]?.color ?? COLORS.danger;
              return (
                <View key={tx.id} style={styles.txItem}>
                  <View style={[styles.txIcon, { backgroundColor: iconColor + '15' }]}>
                    <Ionicons name={iconName as any} size={19} color={iconColor} />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txLabel} numberOfLines={1}>{label}</Text>
                    <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: isIncome ? COLORS.success : COLORS.danger }]}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            {[
              { label: 'Add Income', icon: 'add-circle-outline', color: COLORS.success },
              { label: 'Add Expense', icon: 'remove-circle-outline', color: COLORS.danger },
              { label: 'Budget', icon: 'pie-chart-outline', color: COLORS.primary },
              { label: 'Save Goal', icon: 'trophy-outline', color: COLORS.warning },
            ].map(({ label, icon, color }) => (
              <TouchableOpacity key={label} style={styles.quickActionBtn}>
                <View style={[styles.quickActionIcon, { backgroundColor: color + '12', borderColor: color + '25' }]}>
                  <Ionicons name={icon as any} size={22} color={color} />
                </View>
                <Text style={styles.quickActionLabel}>{label}</Text>
              </TouchableOpacity>
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.dark.bg, gap: 16 },
  loadingText: { color: COLORS.dark.textSecondary, fontSize: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  greeting: { fontSize: 13, color: COLORS.dark.textSecondary, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '700', color: COLORS.dark.text, marginTop: 2, letterSpacing: -0.5 },
  notifBtn: { width: 40, height: 40, backgroundColor: COLORS.dark.card, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.dark.border },
  balanceSection: { paddingHorizontal: 24 },
  balanceCard: { borderRadius: 22, padding: 24 },
  balanceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, fontWeight: '600', marginBottom: 8 },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -1, marginBottom: 22 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  balanceItem: { flex: 1 },
  balanceItemHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  balanceItemLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  balanceItemValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
  balanceDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 16 },
  dailyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  dailyText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginTop: 16 },
  statCard: { flex: 1, backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 16, borderLeftWidth: 3, borderWidth: 1, borderColor: COLORS.dark.border },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  statIconBox: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 12, color: COLORS.dark.textSecondary, fontWeight: '600' },
  statValue: { fontSize: 17, fontWeight: '700', letterSpacing: -0.5 },
  section: { paddingHorizontal: 24, marginTop: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.dark.text, marginBottom: 14, letterSpacing: -0.2 },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  card: { backgroundColor: COLORS.dark.card, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: COLORS.dark.border },
  budgetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  budgetLabel: { fontSize: 13, color: COLORS.dark.textSecondary, fontWeight: '500' },
  budgetPct: { fontSize: 15, fontWeight: '700' },
  progressBar: { height: 5, backgroundColor: COLORS.dark.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 16 },
  progressFill: { height: '100%', borderRadius: 3 },
  budgetAllocRow: { flexDirection: 'row', justifyContent: 'space-between' },
  allocItem: { alignItems: 'center', gap: 4 },
  allocDot: { width: 6, height: 6, borderRadius: 3 },
  allocLabel: { fontSize: 11, color: COLORS.dark.textSecondary, fontWeight: '500' },
  allocValue: { fontSize: 12, color: COLORS.dark.text, fontWeight: '700' },
  goalCard: { backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.dark.border },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  goalLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  goalIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: COLORS.primary + '18', alignItems: 'center', justifyContent: 'center' },
  goalName: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  goalPct: { fontSize: 13, fontWeight: '700', color: COLORS.success },
  goalAmounts: { flexDirection: 'row', gap: 6, marginTop: 8 },
  goalCurrent: { fontSize: 13, fontWeight: '700', color: COLORS.dark.text },
  goalTarget: { fontSize: 13, color: COLORS.dark.textSecondary },
  incomeSourceRow: { flexDirection: 'row', gap: 12 },
  incomeSourceCard: { flex: 1, backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 16, borderTopWidth: 3, borderWidth: 1, borderColor: COLORS.dark.border, gap: 6 },
  incomeSourceLabel: { fontSize: 12, color: COLORS.dark.textSecondary, fontWeight: '500', marginTop: 4 },
  incomeSourceValue: { fontSize: 16, fontWeight: '700' },
  txItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.card, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.dark.border },
  txIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txLabel: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  txDate: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.dark.text },
  emptySubtitle: { fontSize: 13, color: COLORS.dark.textSecondary },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickActionBtn: { alignItems: 'center', flex: 1, gap: 8 },
  quickActionIcon: { width: 54, height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  quickActionLabel: { fontSize: 11, color: COLORS.dark.textSecondary, textAlign: 'center', fontWeight: '600' },
});
