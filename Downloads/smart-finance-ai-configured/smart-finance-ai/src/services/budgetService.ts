// ============================================================
// Smart Finance AI - Budget Service
// ============================================================

import { supabase } from './supabase';
import { Budget } from '../types';

export const budgetService = {
  /**
   * Get user budget (one per user)
   */
  get: async (userId: string): Promise<Budget | null> => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /**
   * Update budget percentages
   */
  update: async (userId: string, updates: Partial<Budget>): Promise<Budget> => {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Upsert budget (create or update)
   */
  upsert: async (userId: string, budget: Partial<Budget>): Promise<Budget> => {
    const { data, error } = await supabase
      .from('budgets')
      .upsert({ ...budget, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
