// ============================================================
// Smart Finance AI - Complete TypeScript Types
// ============================================================

// ---- Auth ----
export interface AuthUser {
  id: string;
  email: string;
}

// ---- Profile ----
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  currency: string;
  monthly_income_goal: number;
  savings_goal: number;
  avatar_url: string | null;
  theme: 'dark' | 'light';
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Income ----
export type IncomeType = 'salary' | 'freelance' | 'business' | 'side_hustle' | 'bonus' | 'other';

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  income_type: IncomeType;
  source_name: string;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIncomeDto {
  amount: number;
  income_type: IncomeType;
  source_name: string;
  note?: string;
  date: string;
}

// ---- Expense ----
export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'bills'
  | 'internet'
  | 'shopping'
  | 'entertainment'
  | 'subscriptions'
  | 'health'
  | 'education'
  | 'savings'
  | 'emergency'
  | 'other';

export type PaymentMethod = 'cash' | 'momo' | 'bank' | 'card';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  note: string | null;
  payment_method: PaymentMethod;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseDto {
  amount: number;
  category: ExpenseCategory;
  note?: string;
  payment_method: PaymentMethod;
  date: string;
}

// ---- Budget ----
export interface Budget {
  id: string;
  user_id: string;
  needs_percentage: number;
  wants_percentage: number;
  savings_percentage: number;
  monthly_limit: number;
  alert_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetAnalysis {
  totalIncome: number;
  needsAllocation: number;
  wantsAllocation: number;
  savingsAllocation: number;
  totalExpenses: number;
  safeToSpend: number;
  spentPercentage: number;
  isOverBudget: boolean;
  categoryBreakdown: CategorySpend[];
}

export interface CategorySpend {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  limit: number;
  isOver: boolean;
}

// ---- Savings ----
export interface SavingsGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  locked: boolean;
  target_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSavingsGoalDto {
  goal_name: string;
  target_amount: number;
  current_amount?: number;
  locked?: boolean;
  target_date?: string;
}

// ---- Notification ----
export type NotificationType =
  | 'overspending'
  | 'low_balance'
  | 'savings_protection'
  | 'weekly_report'
  | 'income_reminder'
  | 'goal_progress'
  | 'system';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read_status: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ---- Analytics ----
export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryAnalytics {
  category: ExpenseCategory;
  amount: number;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export interface IncomeAnalytics {
  type: IncomeType;
  amount: number;
  percentage: number;
  count: number;
}

export interface WeekdaySpend {
  day: string;
  amount: number;
}

// ---- AI Insights ----
export interface FinancialInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement' | 'info';
  title: string;
  message: string;
  icon: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

// ---- Dashboard ----
export interface DashboardStats {
  totalBalance: number;
  spendableBalance: number;
  lockedSavings: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  salaryTotal: number;
  freelanceTotal: number;
}

// ---- Transaction (combined) ----
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  label: string;
  category?: ExpenseCategory;
  income_type?: IncomeType;
  payment_method?: PaymentMethod;
  date: string;
  note?: string | null;
  created_at: string;
}

// ---- UI State ----
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  dateFrom?: string;
  dateTo?: string;
  category?: ExpenseCategory;
  income_type?: IncomeType;
  payment_method?: PaymentMethod;
  searchQuery?: string;
}
