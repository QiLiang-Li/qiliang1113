import { ExpenseCategory } from './types';
import { EXPENSE_CATEGORY_LIST, getExpenseCategoryMeta } from './finance/constants';

export const COLORS = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#8E8E93',
  border: '#EBEBED',
  income: '#2E9B6A',
  incomeBg: '#E8F6EF',
  expense: '#1A1A1A',
  expenseBg: '#FBECEC',
  accent: '#4B8FE8',
  accentLight: '#E8F1FD',
  tabInactive: '#9A9A9A',
};

export const EXPENSE_CATEGORIES = EXPENSE_CATEGORY_LIST;

export function getCategoryMeta(category: ExpenseCategory) {
  return getExpenseCategoryMeta(category);
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

export function isSameMonth(dateStr: string, year: number, month: number) {
  const [y, m] = dateStr.split('-').map(Number);
  return y === year && m === month;
}

export function sumByType(
  items: { type: string; amount: number }[],
  type: 'income' | 'expense'
) {
  return items.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
}
