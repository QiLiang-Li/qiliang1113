import { ExpenseCategory } from './types';

export const COLORS = {
  background: '#F7F5F2',
  card: '#FFFFFF',
  text: '#2C2C2C',
  textSecondary: '#6B6B6B',
  border: '#E8E4DF',
  income: '#2E9B6A',
  incomeBg: '#E8F6EF',
  expense: '#D45C5C',
  expenseBg: '#FBECEC',
  accent: '#5B7C99',
  accentLight: '#E8EEF3',
  tabInactive: '#9A9A9A',
};

export const EXPENSE_CATEGORIES: {
  key: ExpenseCategory;
  label: string;
  color: string;
}[] = [
  { key: 'living', label: '生活开支', color: '#E07A5F' },
  { key: 'shopping', label: '购物', color: '#9B5DE5' },
  { key: 'entertainment', label: '娱乐', color: '#F4A261' },
  { key: 'transport', label: '交通', color: '#5B7C99' },
  { key: 'food', label: '餐饮', color: '#2A9D8F' },
  { key: 'other', label: '其他', color: '#8D99AE' },
];

export function getCategoryMeta(category: ExpenseCategory) {
  return EXPENSE_CATEGORIES.find((c) => c.key === category) ?? EXPENSE_CATEGORIES[5];
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatMoney(amount: number): string {
  return amount.toFixed(2);
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
