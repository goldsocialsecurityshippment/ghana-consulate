// ============================================================
// Smart Finance AI - Finance Store (Zustand)
// All financial data state management
// ============================================================

import { create } from 'zustand';
import {
  Income, Expense, Budget, SavingsGoal, AppNotification,
  CreateIncomeDto, CreateExpenseDto, CreateSavingsGoalDto,
  DashboardStats, BudgetAnalysis, FilterOptions,
} from '../types';
import { incomeService } from '../services/incomeService';
import { expenseService } from '../services/expenseService';
import { budgetService } from '../services/budgetService';
import { savingsService } from '../services/savingsService';
import { notificationService } from '../services/notificationService';
import { BudgetEngine } from '../services/budgetEngine';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface FinanceState {
  // Data
  incomes: Income[];
  expenses: Expense[];
  budget: Budget | null;
  savingsGoals: SavingsGoal[];
  notifications: AppNotification[];
  unreadCount: number;

  // Computed
  dashboardStats: DashboardStats | null;
  budgetAnalysis: BudgetAnalysis | null;

  // UI State
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Actions - Load
  loadAll: (userId: string) => Promise<void>;
  refreshAll: (userId: string) => Promise<void>;
  loadNotifications: (userId: string) => Promise<void>;

  // Actions - Income
  addIncome: (userId: string, dto: CreateIncomeDto) => Promise<void>;
  updateIncome: (id: string, dto: Partial<CreateIncomeDto>) => Promise<void>;
  deleteIncome: (id: string, userId: string) => Promise<void>;

  // Actions - Expense
  addExpense: (userId: string, dto: CreateExpenseDto) => Promise<void>;
  updateExpense: (id: string, dto: Partial<CreateExpenseDto>) => Promise<void>;
  deleteExpense: (id: string, userId: string) => Promise<void>;

  // Actions - Budget
  updateBudget: (userId: string, updates: Partial<Budget>) => Promise<void>;

  // Actions - Savings
  addSavingsGoal: (userId: string, dto: CreateSavingsGoalDto) => Promise<void>;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  addFundsToGoal: (id: string, amount: number) => Promise<void>;
  toggleGoalLock: (id: string, locked: boolean) => Promise<void>;

  // Actions - Notifications
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: (userId: string) => Promise<void>;

  // Helpers
  recomputeStats: () => void;
  clearError: () => void;
}

