// ============================================================
// Smart Finance AI - Expense Service
// ============================================================

import { supabase } from './supabase';
import { Expense, CreateExpenseDto, ExpenseCategory } from '../types';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';

export const expenseService = {
  /**
   * Get all expenses for user with optional filters
   */
  getAll: async (userId: string, options?: {
    dateFrom?: string;
    dateTo?: string;
    category?: ExpenseCategory;
    searchQuery?: string;
    limit?: number;
  }): Promise<Expense[]> => {
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (options?.dateFrom) query = query.gte('date', options.dateFrom);
    if (options?.dateTo) query = query.lte('date', options.dateTo);
    if (options?.category) query = query.eq('category', options.category);
    if (options?.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error) throw error;

    let result = data ?? [];

    // Client-side search filter
    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.note?.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.payment_method.toLowerCase().includes(q)
      );
    }

    return result;
  },

  /**
   * Get current month expenses
   */
  getCurrentMonth: async (userId: string): Promise<Expense[]> => {
    const now = new Date();
    return expenseService.getAll(userId, {
      dateFrom: format(startOfMonth(now), 'yyyy-MM-dd'),
      dateTo: format(endOfMonth(now), 'yyyy-MM-dd'),
    });
  },

  /**
   * Get expenses by ID
   */
  getById: async (id: string): Promise<Expense> => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Create expense
   */
  create: async (userId: string, dto: CreateExpenseDto): Promise<Expense> => {
    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update expense
   */
  update: async (id: string, updates: Partial<CreateExpenseDto>): Promise<Expense> => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Delete expense
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Get category breakdown for a period
   */
  getCategoryBreakdown: async (
    userId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<Array<{ category: ExpenseCategory; total: number; count: number }>> => {
    const { data, error } = await supabase
      .from('expenses')
      .select('category, amount')
      .eq('user_id', userId)
      .gte('date', dateFrom)
      .lte('date', dateTo);
    if (error) throw error;

    const grouped: Record<string, { total: number; count: number }> = {};
    (data ?? []).forEach((row) => {
      if (!grouped[row.category]) grouped[row.category] = { total: 0, count: 0 };
      grouped[row.category].total += row.amount;
      grouped[row.category].count += 1;
    });

    return Object.entries(grouped).map(([category, stats]) => ({
      category: category as ExpenseCategory,
      total: stats.total,
      count: stats.count,
    }));
  },

  /**
   * Get monthly totals (last N months)
   */
  getMonthlyTotals: async (
    userId: string,
    months: number = 6
  ): Promise<Array<{ month: string; total: number }>> => {
    const from = format(subMonths(new Date(), months), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('expenses')
      .select('amount, date')
      .eq('user_id', userId)
      .gte('date', from)
      .order('date', { ascending: true });
    if (error) throw error;

    const grouped: Record<string, number> = {};
    (data ?? []).forEach((row) => {
      const month = row.date.substring(0, 7);
      grouped[month] = (grouped[month] ?? 0) + row.amount;
    });

    return Object.entries(grouped).map(([month, total]) => ({ month, total }));
  },

  /**
   * Get spending by day of week
   */
  getWeekdaySpending: async (userId: string): Promise<Array<{ day: string; amount: number }>> => {
    const from = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('expenses')
      .select('amount, date')
      .eq('user_id', userId)
      .gte('date', from);
    if (error) throw error;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const totals: Record<string, number> = {};
    days.forEach((d) => (totals[d] = 0));

    (data ?? []).forEach((row) => {
      const dayIndex = new Date(row.date).getDay();
      totals[days[dayIndex]] += row.amount;
    });

    return days.map((day) => ({ day, amount: totals[day] }));
  },

  /**
   * Get total for a period
   */
  getTotalForPeriod: async (userId: string, dateFrom: string, dateTo: string): Promise<number> => {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('date', dateFrom)
      .lte('date', dateTo);
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + row.amount, 0);
  },
};
