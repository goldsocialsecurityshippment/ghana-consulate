// Analytics Screen
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useFinanceStore } from '../../state/financeStore';
import { COLORS, CATEGORY_CONFIG, INCOME_TYPE_CONFIG } from '../../constants';
import { formatCurrency, getPercentage, formatMonthLabel } from '../../utils';
import { InsightsEngine } from '../../services/insightsEngine';
import { incomeService } from '../../services/incomeService';
import { expenseService } from '../../services/expenseService';
import { FinancialInsight, MonthlyTrend } from '../../types';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { user, profile } = useAuthStore();
  const { incomes, expenses, budget, savingsGoals, isRefreshing, refreshAll } = useFinanceStore();
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [weekdayData, setWeekdayData] = useState<Array<{ day: string; amount: number }>>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'trends' | 'categories' | 'habits'>('insights');
  const currency = profile?.currency ?? 'GHS';

  useEffect(() => { if (user?.id) loadAnalytics(); }, [user?.id, incomes.length, expenses.length]);

  const loadAnalytics = async () => {
    if (!user?.id) return;
    setIsLoadingAnalytics(true);
    try {
      const now = new Date();
      const lastMonthFrom = format(startOfMonth(subMonths(now, 1)), 'yyyy-MM-dd');
      const lastMonthTo = format(endOfMonth(subMonths(now, 1)), 'yyyy-MM-dd');
      const [lastMonthIncomes, lastMonthExpenses, weekday] = await Promise.all([
        incomeService.getAll(user.id, { dateFrom: lastMonthFrom, dateTo: lastMonthTo }),
        expenseService.getAll(user.id, { dateFrom: lastMonthFrom, dateTo: lastMonthTo }),
        expenseService.getWeekdaySpending(user.id),
      ]);
      setInsights(InsightsEngine.generate(incomes, expenses, lastMonthIncomes, lastMonthExpenses, budget, savingsGoals));
      setWeekdayData(weekday);
      const trends: MonthlyTrend[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(now, i);
        const from = format(startOfMonth(date), 'yyyy-MM-dd');
        const to = format(endOfMonth(date), 'yyyy-MM-dd');
        const [inc, exp] = await Promise.all([incomeService.getTotalForPeriod(user.id, from, to), expenseService.getTotalForPeriod(user.id, from, to)]);
        trends.push({ month: format(date, 'MMM yy'), income: inc, expenses: exp, savings: Math.max(0, inc - exp) });
      }
      setMonthlyTrends(trends);
      const currentFrom = format(startOfMonth(now), 'yyyy-MM-dd');
      const currentTo = format(endOfMonth(now), 'yyyy-MM-dd');
      const catBreakdown = await expenseService.getCategoryBreakdown(user.id, currentFrom, currentTo);
      const total = catBreakdown.reduce((s, c) => s + c.total, 0);
      setCategoryData(catBreakdown.map(c => ({ ...c, percentage: getPercentage(c.total, total) })).sort((a, b) => b.total - a.total));
    } catch (e) { console.error(e); }
    finally { setIsLoadingAnalytics(false); }
  };

  const insightTypeConfig = { warning: { color: COLORS.danger, icon: 'warning-outline' }, tip: { color: COLORS.primary, icon: 'bulb-outline' }, achievement: { color: COLORS.success, icon: 'trophy-outline' }, info: { color: COLORS.info, icon: 'information-circle-outline' } };

  const tabs = [{ id: 'insights', label: 'AI Insights', icon: 'sparkles-outline' }, { id: 'trends', label: 'Trends', icon: 'trending-up-outline' }, { id: 'categories', label: 'Categories', icon: 'grid-outline' }, { id: 'habits', label: 'Habits', icon: 'calendar-outline' }];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => user?.id && refreshAll(user.id)} tintColor={COLORS.primary} />}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSub}>Powered by your real data</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContent}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]} onPress={() => setActiveTab(tab.id as any)}>
              <Ionicons name={tab.icon as any} size={14} color={activeTab === tab.id ? '#fff' : COLORS.dark.textSecondary} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoadingAnalytics ? (
          <View style={styles.loadingSection}><ActivityIndicator color={COLORS.primary} size="large" /><Text style={styles.loadingText}>Analyzing your data...</Text></View>
        ) : (
          <View style={styles.content}>
            {/* AI INSIGHTS */}
            {activeTab === 'insights' && (
              insights.length === 0 ? (
                <View style={styles.emptySection}>
                  <View style={styles.emptyIcon}><Ionicons name="sparkles-outline" size={28} color={COLORS.dark.textMuted} /></View>
                  <Text style={styles.emptyTitle}>Add more transactions</Text>
                  <Text style={styles.emptySubtitle}>AI insights appear once you record income and expenses.</Text>
                </View>
              ) : insights.map(insight => {
                const cfg = insightTypeConfig[insight.type];
                return (
                  <View key={insight.id} style={[styles.insightCard, { borderLeftColor: cfg.color }]}>
                    <View style={[styles.insightIconBox, { backgroundColor: cfg.color + '18' }]}>
                      <Ionicons name={cfg.icon as any} size={18} color={cfg.color} />
                    </View>
                    <View style={styles.insightBody}>
                      <View style={styles.insightTitleRow}>
                        <Text style={styles.insightTitle}>{insight.title}</Text>
                        <View style={[styles.insightBadge, { backgroundColor: cfg.color + '18' }]}>
                          <Text style={[styles.insightBadgeText, { color: cfg.color }]}>{insight.priority.toUpperCase()}</Text>
                        </View>
                      </View>
                      <Text style={styles.insightMessage}>{insight.message}</Text>
                    </View>
                  </View>
                );
              })
            )}

            {/* TRENDS */}
            {activeTab === 'trends' && (
              <View>
                <Text style={styles.chartTitle}>Income vs Expenses (6 months)</Text>
                <View style={styles.barChartCard}>
                  {monthlyTrends.length === 0 ? (
                    <Text style={styles.noDataText}>No data yet</Text>
                  ) : (
                    <View style={styles.barChart}>
                      {monthlyTrends.map((t, i) => {
                        const maxVal = Math.max(...monthlyTrends.map(x => Math.max(x.income, x.expenses)), 1);
                        return (
                          <View key={i} style={styles.barGroup}>
                            <View style={styles.barPair}>
                              <View style={[styles.bar, { height: `${getPercentage(t.income, maxVal)}%`, backgroundColor: COLORS.success }]} />
                              <View style={[styles.bar, { height: `${getPercentage(t.expenses, maxVal)}%`, backgroundColor: COLORS.danger }]} />
                            </View>
                            <Text style={styles.barLabel}>{t.month}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
                <View style={styles.legendRow}>
                  {[{ color: COLORS.success, label: 'Income' }, { color: COLORS.danger, label: 'Expenses' }].map(({ color, label }) => (
                    <View key={label} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: color }]} />
                      <Text style={styles.legendText}>{label}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.trendSummaryRow}>
                  {[
                    { label: 'Avg Income', value: monthlyTrends.length > 0 ? monthlyTrends.reduce((s, t) => s + t.income, 0) / monthlyTrends.length : 0, color: COLORS.success },
                    { label: 'Avg Expenses', value: monthlyTrends.length > 0 ? monthlyTrends.reduce((s, t) => s + t.expenses, 0) / monthlyTrends.length : 0, color: COLORS.danger },
                    { label: 'Avg Savings', value: monthlyTrends.length > 0 ? monthlyTrends.reduce((s, t) => s + t.savings, 0) / monthlyTrends.length : 0, color: COLORS.primary },
                  ].map(({ label, value, color }) => (
                    <View key={label} style={styles.trendSumCard}>
                      <Text style={styles.trendSumLabel}>{label}</Text>
                      <Text style={[styles.trendSumValue, { color }]}>{formatCurrency(value, currency)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* CATEGORIES */}
            {activeTab === 'categories' && (
              <View>
                <Text style={styles.chartTitle}>Spending by Category</Text>
                {categoryData.length === 0 ? (
                  <View style={styles.emptySection}><Ionicons name="grid-outline" size={28} color={COLORS.dark.textMuted} /><Text style={styles.emptySubtitle}>No expense data this month</Text></View>
                ) : categoryData.map(cat => {
                  const config = CATEGORY_CONFIG[cat.category as keyof typeof CATEGORY_CONFIG];
                  return (
                    <View key={cat.category} style={styles.catRow}>
                      <View style={[styles.catIconBox, { backgroundColor: config?.color + '18' }]}>
                        <Ionicons name={config?.icon as any} size={17} color={config?.color} />
                      </View>
                      <View style={styles.catInfo}>
                        <View style={styles.catHeaderRow}>
                          <Text style={styles.catName}>{config?.label ?? cat.category}</Text>
                          <Text style={styles.catAmount}>{formatCurrency(cat.total, currency)}</Text>
                        </View>
                        <View style={styles.catProgressBar}>
                          <View style={[styles.catProgressFill, { width: `${cat.percentage}%` as any, backgroundColor: config?.color }]} />
                        </View>
                        <Text style={styles.catPct}>{cat.percentage.toFixed(0)}% · {cat.count} transactions</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* HABITS */}
            {activeTab === 'habits' && (
              <View>
                <Text style={styles.chartTitle}>Spending by Day of Week</Text>
                <View style={styles.barChartCard}>
                  {weekdayData.every(d => d.amount === 0) ? (
                    <Text style={styles.noDataText}>Not enough data yet</Text>
                  ) : (
                    <View style={styles.barChart}>
                      {weekdayData.map((d, i) => {
                        const maxVal = Math.max(...weekdayData.map(x => x.amount), 1);
                        const isWeekend = d.day === 'Sat' || d.day === 'Sun';
                        return (
                          <View key={i} style={styles.barGroup}>
                            <View style={styles.barPair}>
                              <View style={[styles.bar, { height: `${getPercentage(d.amount, maxVal)}%`, backgroundColor: isWeekend ? COLORS.warning : COLORS.primary }]} />
                            </View>
                            <Text style={styles.barLabel}>{d.day}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
                <View style={styles.savingsRateCard}>
                  {(() => {
                    const totalInc = incomes.reduce((s, i) => s + i.amount, 0);
                    const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
                    const rate = getPercentage(Math.max(0, totalInc - totalExp), totalInc);
                    return (
                      <>
                        <Text style={styles.savingsRateLabel}>Savings Rate This Month</Text>
                        <Text style={[styles.savingsRatePct, { color: rate >= 20 ? COLORS.success : rate >= 10 ? COLORS.warning : COLORS.danger }]}>{rate.toFixed(1)}%</Text>
                        <View style={styles.savingsRateBar}>
                          <View style={[styles.savingsRateFill, { width: `${Math.min(100, rate)}%` as any, backgroundColor: rate >= 20 ? COLORS.success : rate >= 10 ? COLORS.warning : COLORS.danger }]} />
                        </View>
                        <Text style={styles.savingsRateHint}>Target: 20% {rate >= 20 ? '· Achieved!' : `· ${(20 - rate).toFixed(1)}% to go`}</Text>
                      </>
                    );
                  })()}
                </View>
              </View>
            )}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const analyticsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.bg },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 2 },
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  tabsContent: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.dark.card, borderWidth: 1, borderColor: COLORS.dark.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.dark.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  loadingSection: { alignItems: 'center', paddingVertical: 60, gap: 14 },
  loadingText: { color: COLORS.dark.textSecondary, fontSize: 14 },
  content: { padding: 24 },
  chartTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dark.text, marginBottom: 14, letterSpacing: -0.2 },
  insightCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.dark.border, borderLeftWidth: 4, gap: 12 },
  insightIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  insightBody: { flex: 1 },
  insightTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  insightTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dark.text, flex: 1, marginRight: 8 },
  insightBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  insightBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  insightMessage: { fontSize: 13, color: COLORS.dark.textSecondary, lineHeight: 19 },
  emptySection: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { width: 60, height: 60, borderRadius: 18, backgroundColor: COLORS.dark.card, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark.text },
  emptySubtitle: { fontSize: 13, color: COLORS.dark.textSecondary, textAlign: 'center' },
  barChartCard: { backgroundColor: COLORS.dark.card, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: COLORS.dark.border, marginBottom: 12 },
  barChart: { flexDirection: 'row', height: 140, alignItems: 'flex-end', gap: 6 },
  barGroup: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barPair: { flexDirection: 'row', gap: 2, height: 110, alignItems: 'flex-end' },
  bar: { width: 10, borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, color: COLORS.dark.textSecondary, marginTop: 6, textAlign: 'center' },
  legendRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: COLORS.dark.textSecondary },
  trendSummaryRow: { flexDirection: 'row', gap: 10 },
  trendSumCard: { flex: 1, backgroundColor: COLORS.dark.card, borderRadius: 13, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.dark.border, gap: 4 },
  trendSumLabel: { fontSize: 11, color: COLORS.dark.textSecondary },
  trendSumValue: { fontSize: 13, fontWeight: '700' },
  catRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: COLORS.dark.card, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.dark.border },
  catIconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  catInfo: { flex: 1 },
  catHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catName: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  catAmount: { fontSize: 14, fontWeight: '700', color: COLORS.dark.text },
  catProgressBar: { height: 4, backgroundColor: COLORS.dark.surface, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  catProgressFill: { height: '100%', borderRadius: 2 },
  catPct: { fontSize: 11, color: COLORS.dark.textMuted },
  savingsRateCard: { backgroundColor: COLORS.dark.card, borderRadius: 18, padding: 24, borderWidth: 1, borderColor: COLORS.dark.border, alignItems: 'center', marginTop: 16, gap: 8 },
  savingsRateLabel: { fontSize: 13, color: COLORS.dark.textSecondary, fontWeight: '500' },
  savingsRatePct: { fontSize: 52, fontWeight: '700', letterSpacing: -2 },
  savingsRateBar: { width: '100%', height: 8, backgroundColor: COLORS.dark.surface, borderRadius: 4, overflow: 'hidden' },
  savingsRateFill: { height: '100%', borderRadius: 4 },
  savingsRateHint: { fontSize: 13, color: COLORS.dark.textSecondary },
  noDataText: { color: COLORS.dark.textMuted, textAlign: 'center', paddingVertical: 20, fontSize: 13 },
});

const styles = analyticsStyles;
