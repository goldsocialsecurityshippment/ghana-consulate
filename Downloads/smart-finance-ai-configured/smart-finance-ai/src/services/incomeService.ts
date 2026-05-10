// ============================================================
// Smart Finance AI - Income Service
// ============================================================

import { supabase } from './supabase';
import { Income, CreateIncomeDto, IncomeType } from '../types';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export const incomeService = {
  /**
   * Get all incomes for user
   */
  getAll: async (userId: string, options?: {
    dateFrom?: string;
    dateTo?: string;
    income_type?: IncomeType;
    limit?: number;
  }): Promise<Income[]> => {
    let query = supabase
      .from('incomes')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (options?.dateFrom) query = query.gte('date', options.dateFrom);
    if (options?.dateTo) query = query.lte('date', options.dateTo);
    if (options?.income_type) query = query.eq('income_type', options.income_type);
    if (options?.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Get incomes for current month
   */
  getCurrentMonth: async (userId: string): Promise<Income[]> => {
    const now = new Date();
    const from = format(startOfMonth(now), 'yyyy-MM-dd');
    const to = format(endOfMonth(now), 'yyyy-MM-dd');
    return incomeService.getAll(userId, { dateFrom: from, dateTo: to });
  },

  /**
   * Get income by ID
   */
  getById: async (id: string): Promise<Income> => {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Create new income
   */
  create: async (userId: string, dto: CreateIncomeDto): Promise<Income> => {
    const { data, error } = await supabase
      .from('incomes')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update income
   */
  update: async (id: string, updates: Partial<CreateIncomeDto>): Promise<Income> => {
    const { data, error } = await supabase
      .from('incomes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Delete income
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('incomes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  /**
   * Get monthly totals by type (last N months)
   */
  getMonthlyTotals: async (userId: string, months: number = 6): Promise<
    Array<{ month: string; type: IncomeType; total: number }>
  > => {
    const from = format(
      new Date(new Date().setMonth(new Date().getMonth() - months)),
      'yyyy-MM-dd'
    );
    const { data, error } = await supabase
      .from('incomes')
      .select('amount, income_type, date')
      .eq('user_id', userId)
      .gte('date', from)
      .order('date', { ascending: true });
    if (error) throw error;

    // Group by month + type
    const grouped: Record<string, Record<string, number>> = {};
    (data ?? []).forEach((row) => {
      const month = row.date.substring(0, 7); // YYYY-MM
      if (!grouped[month]) grouped[month] = {};
      grouped[month][row.income_type] = (grouped[month][row.income_type] ?? 0) + row.amount;
    });

    const result: Array<{ month: string; type: IncomeType; total: number }> = [];
    Object.entries(grouped).forEach(([month, types]) => {
      Object.entries(types).forEach(([type, total]) => {
        result.push({ month, type: type as IncomeType, total });
      });
    });
    return result;
  },

  /**
   * Get total income for a period
   */
  getTotalForPeriod: async (userId: string, dateFrom: string, dateTo: string): Promise<number> => {
    const { data, error } = await supabase
      .from('incomes')
      .select('amount')
      .eq('user_id', userId)
      .gte('date', dateFrom)
      .lte('date', dateTo);
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + row.amount, 0);
  },
};