const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    from: format(startOfMonth(now), 'yyyy-MM-dd'),
    to: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  incomes: [],
  expenses: [],
  budget: null,
  savingsGoals: [],
  notifications: [],
  unreadCount: 0,
  dashboardStats: null,
  budgetAnalysis: null,
  isLoading: false,
  isRefreshing: false,
  error: null,

  // ---- Load All ----
  loadAll: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { from, to } = getCurrentMonthRange();
      const [incomes, expenses, budget, savingsGoals, notifications, unreadCount, lockedSavings] =
        await Promise.all([
          incomeService.getAll(userId, { dateFrom: from, dateTo: to }),
          expenseService.getAll(userId, { dateFrom: from, dateTo: to }),
          budgetService.get(userId),
          savingsService.getAll(userId),
          notificationService.getAll(userId),
          notificationService.getUnreadCount(userId),
          savingsService.getTotalLocked(userId),
        ]);

      set({ incomes, expenses, budget, savingsGoals, notifications, unreadCount });

      // Compute stats
      const dashboardStats = BudgetEngine.getDashboardStats(incomes, expenses, lockedSavings);
      const budgetAnalysis = budget
        ? BudgetEngine.analyze(incomes, expenses, budget, lockedSavings)
        : null;

      set({ dashboardStats, budgetAnalysis });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to load data' });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshAll: async (userId) => {
    set({ isRefreshing: true });
    await get().loadAll(userId);
    set({ isRefreshing: false });
  },

  loadNotifications: async (userId) => {
    const [notifications, unreadCount] = await Promise.all([
      notificationService.getAll(userId),
      notificationService.getUnreadCount(userId),
    ]);
    set({ notifications, unreadCount });
  },

  // ---- Income ----
  addIncome: async (userId, dto) => {
    try {
      const income = await incomeService.create(userId, dto);
      const incomes = [income, ...get().incomes];
      set({ incomes });
      get().recomputeStats();
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  updateIncome: async (id, dto) => {
    try {
      const updated = await incomeService.update(id, dto);
      const incomes = get().incomes.map((i) => (i.id === id ? updated : i));
      set({ incomes });
      get().recomputeStats();
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  deleteIncome: async (id, userId) => {
    // Optimistic update
    const prev = get().incomes;
    set({ incomes: prev.filter((i) => i.id !== id) });
    get().recomputeStats();
    try {
      await incomeService.delete(id);
    } catch (e: any) {
      set({ incomes: prev, error: e.message });
      get().recomputeStats();
    }
  },

  // ---- Expense ----
  addExpense: async (userId, dto) => {
    try {
      const expense = await expenseService.create(userId, dto);
      const expenses = [expense, ...get().expenses];
      set({ expenses });
      get().recomputeStats();

      // Check budget alerts
      const { budgetAnalysis, budget } = get();
      if (budget && budgetAnalysis) {
        const catSpend = budgetAnalysis.categoryBreakdown.find(
          (c) => c.category === dto.category
        );
        if (catSpend && catSpend.limit > 0) {
          const pct = (catSpend.amount / catSpend.limit) * 100;
          if (pct >= budget.alert_threshold) {
            notificationService.sendOverspendingAlert(userId, dto.category, pct).catch(() => {});
            get().loadNotifications(userId);
          }
        }
      }
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  updateExpense: async (id, dto) => {
    try {
      const updated = await expenseService.update(id, dto);
      const expenses = get().expenses.map((e) => (e.id === id ? updated : e));
      set({ expenses });
      get().recomputeStats();
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  deleteExpense: async (id, userId) => {
    const prev = get().expenses;
    set({ expenses: prev.filter((e) => e.id !== id) });
    get().recomputeStats();
    try {
      await expenseService.delete(id);
    } catch (e: any) {
      set({ expenses: prev, error: e.message });
      get().recomputeStats();
    }
  },

  // ---- Budget ----
  updateBudget: async (userId, updates) => {
    try {
      const updated = await budgetService.update(userId, updates);
      set({ budget: updated });
      get().recomputeStats();
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  // ---- Savings ----
  addSavingsGoal: async (userId, dto) => {
    try {
      const goal = await savingsService.create(userId, dto);
      set({ savingsGoals: [goal, ...get().savingsGoals] });
      get().recomputeStats();
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  updateSavingsGoal: async (id, updates) => {
    try {
      const updated = await savingsService.update(id, updates);
      const savingsGoals = get().savingsGoals.map((g) => (g.id === id ? updated : g));
      set({ savingsGoals });
      get().recomputeStats();
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  deleteSavingsGoal: async (id) => {
    const prev = get().savingsGoals;
    set({ savingsGoals: prev.filter((g) => g.id !== id) });
    try {
      await savingsService.delete(id);
      get().recomputeStats();
    } catch (e: any) {
      set({ savingsGoals: prev, error: e.message });
    }
  },

  addFundsToGoal: async (id, amount) => {
    try {
      const updated = await savingsService.addFunds(id, amount);
      const savingsGoals = get().savingsGoals.map((g) => (g.id === id ? updated : g));
      set({ savingsGoals });
      get().recomputeStats();

      // Check goal progress
      const pct = (updated.current_amount / updated.target_amount) * 100;
      if (pct >= 75) {
        // Trigger goal notification silently
      }
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  toggleGoalLock: async (id, locked) => {
    try {
      const updated = locked
        ? await savingsService.lock(id)
        : await savingsService.unlock(id);
      const savingsGoals = get().savingsGoals.map((g) => (g.id === id ? updated : g));
      set({ savingsGoals });
      get().recomputeStats();
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  // ---- Notifications ----
  markNotificationRead: async (id) => {
    await notificationService.markRead(id);
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, read_status: true } : n
    );
    const unreadCount = Math.max(0, get().unreadCount - 1);
    set({ notifications, unreadCount });
    notificationService.setBadgeCount(unreadCount);
  },

  markAllNotificationsRead: async (userId) => {
    await notificationService.markAllRead(userId);
    const notifications = get().notifications.map((n) => ({ ...n, read_status: true }));
    set({ notifications, unreadCount: 0 });
    notificationService.setBadgeCount(0);
  },

  // ---- Helpers ----
  recomputeStats: () => {
    const { incomes, expenses, budget, savingsGoals } = get();
    const lockedSavings = savingsGoals
      .filter((g) => g.locked)
      .reduce((sum, g) => sum + g.current_amount, 0);

    const dashboardStats = BudgetEngine.getDashboardStats(incomes, expenses, lockedSavings);
    const budgetAnalysis = budget
      ? BudgetEngine.analyze(incomes, expenses, budget, lockedSavings)
      : null;

    set({ dashboardStats, budgetAnalysis });
  },

  clearError: () => set({ error: null }),
}));
