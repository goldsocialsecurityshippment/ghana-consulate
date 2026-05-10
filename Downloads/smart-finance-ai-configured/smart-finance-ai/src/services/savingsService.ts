// ============================================================
// Smart Finance AI - Savings Service
// ============================================================

import { supabase } from './supabase';
import { SavingsGoal, CreateSavingsGoalDto } from '../types';

export const savingsService = {
  getAll: async (userId: string): Promise<SavingsGoal[]> => {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<SavingsGoal> => {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (userId: string, dto: CreateSavingsGoalDto): Promise<SavingsGoal> => {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({ ...dto, user_id: userId, locked: true })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<SavingsGoal>): Promise<SavingsGoal> => {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Add funds to a savings goal
   */
  addFunds: async (id: string, amount: number): Promise<SavingsGoal> => {
    const goal = await savingsService.getById(id);
    const newAmount = Math.min(goal.current_amount + amount, goal.target_amount);
    const completed = newAmount >= goal.target_amount;
    return savingsService.update(id, { current_amount: newAmount, completed });
  },

  /**
   * Unlock savings goal (for withdrawal)
   */
  unlock: async (id: string): Promise<SavingsGoal> => {
    return savingsService.update(id, { locked: false });
  },

  /**
   * Lock savings goal
   */
  lock: async (id: string): Promise<SavingsGoal> => {
    return savingsService.update(id, { locked: true });
  },

  /**
   * Get total locked savings amount
   */
  getTotalLocked: async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('current_amount')
      .eq('user_id', userId)
      .eq('locked', true);
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + row.current_amount, 0);
  },
};
