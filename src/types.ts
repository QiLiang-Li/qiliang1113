export type ExpenseCategory =
  | 'food'
  | 'shopping'
  | 'transport'
  | 'communication'
  | 'clothing'
  | 'beauty'
  | 'housing'
  | 'travel'
  | 'digital'
  | 'medical'
  | 'living'
  | 'entertainment'
  | 'other';

export type IncomeCategory = 'salary' | 'bonus' | 'investment' | 'gift' | 'other_income';

export type TransactionType = 'income' | 'expense';

export interface DailyDiary {
  id: string;
  date: string;
  content: string;
  updatedAt: string;
}

export interface Essay {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: ExpenseCategory;
  incomeCategory?: IncomeCategory;
  note: string;
  date: string;
  time: string;
  channel: string;
  app: string;
  createdAt: string;
}

export interface AppData {
  diaries: DailyDiary[];
  essays: Essay[];
  transactions: Transaction[];
}
