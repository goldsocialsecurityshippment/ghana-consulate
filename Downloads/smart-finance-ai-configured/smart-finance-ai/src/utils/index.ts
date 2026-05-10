// ============================================================
// Smart Finance AI - Utility Functions
// ============================================================

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { CURRENCIES } from '../constants';

/**
 * Format currency with symbol
 */
export const formatCurrency = (amount: number, currency: string = 'GHS'): string => {
  const config = CURRENCIES[currency];
  const symbol = config?.symbol ?? currency;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
};

/**
 * Format date for display
 */
export const formatDate = (dateStr: string, pattern: string = 'MMM d, yyyy'): string => {
  try {
    return format(parseISO(dateStr), pattern);
  } catch {
    return dateStr;
  }
};

/**
 * Format relative time (e.g. "2 hours ago")
 */
export const formatRelativeTime = (dateStr: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Get percentage safely
 */
export const getPercentage = (value: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (value / total) * 100));
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

/**
 * Truncate text
 */
export const truncate = (text: string, maxLength: number = 30): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get month-year string for a date
 */
export const getMonthYear = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr + '-01'), 'MMMM yyyy');
  } catch {
    return dateStr;
  }
};

/**
 * Parse YYYY-MM month string to display label
 */
export const formatMonthLabel = (monthStr: string): string => {
  try {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return format(date, 'MMM yy');
  } catch {
    return monthStr;
  }
};

/**
 * Generate a unique temp ID for optimistic updates
 */
export const tempId = (): string => `temp_${Date.now()}_${Math.random()}`;

/**
 * Calculate days remaining in current month
 */
export const daysRemainingInMonth = (): number => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.getDate() - now.getDate() + 1;
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Format compact number (1.2K, 3.4M, etc.)
 */
export const formatCompact = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(0);
};

/**
 * Get color based on percentage (green -> yellow -> red)
 */
export const getProgressColor = (percentage: number): string => {
  if (percentage < 60) return '#00D4AA';
  if (percentage < 80) return '#FFB020';
  return '#FF4D6D';
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
