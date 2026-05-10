// ============================================================
// Smart Finance AI - Budget Engine (Real Financial Calculations)
// ============================================================

import { Budget, Expense, Income, BudgetAnalysis, CategorySpend, ExpenseCategory } from '../types';
import {
  NEEDS_CATEGORIES,
  WANTS_CATEGORIES,
  SAVINGS_CATEGORIES,
  CATEGORY_CONFIG,
} from '../constants';

export class BudgetEngine {
  /**
   * Calculate full budget analysis from real data
   */
  static analyze(
    incomes: Income[],
    expenses: Expense[],
    budget: Budget,
    lockedSavings: number
  ): BudgetAnalysis {
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Allocations based on budget percentages
    const needsAllocation = (totalIncome * budget.needs_percentage) / 100;
    const wantsAllocation = (totalIncome * budget.wants_percentage) / 100;
    const savingsAllocation = (totalIncome * budget.savings_percentage) / 100;

    // Safe to spend = income - expenses - locked savings
    const safeToSpend = Math.max(0, totalIncome - totalExpenses - lockedSavings);

    // Spent percentage
    const spendingLimit = budget.monthly_limit > 0 ? budget.monthly_limit : totalIncome;
    const spentPercentage = spendingLimit > 0 ? (totalExpenses / spendingLimit) * 100 : 0;

    // Category breakdown
    const categoryBreakdown = BudgetEngine.getCategoryBreakdown(
      expenses,
      totalIncome,
      budget
    );

    return {
      totalIncome,
      needsAllocation,
      wantsAllocation,
      savingsAllocation,
      totalExpenses,
      safeToSpend,
      spentPercentage,
      isOverBudget: totalExpenses > (spendingLimit * budget.alert_threshold) / 100,
      categoryBreakdown,
    };
  }

  /**
   * Get per-category spending vs limit
   */
  static getCategoryBreakdown(
    expenses: Expense[],
    totalIncome: number,
    budget: Budget
  ): CategorySpend[] {
    // Group expenses by category
    const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] ?? 0) + e.amount;
    });

    const categories = Object.keys(CATEGORY_CONFIG) as ExpenseCategory[];

    return categories
      .map((category) => {
        const amount = categoryTotals[category] ?? 0;
        if (amount === 0) return null;

        // Determine category limit based on budget group
        let budgetGroup = 0;
        if (NEEDS_CATEGORIES.includes(category)) {
          budgetGroup = (totalIncome * budget.needs_percentage) / 100;
        } else if (WANTS_CATEGORIES.includes(category)) {
          budgetGroup = (totalIncome * budget.wants_percentage) / 100;
        } else {
          budgetGroup = (totalIncome * budget.savings_percentage) / 100;
        }

        // Per-category limit = group limit / # of categories in group
        const groupCategories = NEEDS_CATEGORIES.includes(category)
          ? NEEDS_CATEGORIES
          : WANTS_CATEGORIES.includes(category)
          ? WANTS_CATEGORIES
          : SAVINGS_CATEGORIES;
        const limit = budgetGroup / groupCategories.length;
        const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;

        return {
          category,
          amount,
          percentage,
          limit,
          isOver: amount > limit,
        };
      })
      .filter(Boolean) as CategorySpend[];
  }

  /**
   * Calculate dashboard stats
   */
  static getDashboardStats(
    incomes: Income[],
    expenses: Expense[],
    lockedSavings: number
  ) {
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBalance = totalIncome - totalExpenses;
    const spendableBalance = Math.max(0, totalBalance - lockedSavings);
    const savingsRate = totalIncome > 0 ? (lockedSavings / totalIncome) * 100 : 0;

    const salaryTotal = incomes
      .filter((i) => i.income_type === 'salary')
      .reduce((sum, i) => sum + i.amount, 0);

    const freelanceTotal = incomes
      .filter((i) => i.income_type === 'freelance')
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      totalBalance,
      spendableBalance,
      lockedSavings,
      totalIncome,
      totalExpenses,
      savingsRate,
      salaryTotal,
      freelanceTotal,
    };
  }

  /**
   * Check if budget alert should be triggered
   */
  static shouldTriggerAlert(
    spent: number,
    limit: number,
    threshold: number
  ): { shouldAlert: boolean; percentage: number } {
    if (limit <= 0) return { shouldAlert: false, percentage: 0 };
    const percentage = (spent / limit) * 100;
    return { shouldAlert: percentage >= threshold, percentage };
  }

  /**
   * Get safe daily spending amount
   */
  static getDailyBudget(
    safeToSpend: number,
    daysRemaining: number
  ): number {
    if (daysRemaining <= 0) return 0;
    return safeToSpend / daysRemaining;
  }

  /**
   * Calculate months of remaining budget
   */
  static getMonthsRemaining(
    savings: number,
    monthlyExpenses: number
  ): number {
    if (monthlyExpenses <= 0) return Infinity;
    return savings / monthlyExpenses;
  }
}
