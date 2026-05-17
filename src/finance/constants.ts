import { ExpenseCategory, IncomeCategory } from '../types';

export const FINANCE_BLUE = '#4B8FE8';
export const FINANCE_BLUE_LIGHT = '#E8F1FD';

export const PAYMENT_CHANNELS = [
  '支付宝',
  '微信支付',
  '云闪付',
  '现金',
  'Honor Pay',
  '抖音支付',
  '多多支付',
  '京东支付',
  '美团支付',
  '滴滴支付',
  '其他',
] as const;

export const PAYMENT_APPS = [
  '淘宝',
  '拼多多',
  '京东',
  '抖音',
  '美团',
  '饿了么',
  '微信',
  '支付宝',
  '其他',
] as const;

export const EXPENSE_CATEGORY_LIST: {
  key: ExpenseCategory;
  label: string;
  color: string;
  icon: string;
}[] = [
  { key: 'food', label: '餐饮', color: '#F5C518', icon: '🍜' },
  { key: 'shopping', label: '购物', color: '#9B5DE5', icon: '🛍️' },
  { key: 'transport', label: '交通', color: '#5B7C99', icon: '🚌' },
  { key: 'communication', label: '通讯', color: '#4ECDC4', icon: '📱' },
  { key: 'clothing', label: '服饰', color: '#E76F51', icon: '👔' },
  { key: 'beauty', label: '美容', color: '#F28482', icon: '💄' },
  { key: 'housing', label: '住房', color: '#6D6875', icon: '🏠' },
  { key: 'travel', label: '旅行', color: '#2A9D8F', icon: '✈️' },
  { key: 'digital', label: '数码', color: '#457B9D', icon: '💻' },
  { key: 'medical', label: '医疗', color: '#E63946', icon: '💊' },
  { key: 'living', label: '生活', color: '#E07A5F', icon: '🏡' },
  { key: 'entertainment', label: '娱乐', color: '#F4A261', icon: '🎮' },
  { key: 'other', label: '其他', color: '#8D99AE', icon: '📦' },
];

export const INCOME_CATEGORY_LIST: {
  key: IncomeCategory;
  label: string;
  color: string;
  icon: string;
}[] = [
  { key: 'salary', label: '工资', color: '#2E9B6A', icon: '💰' },
  { key: 'bonus', label: '奖金', color: '#F4A261', icon: '🎁' },
  { key: 'investment', label: '理财', color: '#5B7C99', icon: '📈' },
  { key: 'gift', label: '红包', color: '#E63946', icon: '🧧' },
  { key: 'other_income', label: '其他', color: '#8D99AE', icon: '📥' },
];

export const CATEGORY_PAGES = [
  EXPENSE_CATEGORY_LIST.slice(0, 10),
  EXPENSE_CATEGORY_LIST.slice(10),
];

export function getExpenseCategoryMeta(key: ExpenseCategory) {
  return EXPENSE_CATEGORY_LIST.find((c) => c.key === key) ?? EXPENSE_CATEGORY_LIST[EXPENSE_CATEGORY_LIST.length - 1];
}

export function getIncomeCategoryMeta(key?: IncomeCategory) {
  return INCOME_CATEGORY_LIST.find((c) => c.key === key) ?? INCOME_CATEGORY_LIST[INCOME_CATEGORY_LIST.length - 1];
}

export function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatMonthLabel(year: number, month: number) {
  return `${year}/${String(month).padStart(2, '0')}`;
}

export function formatDayHeader(dateStr: string, todayStr: string) {
  const [, m, d] = dateStr.split('-');
  const suffix = dateStr === todayStr ? ' 今天' : '';
  return `${m}.${d}${suffix}`;
}

export function parseAmountInput(raw: string): number | null {
  const v = parseFloat(raw);
  if (!raw || Number.isNaN(v) || v <= 0) return null;
  return Math.round(v * 100) / 100;
}
