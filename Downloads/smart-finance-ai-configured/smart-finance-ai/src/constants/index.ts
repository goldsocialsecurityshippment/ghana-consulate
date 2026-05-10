// ============================================================
// Smart Finance AI - App Constants (Professional)
// ============================================================

import { ExpenseCategory, IncomeType, PaymentMethod } from '../types';

export const COLORS = {
  primary: '#5B5FEF',
  primaryLight: '#7B7FF5',
  primaryDark: '#3D41CC',
  accent: '#00C896',
  accentLight: '#00E5AB',

  dark: {
    bg: '#080810',
    surface: '#0F0F1A',
    card: '#15151F',
    cardElevated: '#1C1C28',
    border: '#22222E',
    text: '#F0F0FF',
    textSecondary: '#7A7A9A',
    textMuted: '#44445A',
    divider: '#1A1A26',
  },

  light: {
    bg: '#F5F5FB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    cardElevated: '#F8F8FF',
    border: '#E0E0EE',
    text: '#0A0A1F',
    textSecondary: '#555577',
    textMuted: '#9999BB',
    divider: '#EEEEEE',
  },

  success: '#00C896',
  warning: '#F5A623',
  danger: '#E84545',
  info: '#3D9BF5',

  salary: '#00C896',
  freelance: '#5B5FEF',
  business: '#F5A623',
  side_hustle: '#3D9BF5',
  bonus: '#C45FEF',
  other_income: '#7A7A9A',

  food: '#E84545',
  transport: '#3D9BF5',
  bills: '#F5A623',
  internet: '#7B7FF5',
  shopping: '#E8459A',
  entertainment: '#3DBFF5',
  subscriptions: '#F5C623',
  health: '#00C896',
  education: '#1A6EF5',
  savings: '#00C896',
  emergency: '#C41A1A',
  other: '#7A7A9A',

  gradients: {
    primary: ['#5B5FEF', '#3D41CC'],
    success: ['#00C896', '#00A87A'],
    card: ['#15151F', '#0F0F1A'],
    balance: ['#5B5FEF', '#00C896'],
  },
} as const;

export const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; icon: string; color: string }> = {
  food:          { label: 'Food & Dining',    icon: 'restaurant-outline',          color: '#E84545' },
  transport:     { label: 'Transport',         icon: 'car-outline',                 color: '#3D9BF5' },
  bills:         { label: 'Bills & Utilities', icon: 'receipt-outline',             color: '#F5A623' },
  internet:      { label: 'Internet',          icon: 'wifi-outline',                color: '#7B7FF5' },
  shopping:      { label: 'Shopping',          icon: 'bag-outline',                 color: '#E8459A' },
  entertainment: { label: 'Entertainment',     icon: 'film-outline',                color: '#3DBFF5' },
  subscriptions: { label: 'Subscriptions',     icon: 'repeat-outline',              color: '#F5C623' },
  health:        { label: 'Health & Medical',  icon: 'medkit-outline',              color: '#00C896' },
  education:     { label: 'Education',         icon: 'book-outline',                color: '#1A6EF5' },
  savings:       { label: 'Savings',           icon: 'save-outline',                color: '#00C896' },
  emergency:     { label: 'Emergency',         icon: 'warning-outline',             color: '#C41A1A' },
  other:         { label: 'Other',             icon: 'ellipsis-horizontal-outline', color: '#7A7A9A' },
};

export const INCOME_TYPE_CONFIG: Record<IncomeType, { label: string; icon: string; color: string; stable: boolean }> = {
  salary:      { label: 'Salary',      icon: 'briefcase-outline',    color: '#00C896', stable: true  },
  freelance:   { label: 'Freelance',   icon: 'laptop-outline',       color: '#5B5FEF', stable: false },
  business:    { label: 'Business',    icon: 'storefront-outline',   color: '#F5A623', stable: false },
  side_hustle: { label: 'Side Hustle', icon: 'flash-outline',        color: '#3D9BF5', stable: false },
  bonus:       { label: 'Bonus',       icon: 'star-outline',         color: '#C45FEF', stable: false },
  other:       { label: 'Other',       icon: 'cash-outline',         color: '#7A7A9A', stable: false },
};

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { label: string; icon: string; color: string }> = {
  cash:  { label: 'Cash',          icon: 'cash-outline',             color: '#00C896' },
  momo:  { label: 'Mobile Money',  icon: 'phone-portrait-outline',   color: '#F5A623' },
  bank:  { label: 'Bank Transfer', icon: 'business-outline',         color: '#5B5FEF' },
  card:  { label: 'Card',          icon: 'card-outline',             color: '#3D9BF5' },
};

export const CURRENCIES: Record<string, { symbol: string; name: string; flag: string }> = {
  GHS: { symbol: '₵',   name: 'Ghanaian Cedi',      flag: 'GH' },
  USD: { symbol: '$',   name: 'US Dollar',           flag: 'US' },
  EUR: { symbol: '€',   name: 'Euro',                flag: 'EU' },
  GBP: { symbol: '£',   name: 'British Pound',       flag: 'GB' },
  NGN: { symbol: '₦',   name: 'Nigerian Naira',      flag: 'NG' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling',     flag: 'KE' },
  ZAR: { symbol: 'R',   name: 'South African Rand',  flag: 'ZA' },
};

export const NEEDS_CATEGORIES: ExpenseCategory[] = ['food','transport','bills','internet','health','education','emergency'];
export const WANTS_CATEGORIES: ExpenseCategory[] = ['shopping','entertainment','subscriptions','other'];
export const SAVINGS_CATEGORIES: ExpenseCategory[] = ['savings'];

export const NOTIFICATION_ICONS: Record<string, string> = {
  overspending:       'warning-outline',
  low_balance:        'alert-circle-outline',
  savings_protection: 'lock-closed-outline',
  weekly_report:      'bar-chart-outline',
  income_reminder:    'wallet-outline',
  goal_progress:      'trophy-outline',
  system:             'information-circle-outline',
};

export const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
