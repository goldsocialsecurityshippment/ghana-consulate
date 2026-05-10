// ============================================================
// Smart Finance AI - AI Insights Engine
// Generates dynamic insights from real user financial data
// ============================================================

import { Income, Expense, Budget, SavingsGoal, FinancialInsight } from '../types';
import { format, subMonths, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { CATEGORY_CONFIG, INCOME_TYPE_CONFIG } from '../constants';

export class InsightsEngine {
  /**
   * Generate all insights from real user data
   */
  static generate(
    currentMonthIncomes: Income[],
    currentMonthExpenses: Expense[],
    lastMonthIncomes: Income[],
    lastMonthExpenses: Expense[],
    budget: Budget | null,
    savingsGoals: SavingsGoal[]
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];

    const currentIncome = currentMonthIncomes.reduce((s, i) => s + i.amount, 0);
    const currentExpenses = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
    const lastIncome = lastMonthIncomes.reduce((s, i) => s + i.amount, 0);
    const lastExpenses = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

    // 1. Income trend
    if (lastIncome > 0) {
      const incomeChange = ((currentIncome - lastIncome) / lastIncome) * 100;
      if (incomeChange >= 10) {
        insights.push({
          id: 'income-up',
          type: 'achievement',
          title: '📈 Income Increased',
          message: `Your income is up ${Math.abs(incomeChange).toFixed(1)}% compared to last month. Great progress!`,
          icon: '📈',
          actionable: false,
          priority: 'medium',
        });
      } else if (incomeChange <= -10) {
        insights.push({
          id: 'income-down',
          type: 'warning',
          title: '📉 Income Dropped',
          message: `Your income dropped ${Math.abs(incomeChange).toFixed(1)}% compared to last month. Consider diversifying income streams.`,
          icon: '📉',
          actionable: true,
          priority: 'high',
        });
      }
    }

    // 2. Freelance vs salary comparison
    const freelanceCurrent = currentMonthIncomes
      .filter((i) => i.income_type === 'freelance')
      .reduce((s, i) => s + i.amount, 0);
    const salaryLast = lastMonthIncomes
      .filter((i) => i.income_type === 'salary')
      .reduce((s, i) => s + i.amount, 0);
    const freelanceLast = lastMonthIncomes
      .filter((i) => i.income_type === 'freelance')
      .reduce((s, i) => s + i.amount, 0);

    if (freelanceLast > 0 && freelanceCurrent < freelanceLast * 0.7) {
      insights.push({
        id: 'freelance-drop',
        type: 'warning',
        title: '💻 Freelance Income Down',
        message: `Freelance income dropped compared to last month. Time to reach out to new clients?`,
        icon: '💻',
        actionable: true,
        priority: 'medium',
      });
    }

    // 3. Spending vs income ratio
    if (currentIncome > 0) {
      const spendingRatio = (currentExpenses / currentIncome) * 100;
      if (spendingRatio > 90) {
        insights.push({
          id: 'high-spend-ratio',
          type: 'warning',
          title: '🚨 High Spending Rate',
          message: `You've spent ${spendingRatio.toFixed(0)}% of your income this month. Very little left for savings.`,
          icon: '🚨',
          actionable: true,
          priority: 'high',
        });
      } else if (spendingRatio < 60) {
        insights.push({
          id: 'low-spend-ratio',
          type: 'achievement',
          title: '✅ Great Spending Control',
          message: `You've only spent ${spendingRatio.toFixed(0)}% of your income. You're saving well this month!`,
          icon: '✅',
          actionable: false,
          priority: 'low',
        });
      }
    }

    // 4. Category overspending
    if (lastExpenses > 0) {
      const categoryGroups: Record<string, { current: number; last: number }> = {};
      currentMonthExpenses.forEach((e) => {
        if (!categoryGroups[e.category]) categoryGroups[e.category] = { current: 0, last: 0 };
        categoryGroups[e.category].current += e.amount;
      });
      lastMonthExpenses.forEach((e) => {
        if (!categoryGroups[e.category]) categoryGroups[e.category] = { current: 0, last: 0 };
        categoryGroups[e.category].last += e.amount;
      });

      Object.entries(categoryGroups).forEach(([cat, vals]) => {
        if (vals.last > 0 && vals.current > vals.last * 1.25) {
          const increase = ((vals.current - vals.last) / vals.last) * 100;
          const label = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.label ?? cat;
          insights.push({
            id: `cat-up-${cat}`,
            type: 'warning',
            title: `💸 ${label} Spending Up`,
            message: `${label} costs increased ${increase.toFixed(0)}% this month. Review your spending in this category.`,
            icon: CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.emoji ?? '💸',
            actionable: true,
            priority: 'medium',
          });
        }
      });
    }

    // 5. Biggest spending category
    if (currentMonthExpenses.length > 0) {
      const catTotals: Record<string, number> = {};
      currentMonthExpenses.forEach((e) => {
        catTotals[e.category] = (catTotals[e.category] ?? 0) + e.amount;
      });
      const top = Object.entries(catTotals).sort(([, a], [, b]) => b - a)[0];
      if (top) {
        const [topCat, topAmount] = top;
        const label = CATEGORY_CONFIG[topCat as keyof typeof CATEGORY_CONFIG]?.label ?? topCat;
        insights.push({
          id: 'top-category',
          type: 'info',
          title: `🏷️ Top Spend: ${label}`,
          message: `Your biggest expense category this month is ${label} with ${((topAmount / currentExpenses) * 100).toFixed(0)}% of total spending.`,
          icon: CATEGORY_CONFIG[topCat as keyof typeof CATEGORY_CONFIG]?.emoji ?? '🏷️',
          actionable: false,
          priority: 'low',
        });
      }
    }

    // 6. Weekend spending analysis
    const weekendExpenses = currentMonthExpenses.filter((e) => {
      const day = getDay(new Date(e.date));
      return day === 0 || day === 6;
    });
    const weekdayExpenses = currentMonthExpenses.filter((e) => {
      const day = getDay(new Date(e.date));
      return day > 0 && day < 6;
    });

    const weekendTotal = weekendExpenses.reduce((s, e) => s + e.amount, 0);
    const weekdayTotal = weekdayExpenses.reduce((s, e) => s + e.amount, 0);

    if (weekendTotal > weekdayTotal * 0.5 && weekendExpenses.length > 0) {
      insights.push({
        id: 'weekend-spending',
        type: 'tip',
        title: '📅 Weekend Spending Spike',
        message: `You tend to overspend on weekends. Weekend spend is ${((weekendTotal / currentExpenses) * 100).toFixed(0)}% of your monthly total.`,
        icon: '📅',
        actionable: true,
        priority: 'medium',
      });
    }

    // 7. Savings goal progress
    savingsGoals.forEach((goal) => {
      const progress = goal.target_amount > 0
        ? (goal.current_amount / goal.target_amount) * 100
        : 0;
      if (progress >= 75 && !goal.completed) {
        insights.push({
          id: `goal-${goal.id}`,
          type: 'achievement',
          title: '🎯 Goal Almost Reached!',
          message: `You are ${progress.toFixed(0)}% closer to your "${goal.goal_name}" goal. Keep going!`,
          icon: '🎯',
          actionable: false,
          priority: 'medium',
        });
      }
    });

    // 8. Consistent savings check
    const hasSavingsThisMonth = currentMonthExpenses.some((e) => e.category === 'savings');
    if (hasSavingsThisMonth) {
      insights.push({
        id: 'saving-consistently',
        type: 'achievement',
        title: '💰 Saving Consistently',
        message: `You recorded savings this month. Building this habit will pay off significantly over time.`,
        icon: '💰',
        actionable: false,
        priority: 'low',
      });
    }

    // 9. No income recorded yet
    if (currentMonthIncomes.length === 0) {
      insights.push({
        id: 'no-income',
        type: 'tip',
        title: '📝 Record Your Income',
        message: `You haven't recorded any income this month. Add your earnings for accurate budget tracking.`,
        icon: '📝',
        actionable: true,
        priority: 'high',
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return insights.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }
}
