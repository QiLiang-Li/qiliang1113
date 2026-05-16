export type ExpenseCategory =
  | 'living'
  | 'shopping'
  | 'entertainment'
  | 'transport'
  | 'food'
  | 'other';

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
  note: string;
  date: string;
  createdAt: string;
}

export interface AppData {
  diaries: DailyDiary[];
  essays: Essay[];
  transactions: Transaction[];
}
